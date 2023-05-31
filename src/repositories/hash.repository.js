import pool from "../configs/dbConn.js";

const getHashRank = async (id) => {
  const query = `SELECT h.hash, h.count
    FROM hashs AS h
    ORDER BY h.count DESC
    LIMIT 10;`;
  try {
    const client = await pool.connect();
    const data = pool.query(query);
    if (data.rows.length === 0) {
      client.release();
      return null;
    }
    client.release();
    return data;
  } catch (err) {
    client.release();
    throw err;
  }
};

const getHashDetail = async (hash) => {
  const query = `SELECT h.hash, h.count
    FROM hashs AS h
    WHERE h.hash = $1;`;
  try {
    const client = await pool.connect();
    const data = pool.query(query, [hash]);
    if (data.rows.length === 0) {
      client.release();
      return null;
    }
    client.release();
    return data;
  } catch (err) {
    client.release();
    throw err;
  }
};

export default { getHashRank, getHashDetail };
