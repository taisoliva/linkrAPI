import joi from "joi";

const hashSchema = joi.object({
  hash: joi.string().required(),
});

export default hashSchema;
