export function validateSchema(schema) {

    return (req, res, next) => {
        const validation = schema.validate(req.body, {abortEarly: false})
        if (validation.error) {
            const errors = validation.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }
        next()
    }

}

export function validateTransactionSchema(schema) {
    return (req, res, next) => {
        const {value, type, description} = req.body
        let value2 = parseFloat(value).toFixed(2)
        const validation = schema.validate({value: value2, description, type})
        if(validation.error) {
            const errors = validation.error.details.map(details=>details.message)
            return res.status(422).send(errors)
        }   
        next()
    }
}