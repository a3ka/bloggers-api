// import {__bloggers} from "./bloggers-db-repository";
import {bloggersCollection, BloggersType, client, postCollection, PostsOfBloggerType, PostType} from "./db";
import {bloggersRepository} from "./bloggers-db-repository";
import {bloggers} from "./bloggers-local-repository";


export const postsRepository = {
    async getAllPosts (pageNumber: number, pageSize:number): Promise<PostsOfBloggerType | undefined | null> {

        const postsCount = await postCollection.count({})
        const pagesCount = Math.ceil(postsCount / pageSize)
        const posts: PostType[] | PostType = await postCollection.find({}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
        }
        // @ts-ignore
        return result
    },

    async createPost (newPost: PostType): Promise<PostType | undefined> {
        const result = await postCollection.insertOne(newPost)
        const post = await postCollection.find({id: newPost.id}, {projection: {_id: 0}}).toArray()
        // @ts-ignore
        return post[0]
    },

    async getPostById (postId: number): Promise<PostType | null> {
        const post  = await postCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;
    },

    async updatePost (postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean>  {
        const result = await postCollection.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})
        return result.matchedCount === 1

    },

    async deletePost (postId: number): Promise<boolean>  {

        const result = await postCollection.deleteOne({id: postId})

        return result.deletedCount === 1

        // let postCount = posts.length
        //
        // posts = posts.filter(b => b.id !== postId)
        //
        // if (postCount > posts.length) {
        //     return true;
        // } else {
        //     return false;
        // }

    },

    async isPost (postId: number) {

        const post: PostType | null = await postCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;

        if (post) {
            return true;
        } else {
            return false;
        }
    }
}
