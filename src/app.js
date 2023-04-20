import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import {signup, signin} from "/src/controllers/authorizationController.js"

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

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))