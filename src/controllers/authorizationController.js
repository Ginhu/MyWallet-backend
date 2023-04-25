import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signup(req, res) {
    const {name, email, password} = req.body

    try {
        const user = await db.collection("users").findOne({email})
        if(user) return res.status(409).send("Email já cadastrado")

        const encryptedPw = bcrypt.hashSync(password, 10)
        await db.collection("users").insertOne({name, email, password: encryptedPw})
        res.status(201).send("Cadastrado com sucesso!")

    } catch (err) {
        res.send(err.message)
    }
}

export async function signin(req, res) {
    const {email, password} = req.body

    try {
        const findUser = await db.collection("users").findOne({email})
        if(!findUser) return res.status(404).send("Registro do usuário não encontrado")
        if(!bcrypt.compareSync(password, findUser.password)) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("login").insertOne({userId: findUser._id, token: token, name: findUser.name})
        res.status(200).send(token)
    } catch (err) {
        res.send(err.message)
    }
}

export async function logout(req, res) {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    if(!token) return res.sendStatus(401)
    
    try {
        db.collection("login").deleteOne({token: token})
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}

export async function checklogin(req, res) {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    try {
        const userFind = await db.collection("login").findOne({token})
        if(!token || !userFind) return res.status(401).send("Login não detectado! Faça login novamente.")
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}