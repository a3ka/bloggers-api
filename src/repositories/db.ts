import {MongoClient} from 'mongodb'

const dotenv = require("dotenv");
dotenv.config();

export type BloggersType = {
    id: number
    name: string
    youtubeUrl: string
}

export type BloggersExtendedType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [ BloggersType | BloggersType[] ]
}

export type PostType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}

export type PostsOfBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [ PostType | PostType[] ]
}




const mongoUri = process.env.MongoURI || "mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/?retryWrites=true&w=majority"

// @ts-ignore
export const client = new MongoClient(mongoUri)

const db = client.db("socialNetwork")
export const bloggersCollection = db.collection<BloggersType>("bloggers")
export const postCollection = db.collection<PostType>("posts")

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to DB")
        // Ensure that the client will close when you finish/error
        await client.connect();
    }
}
