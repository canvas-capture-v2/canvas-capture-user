import bcrypt from 'bcrypt'
import {PrismaClient} from '../prisma/app/generated/prisma/client/index.js'
import jsonwebtoken from 'jsonwebtoken'

const prisma = new PrismaClient()

// Set at deploy time from the cc-jwt Kubernetes Secret, never committed
const JWT_SECRET: string =
    process.env.JWT_SECRET ??
    (() => {
        throw new Error('JWT_SECRET is not set')
    })()

export const register_user = async (req: any, res: any) => {
    const {username, email, password} = req.body
    console.log(username)
    try {
        const user_exists = (await prisma.user.findUnique({where: {email: email}}))
        if (user_exists !== undefined && user_exists !== null) {
            console.log('User exists')
            return res.status(400).json({message: 'User already exists'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password, salt)
        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashed_password
            }
        })
        res.status(201).json({user})
    } catch (e: any) {
        res.status(500).json({message: e.message})
    }
}

export const login_user = async (req: any, res: any) => {
    const {email, password} = req.body

    try {
        const user = await prisma.user.findUnique({where: {email: email}})
        if (user === undefined || user === null) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        console.log('starting password comparison')
        const password_match = await bcrypt.compare(password, user.password)
        console.log('done comparing passwords')
        if (!password_match) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }
        console.log('starting jwt generation')
        const token = jsonwebtoken.sign({ id: user.id}, JWT_SECRET, {
            expiresIn: '7d'
        })
        console.log('done generating jwt')

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: 'lax'
        })
        return res.status(200).json({ user })
    } catch (e: any) {
        return res.status(500).json({ message: e.message })
    }
}

export const logout_user = async (_req: any, res: any) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        res.status(200).json({ message: 'Logged Out Successfully' })
    } catch (e: any) {
        res.status(500).json({ message: 'Server Error'})
    }
}