import pg from "pg";
import { config } from "dotenv";

config();

const DATABASE_URL = process.env.DATABASE_URL;
const { Pool } = pg;

const configDatabase = {
  connectionString: DATABASE_URL
};

if (process.env.MODE === "prod") configDatabase.ssl = true;

const pool = new Pool(configDatabase);

pool.connect((err, client, done) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to PostgreSQL database");
  done();
});

export default pool;