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

