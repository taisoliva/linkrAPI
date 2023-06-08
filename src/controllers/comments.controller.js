import { createComment } from "../services/comments.service.js";

export const postComment = async (req, res) => {
  try {
    await createComment({ ...req.body, user_id: res.locals.user.id });
    res.status(201).json({ message: "Comment created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsWithPostId = async (req, res) => {
  try {
    const comments = await getCommentsFromPost({post_id: req.params.id})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

};
