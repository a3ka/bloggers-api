import {UsersExtendedType, UsersType} from "../repositories/db";
import {UsersRepository} from "../repositories/users-db-repository";


export class UsersService {
    private usersRepository: UsersRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async getAllUsers(pageNumber: string = '1' || undefined, pageSize:string = '10' || undefined): Promise<UsersExtendedType | undefined | null> {
        return this.usersRepository.getAllUsers(+pageNumber, +pageSize)
    }

    async createUser(login: string, password: string, email: string): Promise<UsersType> {
        const newUser = {
            id: (+(new Date())).toString(),
            login,
            email,
            password,
            isConfirmed: false
        }
        return this.usersRepository.createUser(newUser);
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.usersRepository.deleteUser(id)
    }

    async findUserById(userId: string): Promise<UsersType | undefined | null> {
        return this.usersRepository.findUserById(userId)
    }
}

export const usersService = new UsersService()

