import {
    getPostById,
    modifyPost,
    nukePost,
    createLinkDB,
    getPostDB,
    disLikedPostDB,
    getPostLikes,
    isLiked,
    likedPostDB,
    updateLikesDB,
    verifyLikesDB,
    whoLikedDB
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


export async function likedPost(req, res) {
    try {
        const { id } = req.params
        const user_id = res.locals.user.id;

        const post = await getPostLikes(id)
        console.log(post.rows)
        const amountLikes = (post.rows[0].likes) + 1

        const checked = await isLiked(id, user_id)
        console.log(checked)

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

export async function verifyLikes(req, res) {
    try {
        const { id } = req.params
        const user_id = res.locals.user.id;
        const checked = await verifyLikesDB(id, user_id)

        res.status(200).send(checked.rows)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function whoLiked(req,res){

    const {id} = req.params
    try {
        const checked = await whoLikedDB(id)
        res.status(200).send(checked.rows)

    } catch (err) {
        res.status(500).send(err.message)
    }
}