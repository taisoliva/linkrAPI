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

export async function getPostLikes(id){
    const client = await pool.connect()
    try {
        return client.query(`SELECT * FROM posts WHERE id=$1`, [id])
    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }
}

export async function likedPostDB(id, user_id){
    const client = await pool.connect()
    try {

      return client.query(`INSERT INTO likes (user_id, post_id, liked) 
                                VALUES ($1, $2, $3)`, [user_id, id, 'true' ])

    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }
}

export async function disLikedPostDB(id, user_id){
    const client = await pool.connect()
    try {

      await client.query (`DELETE FROM likes WHERE user_id=$1 AND post_id=$2`, [user_id,id])

    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }
}


export async function updateLikesDB(id, amountLikes){
    const client = await pool.connect()
    try {
      return client.query(`UPDATE posts SET likes=$1 WHERE id=$2`,[amountLikes, id] )

    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }

}

export async function isLiked (id, user_id){
    const client = await pool.connect()
    try {
      const checked =  await client.query(`SELECT * FROM likes WHERE user_id=$1 AND post_id=$2`, [user_id,id])
      console.log(checked.rows)
      if(checked.rows.length !== 0){
        return true
      } 
      return false

    } catch (err) {
        console.error("Error updating refresh token", err);
        throw err;
    }
    finally {
        client.release();
    }
}