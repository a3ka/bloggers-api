import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersExtendedType, BloggersType, PostsOfBloggerType, PostType, UsersExtendedType, UsersType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-db-repository";
import {usersRepository} from "../repositories/users-db-repository";

const _ = require("lodash");

function omit_Id(obj:any) {
    const result = { ...obj };
    if(obj.items){
        for (let i = 0; i < result.items.length; i++) {
            delete result.items[i]._id
        }
    } else {
        delete result._id
    }
    return result
}


export const usersService = {

    async getAllUsers(pageNumber: string = '1' || undefined, pageSize:string = '10' || undefined): Promise<UsersExtendedType | undefined | null> {
        const users = await usersRepository.getAllUsers(+pageNumber, +pageSize)
        return users
    },

    async createUser(login: string, password: string): Promise<UsersType> {

        const newUser = {
            id: +(new Date()),
            login,
            password
        }
        const createdUserDb = await usersRepository.createUser(newUser)

        return createdUserDb;
    },

    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.getUserAccessDataByLogin(login)
        if(!user) return false
        if(user.password !== password) {
            return false
        }
        return true
    },

    async deleteUser(id: number): Promise<boolean> {
        return usersRepository.deleteUser(id)
    },


}
