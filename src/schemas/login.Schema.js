import joi from "joi";

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(2).required(),
  cookiesAccepted: joi.boolean().required(),
});

export default loginSchema;