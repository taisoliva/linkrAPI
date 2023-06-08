import * as commentsRepository from "../repositories/comments.repository.js";

export const createComment = async (commentData) => {
  const result = await commentsRepository.createUser(commentData);
  return result;
};
