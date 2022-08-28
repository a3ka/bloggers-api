import {PostsModel, PostsOfBloggerType, PostType} from "./db";

export const postsRepository = {
    async getAllPosts (pageNumber: number, pageSize:number): Promise<PostsOfBloggerType | undefined | null> {

        const postsCount = await PostsModel.count({})
        const pagesCount = Math.ceil(postsCount / pageSize)
        const posts: PostType[] | PostType = await PostsModel.find({}, {_id: 0, __v: 0}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()

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
        await PostsModel.insertMany([newPost])
        return newPost
    },

    async getPostById (postId: string): Promise<PostType | null> {
        const post  = await PostsModel.findOne({id: postId}, {_id: 0, __v: 0})
        return post;
    },

    async updatePost (postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean>  {
        const result = await PostsModel.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})
        return result.matchedCount === 1
    },

    async deletePost (postId: string): Promise<boolean>  {
        const result = await PostsModel.deleteOne({id: postId})
        return result.deletedCount === 1
    },

    async deleteAllPost(): Promise<boolean> {
        const result = await PostsModel.deleteMany({})
        return true
    }
}
