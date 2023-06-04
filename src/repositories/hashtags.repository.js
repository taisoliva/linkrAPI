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
  const query = `SELECT h.hash, h.count
    FROM hashs AS h
    WHERE h.hash = $1;`;
  const client = await pool.connect();
  try {
    const data = pool.query(query, [hash]);
    if (!data?.rows?.length) return null;

    return data;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export default { getHashRank, getHashDetail };
