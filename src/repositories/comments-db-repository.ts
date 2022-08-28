import {
    CommentContentType, CommentsModel, CommentsExtendedType,
    CommentType
} from "./db";

export class CommentsRepository {
    async getAllCommentsToPost (postId: string, pageNumber: number, pageSize:number): Promise<CommentsExtendedType | undefined | null> {

        const commentsCount = await CommentsModel.count({postId})
        const pagesCount = Math.ceil(commentsCount / pageSize)
        const comments: CommentType[] | CommentType = await CommentsModel.find({postId}, {_id: 0, postId: 0, __v: 0}).skip((pageNumber-1)*pageSize).limit(pageSize).lean()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: commentsCount,
            items: comments
        }

        // @ts-ignore
        return result
    }

    async findComment (commentId: string): Promise<CommentType | undefined | null> {
        const comment = await CommentsModel.findOne({id: commentId}, {_id: 0, postId: 0, __v: 0})
        // @ts-ignore
        return comment
    }

    async createComment (newComment: CommentType): Promise<CommentType | undefined> {
        await CommentsModel.insertMany([newComment])
        const comment = await CommentsModel.findOne({id: newComment.id}, {_id: 0, postId: 0, __v: 0})
        // @ts-ignore
        return comment
    }


    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        await CommentsModel.updateOne({id: commentId}, {$set: {content}})

        const updatedComment = await CommentsModel.findOne({id: commentId}, {_id: 0, postId: 0, id: 0, userId: 0, userLogin: 0, addedAt: 0, __v: 0})

        // @ts-ignore
        return updatedComment

    }

    async deleteComment (commentId: string): Promise<boolean>  {
        const result = await CommentsModel.deleteOne({id: commentId})
        return result.deletedCount === 1
    }

    async deleteAllComments(): Promise<boolean> {
        await CommentsModel.deleteMany({})
        return true
    }
}

export const commentsRepository = new CommentsRepository()
