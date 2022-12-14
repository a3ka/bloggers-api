
import {PostsRepository} from "../repositories/posts-db-repository";
import {
    CommentContentType,
    CommentsExtendedType,
    CommentType,
} from "../repositories/db";
import {commentsRepository, CommentsRepository} from "../repositories/comments-db-repository";

class CommentsService {
    private commentsRepository: CommentsRepository;
    private postsRepository: PostsRepository;
    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }
    async getAllCommentsByPostId (postId: string, pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null, userId?: string): Promise<CommentsExtendedType | undefined | null> {

        if (!userId) {
            const comments = await this.commentsRepository.getAllCommentsToPost(postId, +pageNumber, +pageSize)
            if (!comments) {
                return undefined
            }
            return comments

        } else {
            // @ts-ignore
            const [likesStatus, comments] = await this.commentsRepository.getAllCommentsToPost(postId, +pageNumber, +pageSize, userId);

            for(const el of comments.items) {
                for(const item of likesStatus) {
                    if(item.id === el.id) {
                        el.likesInfo.myStatus = item.likeStatus
                    }
                }
            }

            return comments
        }













    }

    async findComment (commentId: string, userId?: string) {

        if(!userId) {
            const comment = await this.commentsRepository.findComment(commentId)

            if(comment) {
                // @ts-ignore
                comment!.likesInfo.myStatus = "None"
                return comment
            } else {
                return undefined
            }

        } else {
            // @ts-ignore
            const [likesStatus, comment] = await this.commentsRepository.findComment(commentId, userId)

            if(!comment) {
                return undefined
            }

            if (!likesStatus) {
                return comment
            }

            comment!.likesInfo.myStatus  = likesStatus.likeStatus
            return comment
        }
    }

    async createCommentByPostId (user:any, postId: string, content:string): Promise<CommentType | undefined> {
        const post = await this.postsRepository.getPostById(postId)

        if (post) {

            const newComment = {
                postId: postId,
                id: (+(new Date())).toString(),
                content: content,
                userId: user.id,
                userLogin: user.login,
                addedAt: new Date,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            }

            const createdComment = await this.commentsRepository.createComment(newComment)
            return createdComment
        }
    }

    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        return this.commentsRepository.updateComment(commentId, content)
    }

    async deleteComment (commentId: string): Promise<boolean>  {
        return this.commentsRepository.deleteComment(commentId)
    }

    async updateLikeStatus (user: any, commentId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined>  {

        const comment = await this.commentsRepository.updateLikeStatus(user, commentId, likeStatus)
        return comment
    }
}

export const commentsService = new CommentsService()
