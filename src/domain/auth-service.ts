
import { UsersExtendedType, UsersType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-db-repository";
import {usersRepository} from "../repositories/users-db-repository";
import {emailManager} from "../managers/email-manager";



export const authService = {

    async userRegistration (login: string, email: string, password: string) {
        // Registration in DataBase
        return emailManager.sendEmailConfirmationCode(email)
    }
    ,

    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if(!user) return false
        if(user.password !== password) {
            return false
        }
        return user
    }
}
