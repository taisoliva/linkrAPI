import pool from "../configs/dbConn.js";

export async function createLinkDB(url, description, avatar, id) {
    const client = await pool.connect()
    try {
        return client.query(` INSERT INTO posts (link, description, user_id, picture) 
                            VALUES ($1,$2,$3, $4)
    `, [url, description, id, avatar])
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
        return client.query(` SELECT posts.*, users.name FROM posts
                              JOIN users ON users.id = posts.user_Id  
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