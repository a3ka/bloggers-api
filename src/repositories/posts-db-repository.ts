import {bloggersCollection, BloggersType, client, postCollection, PostsOfBloggerType, PostType} from "./db";


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
        const post = await postCollection.find({id: newPost.id}, {projection: {_id: 0}})
        // @ts-ignore
        return post
    },

    async getPostById (postId: string): Promise<PostType | null> {

        const post  = await postCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;
    },

    async updatePost (postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean>  {
        const result = await postCollection.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})
        return result.matchedCount === 1

    },

    async deletePost (postId: string): Promise<boolean>  {
        const result = await postCollection.deleteOne({id: postId})
        return result.deletedCount === 1
    }


}
