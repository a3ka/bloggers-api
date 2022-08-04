import {UsersWithPassType} from "../repositories/db";
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb'


export const jwtService = {

    async createJWT(user: UsersWithPassType) {
        // @ts-ignore
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET || '123', {expiresIn: '24h'})
        return {token: token}
    },

    async getUserIdByToken (token: string) {
        try {
            // @ts-ignore
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            // return new ObjectId(result.userId)
            return result.userId
        } catch (error) {
            return null
        }
    }

}
