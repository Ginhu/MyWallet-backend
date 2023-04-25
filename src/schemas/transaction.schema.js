import joi from "joi"

export const bodySchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
    type: joi.valid("entrada", "saida").required()
})