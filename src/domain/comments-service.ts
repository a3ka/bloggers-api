
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {
    BloggersExtendedType,
    CommentContentType,
    CommentsExtendedType,
    CommentType,
    PostsOfBloggerType,
    PostType
} from "../repositories/db";
import {commentsRepository} from "../repositories/comments-db-repository";



export const commentsService = {

    async getAllCommentsByPostId (postId: string, pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null): Promise<CommentsExtendedType | undefined | null> {
        const posts = await commentsRepository.getAllCommentsToPost(postId, +pageNumber, +pageSize)
        return posts
    },

    async findComment (commentId: string): Promise<CommentType | undefined | null> {
        const comment = await commentsRepository.findComment(commentId)
        return comment
    },

    async createCommentByPostId (user:any, postId: string, content:string): Promise<CommentType | undefined> {

        const post = await postsRepository.getPostById(postId)
        if (post) {

            const newComment = {
                postId: postId,
                id: (+(new Date())).toString(),
                content: content,
                userId: user.id,
                userLogin: user.login,
                addedAt: new Date
            }

            const createdComment = await commentsRepository.createComment(newComment)
            return createdComment
        }
    },

    async updateComment (commentId: string, content: string): Promise<CommentContentType>  {
        return commentsRepository.updateComment(commentId, content)
    },

    async deleteComment (commentId: string): Promise<boolean>  {
        return commentsRepository.deleteComment(commentId)
    }

}
