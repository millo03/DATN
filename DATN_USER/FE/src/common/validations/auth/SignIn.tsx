import Joi from "joi";


export const signInSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Trường email bắt buộc phải nhập",
        "string.empty": "Trường email không được để trống",
        "string.email": "Trường email không hợp lệ",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "any.required": "Trường password bắt buộc phải nhập",
        "string.empty": "Trường password không được để trống",
        "string.min": "Trường password phải có ít nhất {#limit} ký tự",
        "string.max": "Trường password không được vượt quá {#limit} ký tự",
    }),

})