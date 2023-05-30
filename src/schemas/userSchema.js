import joi from "joi";

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(2).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),
});

export default userSchema;
