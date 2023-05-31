import { findPostsByUserId } from "../repositories/posts.repository.js";
import { findProfileByUserId, findUserByName } from "../repositories/users.repository.js";
import pool from "../configs/dbConn.js";

export async function getUserProfileById(req, res) {
    try {
        const { id } = req.params;

        const user = await findProfileByUserId(id);
        if (user.rowCount <= 0) return res.sendStatus(422);
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

export async function getUserByName(req, res) {
    try {
        const { name } = req.params;

        const data = await findUserByName(name);
        if (data.rowCount <= 0) return res.send(422);

        res.send(data.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
}