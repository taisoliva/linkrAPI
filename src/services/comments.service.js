import * as commentsRepository from "../repositories/comments.repository.js";

export const createComment = async (commentData) => {
  const result = await commentsRepository.createComment(commentData);
  return result;
};

export const getCommentsFromPostId = async (post_id) => {
  const result = await commentsRepository.getCommentsFromPostId(post_id);
  return result;
};
