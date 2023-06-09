import pool from "../configs/dbConn.js";

export async function findProfileByUserId(id) {
  const client = await pool.connect();
  const data = pool.query(`SELECT name, picture FROM users WHERE id=$1`, [id]);
  client.release();
  return data;
}

export async function findUserByName(name) {
  const client = await pool.connect();
  const query = `
    SELECT id, name, picture 
    FROM users
    WHERE name LIKE $1
    ORDER BY name`;

  try {
    const { rows: data } = await client.query(query, [`%${name}%`]);
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

export async function getFollowers(id) {
  const client = await pool.connect();
  const query = `SELECT u.id, u.name, u.picture 
    FROM users u
    LEFT JOIN follows f ON u.id = f.followed_id AND f.user_id = $1
    WHERE f.followed_id IS NOT NULL
    ORDER BY u.name`;

  try {
    const { rows: data } = await client.query(query, [id]);
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

