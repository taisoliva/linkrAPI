import pool from "../configs/dbConn.js";

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

const getHashDetail = async (hash) => {
  const hashToSearch = `#${hash}`;
  const query = `
    SELECT
      p.id,
      p.link,
      p.description,
      p.user_id,
      u.name AS "user_name",
      u.picture AS "user_picture",
      u.id AS "user_id",
      COUNT(l.id) AS "likes_count"
    FROM
      posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN likes l ON l.post_id = p.id
      LEFT JOIN users AS like_users ON like_users.id = l.user_id
      JOIN hashtags h ON h.post_id = p.id
    WHERE
      h.hash_name = $1
    GROUP BY
      p.id, u.id
    ORDER BY
      p.id DESC;
  `;
  const client = await pool.connect();
  try {
    const data = await client.query(query, [hashToSearch]);
    if (!data?.rows?.length) return null;
    const posts = data.rows.map((row) => ({
      id: row.id,
      link: row.link,
      description: row.description,
      user_id: row.user_id,
      user_name: row.user_name,
      user_picture: row.user_picture,
      likes_count: parseInt(row.likes_count),
      user_liked: false, // sem saber o id do user, não dá pra saber se ele curtiu ou não
    }));
    return posts;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};




export default { getHashRank, getHashDetail };
