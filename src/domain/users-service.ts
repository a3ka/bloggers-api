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
            id: (+(new Date())).toString(),
            login,
            password,
            isConfirmed: false
        }
        const createdUserDb = await usersRepository.createUser(newUser)

        return createdUserDb;
    },


    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    },

    async findUserById(userId: string): Promise<UsersType | undefined | null> {
        const user = await usersRepository.findUserById(userId)
        return user
    }
}
