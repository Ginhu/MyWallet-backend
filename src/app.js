import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import {signup, signin} from "./controllers/authorizationController.js"
import joi from "joi"
import dayjs from "dayjs"

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
export const db = mongoClient.db()

app.post("/cadastro", signup)

app.post("/login", signin)

app.get("/login", async (req, res) => {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    try {
        const userFind = await db.collection("login").findOne({token})

        if(!token || !userFind) return res.status(401).send("Login não detectado! Faça login novamente.")
        const transactions = await db.collection("transactions").find({userId: userFind.userId}).toArray()
        const response = {transactions: transactions.reverse(), name: userFind.name}
        res.send(response)
    } catch (err) {
        console.log(err.message)
    }
   
})

app.post("/transactions", async (req, res) => {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const {value, description, type} = req.body
    let value2 = parseFloat(value).toFixed(2)


    const bodySchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        type: joi.valid("entrada", "saida").required(),
        token: joi.string().required()
    })

    const validation = bodySchema.validate({value: value2, description, type, token})
    if(validation.error) return res.status(422).send("Formato inválido. Verifique o dado que está passando!")
    if(!token) return res.status(401).send("Login não detectado! Faça login novamente.")
 
    const date = dayjs().format("DD/MM")

    try {

        const findUser = await db.collection("login").findOne({token})
        await db.collection("transactions").insertOne({
            date, description, type, value: value2, userId: findUser.userId
        })
        res.status(201).send("Transação criada")
    } catch (err) {
        console.log(err.message)
    }
    
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))