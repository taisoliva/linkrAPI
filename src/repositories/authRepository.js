import pool from "../configs/dbConn.js";

export const saveRefreshToken = async (userId, refreshToken) => {
  const client = await pool.connect();
  try {
    const query = {
      text: `UPDATE users SET refresh_token = $1 WHERE id = $2`,
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
      `SELECT * FROM users WHERE refresh_token=$1`,
      [refreshToken]
    );
    console.debug(refreshToken);
    console.debug(result.rows);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting user", err);
    throw err;
  } finally {
    client.release();
  }
};

export const deleteRefreshToken = async (id) => {
  const client = await pool.connect();
  try {
    const query = {
      text: `UPDATE users SET "refresh_token" = $1 WHERE id = $2`,
      values: ["", id],
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
  const { name, email, password } = userData;

  const client = await pool.connect();
  try {
    const result = await client.query({
      text: "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
      values: [name, email.toLowerCase(), password],
    });

    return result;
  } catch (err) {
    console.error("Error inserting new user", err);
    throw err;
  } finally {
    client.release();
  }
};
