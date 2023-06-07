import joi from "joi";

const hashSchema = joi.object({
  description: joi.string().required(),
});

export default hashSchema;
