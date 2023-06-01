import pool from "../configs/dbConn.js";

export async function findPostsByUserId(id) {
  const client = await pool.connect();
  const data = pool.query(
    `SELECT id, link, description, likes FROM posts WHERE user_id=$1`,
    [id]
  );
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

export async function nukePost(id) {
  const client = await pool.connect();
  pool.query(`DELETE FROM posts WHERE id=$1`, [id]);
  client.release();
}

export async function createLinkDB(url, description, id) {
  const client = await pool.connect();
  try {
    client.query("BEGIN");
    // Inserir o novo post
    const insertPostQuery = `INSERT INTO posts (link, description, user_id, likes) VALUES ($1, $2, $3, $4) RETURNING id`;
    const postResult = await client.query(insertPostQuery, [
      url,
      description,
      id,
      0,
    ]);
    const postId = parseInt(postResult.rows[0].id);
    console.log(postId);

    // Inserir as hashtags
    const insertHashtagsQuery = `INSERT INTO hashtags (post_id, hash_name)
          SELECT $1, unnest(regexp_matches($2, E'#[a-zA-Z0-9_]+', 'g'))
          FROM (VALUES (1)) AS p(post_id)
          WHERE strpos($2, '#') <> 0
    `;

    await client.query(insertHashtagsQuery, [postId, description]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getPostDB() {
  const client = await pool.connect();
  try {
    return client.query(` SELECT posts.*, users.name FROM posts
                                JOIN users ON users.id = posts.user_Id  
                                ORDER BY id DESC 
                                LIMIT 20`);
  } catch (err) {
    console.error("Error updating refresh token", err);
    throw err;
  } finally {
    client.release();
  }
}
