import { findPostsByUserId } from "../repositories/posts.repository.js";
import { findProfileByUserId } from "../repositories/users.repository.js";

export async function getUserProfileById(req, res) {
    try {
        const { id } = req.params;

        const user = await findProfileByUserId(id);
        if(user.rowCount <= 0) return res.sendStatus(422);
        const posts = await findPostsByUserId(id);

        const data = {
            name: user.rows[0].name,
            picture: user.rows[0].picture,
            posts: posts.rows
        }

        res.send(data);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}