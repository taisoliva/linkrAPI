import pool from "../configs/dbConn.js";

export async function findPostsByUserId(id) {
  console.log(typeof id);
  const client = await pool.connect();
  try {
    const query = `SELECT posts.*, users.name AS "user_name", users.picture AS "user_picture",
    users.id AS "user_id", likes.id AS "like_id", likes.user_id AS "like_user_id",
    like_users.name AS "like_user_name"
  FROM posts
  JOIN users ON users.id = posts.user_id
  LEFT JOIN likes ON likes.post_id = posts.id
  LEFT JOIN users AS like_users ON like_users.id = likes.user_id
  WHERE posts.user_id = ${id}
  ORDER BY posts.id DESC;
      `;
    const result = await client.query(query);

    const posts = result.rows;
    const postsWithLikes = [];

    // Agrupar os likes pelo post_id
    const likesMap = {};
    result.rows.forEach((row) => {
      if (row.like_id) {
        if (!likesMap[row.id]) {
          likesMap[row.id] = [];
        }
        likesMap[row.id].push({
          id: row.like_id,
          user_id: row.like_user_id,
          user_name: row.like_user_name,
        });
      }
    });

    // Verificar se o usuario curtiu cada post retornado
    posts.forEach((post) => {
      const postLikes = likesMap[post.id] || [];
      const userLiked = postLikes.some((like) => like.user_id === parseInt(id));
      const formattedPost = {
        ...post,
        likes: postLikes,
        userLiked: userLiked,
      };

      // Deletar informações que não preciso usar
      delete formattedPost.like_id;
      delete formattedPost.like_user_id;
      delete formattedPost.like_user_name;
      delete formattedPost.user_name;
      delete formattedPost.user_picture;

      postsWithLikes.push(formattedPost);
    });

    let uniqueArray = postsWithLikes.filter(
      (item, index, arr) => arr.findIndex((el) => el.id === item.id) === index
    );

    return uniqueArray;
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
    await client.query(`DELETE FROM likes WHERE user_id=$1 AND post_id=$2`, [user_id, id]);
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
}
export async function getPostsDB(user_id, offset) {
  const client = await pool.connect();
  const query = `SELECT posts.*, users.name AS "user_name", users.picture AS "user_picture",
    users.id AS "user_id", likes.id AS "like_id", likes.user_id AS "like_user_id",
    like_users.name AS "like_user_name", shares.id AS "share_id",
    shares.user_id AS "share_user_id", share_users.name AS "share_user_name"
    FROM posts
    JOIN users ON users.id = posts.user_id
    LEFT JOIN likes ON likes.post_id = posts.id
    LEFT JOIN users AS like_users ON like_users.id = likes.user_id
    LEFT JOIN shares ON shares.post_id = posts.id
    LEFT JOIN users AS share_users ON share_users.id = shares.user_id
    JOIN follows ON follows.followed_id = posts.user_id
    WHERE follows.user_id = $1
    ORDER BY posts.id DESC
    LIMIT 10
    OFFSET $2;`;

  try {
    const { rows: posts } = await client.query(query, [Number(user_id), offset]);
    const postsWithLikes = [];

    const likesMap = {};
    posts.forEach((row) => {
      if (row.like_id) {
        if (!likesMap[row.id]) {
          likesMap[row.id] = [];
        }
        likesMap[row.id].push({
          id: row.like_id,
          user_id: row.like_user_id,
          user_name: row.like_user_name,
        });
      }
    });

    const sharesMap = {};
    posts.forEach((row) => {
      if (row.share_id) {
        if (!sharesMap[row.id]) {
          sharesMap[row.id] = [];
        }

        const shareExists = sharesMap[row.id].some((share) => share.id === row.share_id);

        if (!shareExists) {
          sharesMap[row.id].push({
            id: row.share_id,
            user_id: row.share_user_id,
            user_name: row.share_user_name,
          });
        }
      }
    });

    posts.forEach((post) => {
      const postLikes = likesMap[post.id] || [];
      const postShare = sharesMap[post.id] || [];
      const userLiked = postLikes.some((like) => like.user_id === user_id);
      const formattedPost = {
        ...post,
        likes: postLikes,
        share: postShare,
        userLiked: userLiked,
      };

      delete formattedPost.like_id;
      delete formattedPost.like_user_id;
      delete formattedPost.like_user_name;
      delete formattedPost.share_id;
      delete formattedPost.share_user_id;
      delete formattedPost.share_user_name;
      postsWithLikes.push(formattedPost);
    });

    let uniqueArray = postsWithLikes.filter(
      (item, index, arr) => arr.findIndex((el) => el.id === item.id) === index
    );

    return uniqueArray;
  } catch (err) {
    console.error("Error retrieving posts with likes and users", err);
    throw err;
  } finally {
    client.release();
  }
}

// export async function getPostsDB(user_id, offset) {
//   const client = await pool.connect();

//   try {
//     const query = `SELECT posts.*, users.name AS "user_name", users.picture AS "user_picture",
//           users.id AS "user_id", likes.id AS "like_id", likes.user_id AS "like_user_id",
//           like_users.name AS "like_user_name", shares.id AS "share_id",
//           shares.user_id AS "share_user_id", share_users.name AS "share_user_name"
//           FROM posts
//           JOIN users ON users.id = posts.user_id
//           LEFT JOIN likes ON likes.post_id = posts.id
//           LEFT JOIN users AS like_users ON like_users.id = likes.user_id
//           LEFT JOIN shares ON shares.post_id = posts.id
//           LEFT JOIN users AS share_users ON share_users.id = shares.user_id
//           ORDER BY posts.id DESC
//           LIMIT 10 * $1
//           OFFSET $2;`;

//     const result = await client.query(query, [
//       Number(offset[0]),
//       Number(offset[1]),
//     ]);

//     const posts = result.rows;
//     const postsWithLikes = [];

//     const likesMap = {};
//     posts.forEach((row) => {
//       if (row.like_id) {
//         if (!likesMap[row.id]) {
//           likesMap[row.id] = [];
//         }
//         likesMap[row.id].push({
//           id: row.like_id,
//           user_id: row.like_user_id,
//           user_name: row.like_user_name,
//         });
//       }
//     });

//     const sharesMap = {};
//     posts.forEach((row) => {
//       if (row.share_id) {
//         if (!sharesMap[row.id]) {
//           sharesMap[row.id] = [];
//         }

//         const shareExists = sharesMap[row.id].some(
//           (share) => share.id === row.share_id
//         );

//         if (!shareExists) {
//           sharesMap[row.id].push({
//             id: row.share_id,
//             user_id: row.share_user_id,
//             user_name: row.share_user_name,
//           });
//         }
//       }
//     });

//     posts.forEach((post) => {
//       const postLikes = likesMap[post.id] || [];
//       const postShare = sharesMap[post.id] || [];
//       const userLiked = postLikes.some((like) => like.user_id === user_id);
//       const formattedPost = {
//         ...post,
//         likes: postLikes,
//         share: postShare,
//         userLiked: userLiked,
//       };

//       // Deletar informações que não preciso usar
//       delete formattedPost.like_id;
//       delete formattedPost.like_user_id;
//       delete formattedPost.like_user_name;
//       delete formattedPost.share_id;
//       delete formattedPost.share_user_id;
//       delete formattedPost.share_user_name;
//       postsWithLikes.push(formattedPost);
//     });

//     let uniqueArray = postsWithLikes.filter(
//       (item, index, arr) => arr.findIndex((el) => el.id === item.id) === index
//     );

//     return uniqueArray;
//   } catch (err) {
//     console.error("Error retrieving posts with likes and users", err);
//     throw err;
//   } finally {
//     client.release();
//   }
// }

export async function postShareDB(id, user_id) {
  const client = await pool.connect();

  try {
    const query = `INSERT INTO shares (user_id, post_id) VALUES ($1, $2)`;
    const result = await client.query(query, [user_id, id]);
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
