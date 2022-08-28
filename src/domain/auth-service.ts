import {UsersRepository} from "../repositories/users-db-repository";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {refreshTokensBLRepository} from "../repositories/refreshTokekensBL-db-repository";
import {UsersWithEmailType} from "../repositories/db";

class AuthService {
    private usersRepository: UsersRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
    }
    async checkCredentials(login: string, password: string) {
        const user = await this.usersRepository.findUserByLogin(login)
        debugger
        if (!user) return false
        // @ts-ignore
        if (user.password !== password) {
            return false
        }
        return user
    }

    async userRegistration(login: string, email: string, password: string) {
        // Registration in DataBase
        const newUser = {
            accountData: {
                id: (+(new Date())).toString(),
                login,
                password,
                email: email,
                isConfirmed: false
            },
            emailConfirmation: {
                email,
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 3,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        await this.usersRepository.createUser(newUser.accountData)
        await this.usersRepository.insertToDbUnconfirmedEmail(newUser.emailConfirmation)

        debugger

        try {
            await emailManager.sendEmailConfirmationCode(email, newUser.emailConfirmation.confirmationCode)
        } catch (err) {
            console.error(err)
            this.usersRepository.deleteUser(newUser.accountData.id)
            this.usersRepository.deleteUserUnconfirmedEmail(newUser.emailConfirmation.email)
            return null
        }
        return true
    }

    async userRegConfirmation(confirmationCode: string): Promise<boolean> {
        const user = await this.usersRepository.findUserByConfirmCode(confirmationCode)

        if (!!user.emailConfirmation && user.emailConfirmation.isConfirmed === false) {

            const result = await this.usersRepository.updateEmailConfirmation(user.emailConfirmation.email)

            if(result) {
                emailManager.sendEmailConfirmation(user.emailConfirmation.email)
            }
            return true
        } else {
            return false
        }
    }

    async resendingEmailConfirm(email: string) {
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user) return false
        if (user?.isConfirmed === true) return false



        const newEmailConfirmation = {
            email,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 3,
                minutes: 3
            }),
            isConfirmed: false
        }

        await this.usersRepository.updateUnconfirmedEmailData(newEmailConfirmation)

        await emailManager.sendEmailConfirmationCode(email, newEmailConfirmation.confirmationCode)
        return true
    }

    async addRefreshTokenToBlackList(refreshToken: string) {
        const result =  await refreshTokensBLRepository.addRefreshTokenToBlackList(refreshToken)

        return result
    }

    async checkTokenInBlackList(refreshToken: string) {
        const result = await refreshTokensBLRepository.checkTokenInBlackList(refreshToken)
        return result
    }

    async findUserById(userId: string): Promise<UsersWithEmailType | undefined | null> {
        const user = await this.usersRepository.findUserWithEmailById(userId)

        user['userId'] = user['id'];
        delete user['id'];

        const nUser = {
            email: user.email,
            login: user.login,
            userId: user.userId
        }
        return nUser
    }
}

export const authService = new AuthService()
