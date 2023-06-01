import {
  getPostById,
  modifyPost,
  nukePost,
  createLinkDB,
  getPostDB,
} from "../repositories/posts.repository.js";

export async function editPost(req, res) {
  try {
    const { description } = req.body;
    const { id } = req.params;
    const user_id = res.locals.user.id;

    const post = await getPostById(id);
    if (post.rowCount <= 0 || post.rows[0]?.user_id != user_id)
      return res.sendStatus(401);

    await modifyPost(description, id);

    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const user_id = res.locals.user.id;

    const post = await getPostById(id);
    if (post.rowCount <= 0 || post.rows[0]?.user_id != user_id)
      return res.sendStatus(401);

    await nukePost(id);

    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function publishPost(req, res) {
  const { avatar, id } = res.locals.user;
  const { url, description } = req.body;
  try {
    await createLinkDB(url, description, id);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPost(req, res) {
  try {
    const { rows: posts } = await getPostDB();
    res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
