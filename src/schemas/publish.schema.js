import joi from "joi";

const publishShema = joi.object({
  url: joi.string().uri().required(),
  description: joi.string().allow(""),
});

export default publishShema;
