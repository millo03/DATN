import Joi from "joi";

export const CategoryJoiSchema = Joi.object({
  name_category: Joi.string().required(),
});
