import pool from "../configs/dbConn.js";

export async function findPostsByUserId(id, userId) {
  const client = await pool.connect();

  try {
    const queryPosts = `SELECT posts.*, users.name AS "user_name", users.picture AS "user_picture"
                          FROM posts
                          JOIN users ON users.id = posts.user_id
                          WHERE posts.user_id = ${id}
                          ORDER BY posts.id DESC
/*                           LIMIT 10 * $1
                          OFFSET $2  */;`;

    const resultPosts = await client.query(
      queryPosts /*  [
      Number(offset[0]),
      Number(offset[1]),
    ] */
    );

    const posts = resultPosts.rows;

    const postsIDs = posts.map((obj) => obj.id);

    const repostListQuery = `SELECT *
    FROM shares
    WHERE repost_id = ANY($1::int[])`;

    const repostListQueryResult = await client.query(repostListQuery, [postsIDs]);
    const repostList = repostListQueryResult.rows

    const filteredPostsIDs = postsIDs.filter((id) => {
      return !repostList.some((repost) => repost.repost_id === id);
    });

    const queryLikes = `SELECT likes.*, users.name AS "like_user_name" 
                          FROM likes
                          JOIN users ON users.id = likes.user_id
                          WHERE likes.post_id = ANY($1::int[])
                          `;
    const queryShares = `SELECT shares.*, users.name AS "share_user_name"
                           FROM shares
                           JOIN users ON users.id = shares.user_id
                           WHERE shares.post_id = ANY($1::int[])
                           `;

    const queryCommentsCount = `SELECT posts.id AS post_id, COUNT(comments.id) AS comments_count
                                  FROM posts
                                  LEFT JOIN comments ON posts.id = comments.post_id
                                  WHERE posts.id = ANY($1::int[])
                                  GROUP BY posts.id
                                `;

    const resultLikes = await client.query(queryLikes, [postsIDs]);
    const likes = resultLikes.rows;

    const resultShares = await client.query(queryShares, [postsIDs]);
    const shares = resultShares.rows;

    const resultCommentsCount = await client.query(queryCommentsCount, [
      filteredPostsIDs,
    ]);
    const commentsCount = resultCommentsCount.rows;
    repostList.map(repost => {
      commentsCount.push({ post_id: repost.repost_id, comments_count: commentsCount.filter(post => (post.post_id === repost.post_id))[0].comments_count })
    })

    const repostsIDs = shares.map((obj) => obj.repost_id);

    const postsWithLikes = [];
    const likesMap = {};

    likes.forEach((row) => {
      if (postsIDs.includes(row.post_id)) {
        if (!likesMap[row.post_id]) {
          likesMap[row.post_id] = [];
        }
        likesMap[row.post_id].push({
          id: row.id,
          user_id: row.user_id,
          user_name: row.like_user_name,
        });
      }
    });

    const sharesMap = {};
    shares.forEach((row) => {
      if (postsIDs.includes(row.post_id)) {
        if (!sharesMap[row.post_id]) {
          sharesMap[row.post_id] = [];
        }

        sharesMap[row.post_id].push({
          id: row.id,
          user_id: row.user_id,
          user_name: row.share_user_name,
          postID: row.post_id,
          repostID: row.repost_id,
        });
      }
    });

    shares.forEach((row) => {
        if (repostsIDs.includes(row.repost_id)) {
          if (likesMap[row.post_id]) {
            if (!likesMap[row.repost_id]) {
              likesMap[row.repost_id] = [];
            }

            likesMap[row.repost_id].push(...likesMap[row.post_id]);
          }
          if (sharesMap[row.post_id]) {
            if (!sharesMap[row.repost_id]) {
              sharesMap[row.repost_id] = [];
            }

            sharesMap[row.repost_id].push(...sharesMap[row.post_id]);
          }
        }
    });

    posts.forEach((post) => {
      const postLikes = likesMap[post.id] || [];
      const postShare = sharesMap[post.id] || [];
      const userLiked = postLikes.some((like) => like.user_id === userId);
      const totalComments = commentsCount.filter(
        (comment) => comment.post_id === post.id
      );

      const formattedPost = {
        ...post,
        likes: postLikes,
        shares: postShare,
        userLiked: userLiked,
        commentsCount: totalComments[0].comments_count,
      };
      // Deletar informações que não preciso usar

      postsWithLikes.push(formattedPost);
    });
    return postsWithLikes;
  } catch (err) {
    console.error("Error retrieving posts with likes and users", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getPostById(id) {
  const client = await pool.connect();
  const data = pool.query(`SELECT id, user_id FROM posts WHERE id=$1`, [id]);
  client.release();
  return data;
}

export async function modifyPost(description, id) {
  const client = await pool.connect();
  pool.query(`UPDATE posts SET description=$1 WHERE id=$2`, [description, id]);
  client.release();
}

export async function nukePost(id) {
  const client = await pool.connect();
  pool.query(`DELETE FROM posts WHERE id=$1`, [id]);
  client.release();
}

export async function createLinkDB(url, description, id) {
  const client = await pool.connect();
  try {
    client.query("BEGIN");
    // Inserir o novo post
    const insertPostQuery = `INSERT INTO posts (link, description, user_id) VALUES ($1, $2, $3) RETURNING id`;
    const postResult = await client.query(insertPostQuery, [
      url,
      description,
      id,
    ]);
    const postId = parseInt(postResult.rows[0].id);

    // Inserir as hashtags
    const insertHashtagsQuery2 = `INSERT INTO hashtags (post_id, hash_name)
          SELECT $1, unnest(regexp_matches($2, E'#[a-zA-Z0-9_]+', 'g'))
          FROM (VALUES (1)) AS p(post_id)
          WHERE strpos($2, '#') <> 0
    `;
    const insertHashtagsQuery = `INSERT INTO hashtags (post_id, hash_name)
    SELECT $1, substring(unnest(regexp_matches($2, E'#[a-zA-Z0-9_]+', 'g')), 2)
    FROM (VALUES (1)) AS p(post_id)
    WHERE strpos($2, '#') <> 0;
  `;

    await client.query(insertHashtagsQuery, [postId, description]);
    await client.query("COMMIT");
    return postId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function likedPostDB(id, user_id) {
  const client = await pool.connect();
  try {
    return client.query(
      `INSERT INTO likes (user_id, post_id) 
                                VALUES ($1, $2)`,
      [user_id, id]
    );
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function disLikedPostDB(id, user_id) {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM likes WHERE user_id=$1 AND post_id=$2`, [
      user_id,
      id,
    ]);
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getPostsDB(user_id, offset) {
  const client = await pool.connect();

  try {
    const queryPosts = `SELECT posts.*, users.name AS "user_name", users.picture AS "user_picture"
                    FROM posts
                    JOIN users ON users.id = posts.user_id
                    WHERE posts.user_id IN (
                        SELECT follows.followed_id
                        FROM follows
                        WHERE follows.user_id = $1
                    )
                    OR posts.user_id = $1
                    ORDER BY posts.id DESC;`;


    const resultPosts = await client.query(queryPosts, [
      user_id
    ]);

    const posts = resultPosts.rows;

    const postsIDs = posts.map((obj) => obj.id);

    const repostListQuery = `SELECT *
    FROM shares
    WHERE repost_id = ANY($1::int[])`;

    const repostListQueryResult = await client.query(repostListQuery, [postsIDs]);
    const repostList = repostListQueryResult.rows

    const filteredPostsIDs = postsIDs.filter((id) => {
      return !repostList.some((repost) => repost.repost_id === id);
    });

    const queryLikes = `SELECT likes.*, users.name AS "like_user_name" 
                        FROM likes
                        JOIN users ON users.id = likes.user_id
                        WHERE likes.post_id = ANY($1::int[])
                        `;
    const queryShares = `SELECT shares.*, users.name AS "share_user_name"
                         FROM shares
                         JOIN users ON users.id = shares.user_id
                         WHERE shares.post_id = ANY($1::int[])`;

    const queryCommentsCount = `SELECT posts.id AS post_id, COUNT(comments.id) AS comments_count
                         FROM posts
                         LEFT JOIN comments ON posts.id = comments.post_id
                         WHERE posts.id = ANY($1::int[])
                         GROUP BY posts.id
                       `;

    const resultLikes = await client.query(queryLikes, [postsIDs]);
    const likes = resultLikes.rows;

    const resultShares = await client.query(queryShares, [postsIDs]);
    const shares = resultShares.rows;

    const resultCommentsCount = await client.query(queryCommentsCount, [
      filteredPostsIDs,
    ]);
    const commentsCount = resultCommentsCount.rows;
    repostList.map(repost => {
      commentsCount.push({ post_id: repost.repost_id, comments_count: commentsCount.filter(post => (post.post_id === repost.post_id))[0].comments_count })
    })

    const repostsIDs = shares.map((obj) => obj.repost_id);

    const postsWithLikes = [];
    const likesMap = {};

    likes.forEach((row) => {
      if (postsIDs.includes(row.post_id)) {
        if (!likesMap[row.post_id]) {
          likesMap[row.post_id] = [];
        }
        likesMap[row.post_id].push({
          id: row.id,
          user_id: row.user_id,
          user_name: row.like_user_name,
        });
      }
    });

    const sharesMap = {};
    shares.forEach((row) => {
      if (postsIDs.includes(row.post_id)) {
        if (!sharesMap[row.post_id]) {
          sharesMap[row.post_id] = [];
        }

        sharesMap[row.post_id].push({
          id: row.id,
          user_id: row.user_id,
          user_name: row.share_user_name,
          postID: row.post_id,
          repostID: row.repost_id,
        });
      }
    });

    shares.forEach((row) => {
        if (repostsIDs.includes(row.repost_id)) {
          if (likesMap[row.post_id]) {
            if (!likesMap[row.repost_id]) {
              likesMap[row.repost_id] = [];
            }

            likesMap[row.repost_id].push(...likesMap[row.post_id]);
          }
          if (sharesMap[row.post_id]) {
            if (!sharesMap[row.repost_id]) {
              sharesMap[row.repost_id] = [];
            }

            sharesMap[row.repost_id].push(...sharesMap[row.post_id]);
          }
        }
    });

    posts.forEach((post) => {
      const postLikes = likesMap[post.id] || [];
      const postShare = sharesMap[post.id] || [];
      const userLiked = postLikes.some((like) => like.user_id === user_id);
      const totalComments = commentsCount.filter(
        (comment) => comment.post_id === post.id
      );

      const formattedPost = {
        ...post,
        likes: postLikes,
        shares: postShare,
        userLiked: userLiked,
        commentsCount: totalComments[0].comments_count,
      };
      postsWithLikes.push(formattedPost);
    });

    const limitPost = postsWithLikes.slice(Number(offset[1]), Number(offset[1]) + Number(offset[0] * 10))
    return limitPost;
  } catch (err) {
    console.error("Error retrieving posts with likes and users", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function postShareDB(id, user_id, repost) {
  const client = await pool.connect();

  try {
    const query = `INSERT INTO shares (user_id, post_id, repost_id ) VALUES ($1, $2, $3) RETURNING id`;
    const result = await client.query(query, [user_id, id, repost]);
    return result;
  } catch (err) {
    console.error("Error retrieving posts with likes and users", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getNewPostsQtnd(last) {
  const client = await pool.connect();

  const result = await client.query(
    `SELECT COUNT(*) FROM posts WHERE id > $1`,
    [last]
  );

  client.release();

  return result;
}
