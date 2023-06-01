import { disLikedPostDB, getPostById, getPostLikes, isLiked, likedPostDB, modifyPost, nukePost, updateLikesDB } from "../repositories/posts.repository.js";

export async function editPost(req, res) {
    try {

        const { description } = req.body;
        const { id } = req.params;
        const user_id = res.locals.user.id;

        const post = await getPostById(id);
        if (post.rowCount <= 0 || post.rows[0]?.user_id != user_id) return res.sendStatus(401);

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
        if (post.rowCount <= 0 || post.rows[0]?.user_id != user_id) return res.sendStatus(401);

        await nukePost(id);

        res.send();

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function likedPost(req, res) {
    try {
        const { id } = req.params
        const user_id = res.locals.user.id;

        const post = await getPostLikes(id)
        const amountLikes = (post.rows[0].likes) + 1

        const checked = await isLiked(id, user_id)

        if (!checked) {
            await likedPostDB(id, user_id)
            await updateLikesDB(id, amountLikes)
        }

        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function disLikedPost(req, res) {
    try {
        const { id } = req.params
        const user_id = res.locals.user.id;

        const post = await getPostLikes(id)

        let amountLikes = (post.rows[0].likes)

        if (amountLikes !== 0) {
            amountLikes = amountLikes - 1
        }

        await disLikedPostDB(id, user_id)
        await updateLikesDB(id, amountLikes)

        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}