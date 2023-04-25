import { Router } from "express"
import { signup, signin, logout, checklogin } from "../controllers/authorizationController.js"
import { validateSchema } from "../Middlewares/validateSchema.js"
import { loginSchema, signupSchema } from "../schemas/users.schemas.js"

const authorizationRouter = Router()

authorizationRouter.post("/cadastro", validateSchema(signupSchema), signup)
authorizationRouter.post("/login", validateSchema(loginSchema), signin)
authorizationRouter.get("/login", checklogin)
authorizationRouter.delete("/login", logout)

export default authorizationRouter