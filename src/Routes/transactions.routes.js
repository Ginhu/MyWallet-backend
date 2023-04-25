import { Router } from "express"
import { checkTransactions, postTransactions } from "../controllers/transactionsController.js"
import { validateTransactionSchema } from "../Middlewares/validateSchema.js"
import { bodySchema } from "../schemas/transaction.schema.js"

const transactionsRouter = Router()

transactionsRouter.get("/transactions", checkTransactions)
transactionsRouter.post("/transactions",validateTransactionSchema(bodySchema) , postTransactions)

export default transactionsRouter