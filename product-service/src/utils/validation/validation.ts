const Joi = require('joi');

export const schema = Joi.object({
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    description: Joi.string()
        .min(20)
        .max(255)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    count: Joi.number()
        .min(0)
        .required()
});
