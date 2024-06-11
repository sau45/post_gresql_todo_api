const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})
const authschema = Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(6).required()
})

module.exports= {registerSchema,authschema};