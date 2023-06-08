import pool from "../configs/dbConn.js";

export const createUser = async (commentData) => {
  const client = await pool.connect();
  try {
    // Inserir o novo post
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
