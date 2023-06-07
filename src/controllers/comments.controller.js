import { createComment } from "../services/comments.service.js";

export const postComment = async (req, res) => {
    try {
        const response = createComment(req.body);
        res.status(201).json({ message: "Comment created!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
}

export const getCommentsWithPostId = (req, res) => {
    
}