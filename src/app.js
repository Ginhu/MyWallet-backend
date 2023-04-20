import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import {signup, signin} from "./controllers/authorizationController.js"

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
    const userFind = await db.collection("login").findOne({token})

    if(!token || !userFind) return res.status(401).send("Login não encontrado! Faça login novamente.")
    const transactions = await db.collection("transactions").find({userId: userFind.userId}).toArray()
    const response = {transactions: transactions.reverse(), name: userFind.name}

    res.send(response)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))