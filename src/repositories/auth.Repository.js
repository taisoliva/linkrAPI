import pool from "../configs/dbConn.js";

export const saveRefreshToken = async (userId, refreshToken) => {
  const client = await pool.connect();
  try {
    const query = {
      text: `INSERT INTO tokens(refresh_token, user_id) VALUES($1, $2)`,
      values: [refreshToken, userId],
    };
    await client.query(query);
    return;
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
};

export const findUserByRefreshToken = async (refreshToken) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT t.*, u.name, u.email, u.picture AS avatar
      FROM tokens AS t
      JOIN users AS u ON t.user_id = u.id
      WHERE t.refresh_token = $1;`,
      [refreshToken]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error getting user", err);
    throw err;
  } finally {
    client.release();
  }
};

export const deleteRefreshToken = async (refreshToken) => {
  const client = await pool.connect();
  console.log("aqui" + refreshToken);
  try {
    const query = {
      text: `DELETE FROM tokens WHERE "refresh_token" = $1`,
      values: [refreshToken],
    };
    await client.query(query);
    return true;
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
};

export const findUserByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting user", err);
    throw err;
  } finally {
    client.release();
  }
};

export const createUser = async (userData) => {
  const client = await pool.connect();

  const columns = Object.keys(userData).join(", ");
  const placeholders = Object.keys(userData)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const query = `INSERT INTO users(${columns}) VALUES(${placeholders})`;
  try {
    const response = await client.query(query, Object.values(userData));
    return response.rows[0];
  } catch (err) {
    console.error("Error inserting new user", err);
    throw err;
  } finally {
    client.release();
  }
};