import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {login_user, logout_user, register_user} from "./user_controller.js";

const app = express()

app.use(express.json())
app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(cookieParser())

app.post('/register', register_user)

app.post('/login', login_user)

app.post('/logout', logout_user)

console.log('Listening on 4004...')
app.listen(4004)