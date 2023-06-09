import { findPostsByUserId } from "../repositories/posts.repository.js";
import { findProfileByUserId, findUserByName } from "../repositories/users.repository.js";
import process from "../repositories/follows.repository.js";

export async function getUserProfileById(req, res) {
  try {
    const { id } = req.params;
    
    const userId = res.locals.user.id
    const user = await findProfileByUserId(id);

    if (user.rowCount <= 0) return res.sendStatus(422);
    const posts = await findPostsByUserId(id, userId);

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

    const follows = await process.getFollowers(id);

    const found = await findUserByName(name);
    let result = found;

    if (follows.length > 0)
      result = follows.concat(found);

    if (result.length <= 0) return res.sendStatus(204);

    res.send(result);
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message);
  }
}
