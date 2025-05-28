import Joi from "joi";


export const paySchema = Joi.object({
    userName: Joi.string().required().messages({
        "any.required": "Bắt buộc phải nhập tên",
        "string.empty": "Tên không được để trống",
    }),
    phone: Joi.string().required().messages({
        "any.required": "Bắt buộc phải nhập số điện thoại",
        "string.empty": "Số điện thoại không được để trống",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Bắt buộc phải nhập email",
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
    }),
    address: Joi.string().required().messages({
        "any.required": "Bắt buộc phải nhập đia chỉ",
        "string.empty": "Đia chỉ không được để trống",
    }),
    payment: Joi.string().required().messages({
        "any.required": "Bắt buộc phải chọn phương thức thanh toán",
        "string.empty": "Phương thức thanh toán không được để trống",
    })
})