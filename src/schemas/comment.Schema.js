import joi from "joi";

const commentSchema = joi.object({
  post_id: joi.number().required(),
  comment: joi.string().required(),
});

export default commentSchema;