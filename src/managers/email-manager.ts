import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendEmailRecoveryMessage(user:any) {
        await emailAdapter.sendEmail("user.email", "password.recovery", "<div>${user.recoveryCode} message </div>")
    },

    async sendEmailConfirmationCode(email: string) {
        await emailAdapter.sendEmail(email, "Confirm your Email", "<div>${user.recoveryCode} </div>")
    }
}

