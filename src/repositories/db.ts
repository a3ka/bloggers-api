import {MongoClient, WithId} from 'mongodb'
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// export type BloggersType = WithId<{
//     id: string
//     name: string
//     youtubeUrl: string
// }>

export type BloggersType = {
    id: string
    name: string
    youtubeUrl: string
}

export type BloggersExtendedType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [BloggersType | BloggersType[]]
}

export type NewestLikesType = {
    addedAt: Object
    userId: String
    login: String
}

export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: object // new
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
        newestLikes: [NewestLikesType | NewestLikesType[]]
    }
}

export type PostsOfBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [PostType | PostType[]]
}

export type UsersType = {
    id: string
    login?: string
    isConfirmed?: boolean
    email?: string
    password?: string
}

export type UsersWithPassType = {
    id: string
    login?: string
    password?: string
    isConfirmed?: boolean
}

export type UsersWithEmailType = {
    email: string
    login: string
    userId?: string
    id?: string
}

export type UsersExtendedType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [UsersType | UsersType[]]
}

export type UsersEmailConfDataType = {
    email: string
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type CommentType = {
    postId: string,
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: object,
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: string
    }
}

export type CommentContentType = {
    content: string
}

export type CommentsExtendedType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [CommentType | CommentType[]]
}

export type AttemptType = {
    userIP: string
    url: string
    time: Date
}

export type RefreshTokensCollectionType = {
    refreshToken: string
}

export type LikesStatusType = {
    id: string
    userId: string
    likeStatus: "None" | "Like" | "Dislike"
}


// const mongoUri = process.env.MongoURI || "mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net/?retryWrites=true&w=majority"

const mongoUri = "mongodb+srv://alexk:123qweasd@cluster0.lapbhyv.mongodb.net"

const dbName = "socialNetwork"

export const client = new MongoClient(mongoUri)
const db = client.db("socialNetwork")

const bloggersSchema = new mongoose.Schema<BloggersType>({
    id: String,
    name: String,
    youtubeUrl: String
})

const postsSchema = new mongoose.Schema<PostType>({
        id: String,
        title: String,
        shortDescription: String,
        content: String,
        bloggerId: String,
        bloggerName: String,
        addedAt: Object, // new
        extendedLikesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [
                {
                    addedAt: Object,
                    userId: String,
                    login: String
                }
            ]
        }
    }, {_id: false}
)

const usersSchema = new mongoose.Schema<UsersType>({
    id: String,
    login: String,
    password: String,
    isConfirmed: Boolean,
    email: String
})

const usersEmailConfDataSchema = new mongoose.Schema<UsersEmailConfDataType>({
    email: String,
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean
})

const commentsSchema = new mongoose.Schema<CommentType>({
        postId: String,
        id: String,
        content: String,
        userId: String,
        userLogin: String,
        addedAt: Object,
        extendedLikesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String
        }
    }, {_id: false}
)


// export const bloggersCollection = db.collection<BloggersType>("bloggers")
export const BloggersModel = mongoose.model("bloggers", bloggersSchema)

// export const postCollection = db.collection<PostType>("posts")
export const PostsModel = mongoose.model("posts", postsSchema)

export const usersCollection = db.collection<UsersType>("users")
export const UsersModel = mongoose.model("users", usersSchema)

// export const usersEmailConfDataCollection = db.collection<UsersEmailConfDataType>("usersEmailConfData")
export const usersEmailConfDataModel = mongoose.model("usersEmailConfData", usersEmailConfDataSchema)

// export const commentsCollection = db.collection<CommentType>("comments")
export const CommentsModel = mongoose.model("comments", commentsSchema)

export const endpointsAttemptsTrysCollection = db.collection<AttemptType>("attempts")

export const refreshTokensBlackListCollection = db.collection<RefreshTokensCollectionType>("refreshTokensBL")

export const likesStatusCollection = db.collection<LikesStatusType>("likesStatus")


export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // // Establish and verify connection
        // await client.db("socialNetwork").command({ping: 1});


        await mongoose.connect(mongoUri + "/" + dbName);

        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to DB")
        // Ensure that the client will close when you finish/error
        await client.connect();

        await mongoose.disconnect();
    }
}
