import pg from "pg";
import { config } from "dotenv";

config();

const DATABASE_URL = process.env.DATABASE_URL;
const { Pool } = pg;
const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to PostgreSQL database");
  done();
});

export default pool;
