import pool from "../configs/dbConn.js";

export async function createLinkDB(url, description, id) {
    const client = await pool.connect()
    try {
        return client.query(` INSERT INTO post (link, description, user_id) 
                            VALUES ($1,$2,$3)
    `, [url, description, id])
    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    } finally {
        client.release();
    }

}

export async function getPostDB() {
    const client = await pool.connect()
    try {
        return client.query(` SELECT post.*, users.name FROM post
                              JOIN users ON users.id = post.user_Id  
                              ORDER BY id DESC 
                              LIMIT 20`)
    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }
}