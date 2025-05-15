import bcrypt from 'bcrypt'
import {PrismaClient} from '../prisma/app/generated/prisma/client/index.js'
import jsonwebtoken from 'jsonwebtoken'

const prisma = new PrismaClient()

const JWT_SECRET = '2d390b88e7816fecc55c1220f04aa8b01cad2d9213c8b98a0288ba9d64b315a8fea3770fbda04b4b22a2785413901ed16618373649f6d5a870866c2670b4edb7055a776e2626c54b601e626b153d25f67f16fe01fb782a8514efb569509ec0fbcfb0a3d781dbd44565ea37f6ee0f109cd4a7d7d68539e864efe4689c5355bc6f855b71f472d615e8ee9b0efa4dfc3326fa6fe5811f609784759d63fa5bc3092a2224336093c294b367117ed1fd453739b4ce02c91b47a3665f3cff6edc56cc7f13b7066caaaed50cd0f75463afa6d19b1bfb95a59a0fc414f525f1777c0448378060094afa60f4df89fb8e41b5434c9c6c8d48a86b0cc84b464b990757a553ca'

export const register_user = async (req: any, res: any) => {
    const {username, email, password} = req.body
    console.log(username)
    console.log(email)
    console.log(password)
    try {
        const user_exists = (await prisma.user.findUnique({where: {email: email}}))
        console.log(user_exists)
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
        console.log(process.env.JWT_SECRET)
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