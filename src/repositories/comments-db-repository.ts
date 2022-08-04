import {
    bloggersCollection,
    BloggersType,
    client, commentsCollection, CommentsExtendedType,
    CommentType,
    postCollection,
    PostsOfBloggerType,
    PostType
} from "./db";


export const commentsRepository = {
    async getAllCommentsToPost (postId: string, pageNumber: number, pageSize:number): Promise<CommentsExtendedType | undefined | null> {

        const commentsCount = await commentsCollection.count({postId})
        const pagesCount = Math.ceil(commentsCount / pageSize)
        const comments: CommentType[] | CommentType = await commentsCollection.find({postId}, {projection: {_id: 0, postId: 0}}).skip((pageNumber-1)*pageSize).limit(pageSize).toArray()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: commentsCount,
            items: comments
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
