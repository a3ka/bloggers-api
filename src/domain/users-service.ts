import {UsersExtendedType, UsersType} from "../repositories/db";
import {usersRepository} from "../repositories/users-db-repository";


class UsersService {

    async getAllUsers(pageNumber: string = '1' || undefined, pageSize:string = '10' || undefined): Promise<UsersExtendedType | undefined | null> {
        debugger
        const users = await usersRepository.getAllUsers(+pageNumber, +pageSize)
        return users
    }

    async createUser(login: string, password: string, email: string): Promise<UsersType> {

        const newUser = {
            id: (+(new Date())).toString(),
            login,
            email,
            password,
            isConfirmed: false
        }
        const createdUserDb = await usersRepository.createUser(newUser)

        return createdUserDb;
    }

    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    }

    async findUserById(userId: string): Promise<UsersType | undefined | null> {
        const user = await usersRepository.findUserById(userId)
        return user
    }
}

export const usersService = new UsersService()
