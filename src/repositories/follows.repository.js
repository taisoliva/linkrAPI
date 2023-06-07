import pool from "../configs/dbConn.js";

const follow = async (user, friend) => {
  const query = `INSERT INTO follows (user_id, followed_id)
  VALUES ($1, $2);`;
  const client = await pool.connect();
  try {
    console.log("following");
    await pool.query(query, [user, friend]);
    console.log("followed");
    return;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const unfollow = async (user, friend) => {
  const query = `DELETE FROM follows
  WHERE user_id = $1 AND followed_id = $2;`;
  const client = await pool.connect();
  try {
    await client.query(query, [user, friend]);

    return;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export default { follow, unfollow };
