import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).required(),
  picture: Joi.string().uri().required(),
});

export default userSchema;
