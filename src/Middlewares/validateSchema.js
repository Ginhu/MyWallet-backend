export function validateSchema(schema) {

    return (req, res, next) => {
        const validation = signupSchema.validate(req.body, {abortEarly: false})
        if (validation.error) {
            const errors = validateSchema.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }
        next()
    }

}

export function validateTransactionSchema(schema) {
    return (req, res, next) => {
        const validation = bodySchema.validate({value: value2, description, type, token})
        if(validation.error) {
            const errors = validateSchema.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }   
        next()
    }
}