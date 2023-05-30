import { findPostsByUserId } from "../repositories/posts.repository.js";
import { findProfileByUserId } from "../repositories/users.repository.js";

export async function getUserProfileById(req, res) {
    try {
        const { id } = req.params;

        const user = await findProfileByUserId(id);
        const posts = await findPostsByUserId(id);

        const data = {
            name: user.rows[0].name,
            picture: user.rows[0].picture,
            posts: posts.rows
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}