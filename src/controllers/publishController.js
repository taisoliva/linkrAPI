import { createLinkDB, getPostDB } from "../repositories/publishRepository.js";

export async function publishPost(req, res) {
    const { avatar, id} = res.locals.user;
    const {url, description} = req.body
    try {
        await createLinkDB(url, description, avatar, id)
        res.sendStatus(201)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPost(req,res){
    try{
        const {rows : posts } = await getPostDB()
        res.status(200).send(posts)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



  