import {
    bloggersCollection,
    BloggersType,
    client, commentsCollection,
    CommentType,
    postCollection,
    PostsOfBloggerType,
    PostType
} from "./db";


export const commentsRepository = {
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

    async createComment (newComment: CommentType): Promise<CommentType | undefined> {
        const result = await commentsCollection.insertOne(newComment)
        const comment = await commentsCollection.findOne({id: newComment.id}, {projection: {_id: 0, postId: 0}})
        // @ts-ignore
        return comment
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
    },

    async isPost (postId: string) {

        const post: PostType | null = await postCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;

        if (post) {
            return true;
        } else {
            return false;
        }
    },

    async isPostId (postId: string) {

        const post: PostType | null = await postCollection.findOne({id: postId}, {projection: {_id: 0}})
        return post;

        if (post) {
            return true;
        } else {
            return false;
        }
    },


}
