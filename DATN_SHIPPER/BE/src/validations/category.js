import Joi from "joi";

export const categoryValidator = Joi.object({
  name_category: Joi.string().required().min(1).max(255),
  image_category: Joi.string().optional(),
  published: Joi.boolean().optional(), 
});
