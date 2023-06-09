import pool from "../configs/dbConn.js";
import { getPostsDB } from "../repositories/posts.repository.js";

const getHashRank = async (id) => {
  const query = `
    SELECT hash_name, COUNT(*) AS count
    FROM hashtags
    GROUP BY hash_name
    ORDER BY count DESC`;
  const client = await pool.connect();
  try {
    const data = await pool.query(query);
    if (!data?.rows?.length) return null;

    return data.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export async function getHashDetail(user_id, hashToSearch) {
  const client = await pool.connect();
  const queryPosts = `
    SELECT 
      p.id,
      p.link,
      p.description,
      p.user_id,
      u.name AS "user_name",
      u.picture AS "user_picture",
      u.id AS "user_id",
      COALESCE(pl.likes_count, 0) AS "likes_count"
    FROM
      posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS likes_count
        FROM likes
        GROUP BY post_id
      ) pl ON pl.post_id = p.id
      JOIN hashtags h ON h.post_id = p.id
      LEFT JOIN follows f ON f.followed_id = p.user_id AND f.user_id = $1
    WHERE
      h.hash_name = $2
    GROUP BY
      p.id, u.id, pl.likes_count
    ORDER BY
      p.id DESC;
  `;
  try {
    const { rows: hashs } = await client.query(queryPosts, [user_id, hashToSearch]);
    const posts = hashs.map((row) => ({
      id: row.id,
      link: row.link,
      description: row.description,
      user_id: row.user_id,
      user_name: row.user_name,
      user_picture: row.user_picture,
      likes_count: parseInt(row.likes_count),
      user_liked: false,
    }));

    return posts;
  } catch (err) {
    console.error("Error retrieving posts by hashtag", err);
    throw err;
  } finally {
    client.release();
  }
}

export default { getHashRank, getHashDetail };
