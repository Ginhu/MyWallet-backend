import express from "express"
import cors from "cors"
import transactionsRouter from "./Routes/transactions.routes.js"
import authorizationRouter from "./Routes/authorization.routes.js"

const app = express()
app.use(express.json())
app.use(cors())
app.use(transactionsRouter)
app.use(authorizationRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`SERVER ON na porta ${PORT}`))