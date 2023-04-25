import { Router } from "express"
import { checkTransactions, deleteTransaction, postTransactions } from "../controllers/transactionsController.js"
import { validateTransactionSchema } from "../Middlewares/validateSchema.js"
import { bodySchema } from "../schemas/transaction.schema.js"

const transactionsRouter = Router()

transactionsRouter.get("/transactions", checkTransactions)
transactionsRouter.post("/transactions",validateTransactionSchema(bodySchema) , postTransactions)
transactionsRouter.delete("/transactions", deleteTransaction)

export default transactionsRouter