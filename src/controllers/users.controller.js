import { findPostsByUserId } from "../repositories/posts.repository.js";
import { findProfileByUserId, findUserByName, getFollowers } from "../repositories/users.repository.js";

export async function getUserProfileById(req, res) {
  try {
    const { id } = req.params;

    const user = await findProfileByUserId(id);
    if (user.rowCount <= 0) return res.sendStatus(422);
    const posts = await findPostsByUserId(id);

    const data = {
      name: user.rows[0].name,
      picture: user.rows[0].picture,
      posts: posts,
    };

    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUserByName(req, res) {
  const { id } = res.locals.user;
  const { name } = req.params;
  try {
    const follows = await getFollowers(id);
    if (!follows.length) return res.sendStatus(404);
    const found = await findUserByName(name);
    if (!found.length) return res.sendStatus(404);
    const result = follows.concat(found);

    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
