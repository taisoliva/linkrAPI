import pool from "../configs/dbConn.js";

const follow = async (id) => {
  const query = ``;
  const client = await pool.connect();
  try {
    await pool.query(query, [id]);

    return;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const unfollow = async (id) => {
  const query = ``;
  const client = await pool.connect();
  try {
    await client.query(query, [id]);

    return;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export default { follow, unfollow };
