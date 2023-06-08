import joi from "joi";

const id = joi.object({
  id: joi.number().required(),
});

export default id;
