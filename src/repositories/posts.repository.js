import pool from "../configs/dbConn.js";

export async function findPostsByUserId(id){
    const client = await pool.connect();
    const data = pool.query(`SELECT link, description, likes FROM post WHERE user_id=$1`,[id]);
    client.release();
    return data;
}