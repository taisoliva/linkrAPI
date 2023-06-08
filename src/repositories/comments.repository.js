import pool from "../configs/dbConn.js";

export const createUser = async (commentData) => {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO comments (post_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *`;
    const result = await client.query(query, [
      commentData.post_id,
      commentData.user_id,
      commentData.comment,
    ]);

    return result.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export const getCommentsFromPostId = async (post_id) => {
  const client = await pool.connect();
  try {
    const query = `SELECT comments.*, users.name, users.picture
                    FROM comments
                    JOIN users ON users.id = comments.user_id
                    WHERE comments.post_id = $1
                  `;
    const result = await client.query(query, [post_id]);

    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
