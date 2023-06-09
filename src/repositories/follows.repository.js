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

const following = async (user, friend) => {
  const query = `SELECT * FROM follows
  WHERE user_id = $1 AND followed_id = $2;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [user, friend]);

    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

async function getFollowers(id) {
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

export default { follow, unfollow, following, getFollowers };
