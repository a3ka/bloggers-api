import {
    CommentContentType, CommentsModel, CommentsExtendedType,
    CommentType, LikesStatusType, likesStatusCollection, PostsModel
} from "./db";

export class CommentsRepository {
    async getAllCommentsToPost (postId: string, pageNumber: number, pageSize:number, userId?: string): Promise<CommentsExtendedType | undefined | null> {

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

        if (!userId){
            // @ts-ignore
            return result
        } else {
            const likesStatus:LikesStatusType[]|null = await likesStatusCollection.find({userId}).toArray()
            // @ts-ignore
            return [likesStatus, result]
        }

    }

    async findComment (commentId: string, userId?:string) {

        if(!userId) {
            return CommentsModel.findOne({id: commentId}, {_id: 0, postId: 0, __v: 0})
        }

        if(userId) {
            const likesStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: commentId, userId})

            const comment = await CommentsModel.findOne({id: commentId}, {_id: 0, postId: 0, __v: 0})

            return [likesStatus, comment]
        }
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

    async updateLikeStatus(user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined> {


        const isLikeStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: commentId, userId: user.id})

        if (!isLikeStatus) {
            await likesStatusCollection.insertOne({id: commentId, userId: user.id, likeStatus})
            if(likeStatus === "Like") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1}})
                return true
            }
            if(likeStatus === "Dislike") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.dislikesCount": 1}})
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: commentId, userId: user.id}, {$set: {likeStatus}})

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1, "likesInfo.dislikesCount": -1}})
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": 1}})
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1, "likesInfo.dislikesCount": 1}})
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.likesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await CommentsModel.findOneAndUpdate({id: commentId}, {$inc: {"likesInfo.dislikesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "None") {
                return true
            }
            return true
        }
    }
}

export const commentsRepository = new CommentsRepository()
