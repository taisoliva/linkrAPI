import { createLinkDB, getPostDB } from "../repositories/publishRepository.js";
import urlMetadata from "url-metadata";
import fetch from "node-fetch";

export async function publishPost(req, res) {
    const { id } = res.locals.user;
    const {url, description} = req.body
    try {
        await createLinkDB(url, description, id)
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



  