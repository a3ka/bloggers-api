import {
    AttemptType,
    endpointsAttemptsTrysCollection, postCollection,
} from "./db";


export const attemptsRepository = {

    async getLastAttempts(ip: string, url: string, limitTime: Date): Promise<number | undefined | null> {

        const countAttempts = await endpointsAttemptsTrysCollection.countDocuments({
            userIP: ip,
            url,
            time: {$gt: limitTime}
        })
        return countAttempts
    },

    async addAttempt(userIP: string, url: string, time: Date):  Promise<AttemptType> {

        const result = endpointsAttemptsTrysCollection.insertOne({ userIP, url, time})

        // @ts-ignore
        return result
    },

    async deleteAllAttempts(): Promise<boolean> {
        const result = await endpointsAttemptsTrysCollection.deleteMany({})
        return true
    }

}


