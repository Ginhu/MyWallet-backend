import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
try {
    await mongoClient.connect()
    console.log("MongoDB connected")
} catch (err) {
    console.log(err.message)
}
const db = mongoClient.db()

app.post("/cadastro", async (req, res) => {
    const {name, email, password} = req.body
    const signupSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(3).required()
    })

    const validation = signupSchema.validate(req.body, {abortEarly: false})
    if (validation.error) return res.status(422).send("Existe um ou mais campos inválidos")

    try {
        const user = await db.collection("users").findOne({email})
        if(user) return res.status(409).send("Email já cadastrado")

        const encryptedPw = bcrypt.hashSync(password, 10)
        await db.collection("users").insertOne({name, email, password: encryptedPw})
        res.status(201).send("Cadastrado com sucesso!")

    } catch (err) {
        res.send(err.message)
    }

})

app.post("/login", async (req, res) => {
    const {email, password} = req.body
    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })

    const validation = loginSchema.validate(req.body, {abortEarly: false})

    if(validation.error) return res.status(422).send("Dados informados não estão no formato correto")

    try {
        const findUser = await db.collection("users").findOne({email})
        if(!findUser) return res.status(404).send("Registro do usuário não encontrado")
        if(!bcrypt.compareSync(password, findUser.password)) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("login").insertOne({userId: findUser._id, token: token})
        res.status(200).send(token)
    } catch (err) {
        res.send(err.message)
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))