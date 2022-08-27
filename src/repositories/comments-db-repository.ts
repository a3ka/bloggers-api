import {
    // bloggersCollection,
    BloggersType,
    client, CommentContentType, commentsCollection, CommentsExtendedType,
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

    async findComment (commentId: string): Promise<CommentType | undefined | null> {
        const comment = await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0}})
        // @ts-ignore
        return comment
    },

    async createComment (newComment: CommentType): Promise<CommentType | undefined> {
        const result = await commentsCollection.insertOne(newComment)
        const comment = await commentsCollection.findOne({id: newComment.id}, {projection: {_id: 0, postId: 0}})
        // @ts-ignore
        return comment
    },


    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        const update = await commentsCollection.updateOne({id: commentId}, {$set: {content}})

        const updatedComment = await commentsCollection.findOne({id: commentId}, {projection: {_id: 0, postId: 0, id: 0, userId: 0, userLogin: 0, addedAt: 0}})

        // @ts-ignore
        return updatedComment

    },

    async deleteComment (commentId: string): Promise<boolean>  {
        const result = await commentsCollection.deleteOne({id: commentId})
        return result.deletedCount === 1
    },

    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return true
    }

}
