import pool from "../configs/dbConn.js";

export async function findProfileByUserId(id){
    const client = await pool.connect();
    const data = pool.query(`SELECT name, picture FROM users WHERE id=$1`,[id]);
    client.release();
    return data;
}