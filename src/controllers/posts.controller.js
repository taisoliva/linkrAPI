import { getPostById, modifyPost, nukePost } from "../repositories/posts.repository.js";

export async function editPost(req, res) {
    try {
        
        const { description } = req.body;
        const { id } = req.params;
        const user_id = res.locals.user.id;

        const post = await getPostById(id);
        if(post.rowCount <= 0 || post.rows[0]?.user_id != user_id) return res.sendStatus(401);

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
        if(post.rowCount <= 0 || post.rows[0]?.user_id != user_id) return res.sendStatus(401);

        await nukePost(id);

        res.send();

    } catch (err) {
        res.status(500).send(err.message);
    }
}