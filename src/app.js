import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

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

const PORT = 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))