import {
  getPostById,
  modifyPost,
  nukePost,
  createLinkDB,
  disLikedPostDB,
  likedPostDB,
  postShareDB,
  getPostsDB,
  getNewPostsQtnd
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


export async function likedPost(req, res) {
  try {
    const { id } = req.params;
    const user_id = res.locals.user.id;
    await likedPostDB(id, user_id);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function disLikedPost(req, res) {
  try {
    const { id } = req.params;
    const user_id = res.locals.user.id;
    await disLikedPostDB(id, user_id);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const getPost = async (req, res) => {
  const user_id = res.locals.user.id;

  let { offset } = req.params;
  offset = offset.split(" ");

  try {
    const response = await getPostsDB(user_id, offset);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const postShare = async (req, res) => {

  const { id } = req.params
  const user_id = res.locals.user.id

  try {
    const response = await postShareDB(id, user_id)
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(err.message)
  }
};

export const checkNewPosts = async (req, res) => {
  const user_id = res.locals.user.id;

  const { last } = req.params;

  try {
    const response = await getNewPostsQtnd(last);
    res.status(200).json(Number(response.rows[0].count));
  } catch (err) {
    res.status(500).send(err.message);
  }
};