
import {BloggersRepository} from "../repositories/bloggers-db-repository";
import {PostsRepository} from "../repositories/posts-db-repository";
import {PostType} from "../repositories/db";


class PostsService {
    private postsRepository: PostsRepository;
    private bloggersRepository: BloggersRepository;
    constructor() {
        this.postsRepository = new PostsRepository()
        this.bloggersRepository = new BloggersRepository()
    }

    async getAllPosts (pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null): Promise<{}> {

        const postsDb = await this.postsRepository.getAllPosts(+pageNumber, +pageSize)
        // @ts-ignore
        const posts = {...postsDb}

        // @ts-ignore
        for (let i = 0; i < posts.items.length; i++) {
            // @ts-ignore
            delete posts.items[i]._id
        }
        return posts
    }

    async createPost (title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | undefined> {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
                id: (+(new Date())).toString(),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name,
                addedAt: new Date,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: []
                }
            }
            // @ts-ignore
            const createdPost = await this.postsRepository.createPost(newPost)
            return createdPost
        }
    }

    async getPostById (postId: string): Promise<PostType | null> {
        return this.postsRepository.getPostById(postId)
    }

    async updatePost (postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean>  {
        return this.postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    }

    async deletePost (postId: string): Promise<boolean>  {
        return this.postsRepository.deletePost(postId)
    }

    async updateLikeStatus (user: any, postId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean|undefined>  {

        const addedLikeStatusAt = new Date()
        return this.postsRepository.updateLikeStatus(user,postId, likeStatus, addedLikeStatusAt)
    }
}

export const postsService = new PostsService()
