export function validateSchema(schema) {

    return (req, res, next) => {
        const validation = schema.validate(req.body, {abortEarly: false})
        if (validation.error) {
            const errors = validateSchema.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }
        next()
    }

}

export function validateTransactionSchema(schema) {
    return (req, res, next) => {
        const {value} = req.body
        let value2 = parseFloat(value).toFixed(2)
        const validation = schema.validate({value: value2, description, type, token})
        if(validation.error) {
            const errors = validateSchema.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }   
        next()
    }
}