import pool from "../configs/dbConn.js";

export async function findPostsByUserId(id) {
    const client = await pool.connect();
    const data = pool.query(`SELECT id, link, description, likes FROM posts WHERE user_id=$1`, [id]);
    client.release();
    return data;
}

export async function getPostById(id) {
    const client = await pool.connect();
    const data = pool.query(`SELECT id, user_id FROM posts WHERE id=$1`, [id]);
    client.release();
    return data;
}

export async function modifyPost(description, id) {
    const client = await pool.connect();
    pool.query(`UPDATE posts SET description=$1 WHERE id=$2`, [description, id]);
    client.release();
}

export async function nukePost (id) {
    const client = await pool.connect();
    pool.query(`DELETE FROM posts WHERE id=$1`, [id]);
    client.release();
}