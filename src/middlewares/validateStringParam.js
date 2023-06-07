import hash from "../schemas/hash.schema.js";
export const validateStringParam = (req, res, next) => {
  const { error } = hash.validate(req.params, { abortEarly: false });
  console.log(error)
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(422).json({ messages: errorMessages });
  }
  next();
};
