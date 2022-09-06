import {BloggersRepository} from "../repositories/bloggers-db-repository";
import {PostsRepository} from "../repositories/posts-db-repository";
import {PostsOfBloggerType, PostType} from "../repositories/db";


class PostsService {
    private postsRepository: PostsRepository;
    private bloggersRepository: BloggersRepository;

    constructor() {
        this.postsRepository = new PostsRepository()
        this.bloggersRepository = new BloggersRepository()
    }

    // async getAllPosts (pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null): Promise<{}> {
    //
    //     const postsDb = await this.postsRepository.getAllPosts(+pageNumber, +pageSize)
    //     // @ts-ignore
    //     const posts = {...postsDb}
    //
    //     // @ts-ignore
    //     for (let i = 0; i < posts.items.length; i++) {
    //         // @ts-ignore
    //         delete posts.items[i]._id
    //     }
    //     return posts
    // }

    async getAllPosts(pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null, userId?: string) {

        if (!userId) {

            const posts = await this.postsRepository.getAllPosts(+pageNumber, +pageSize)

            if (posts) {
                for(let item of posts.items) {
                    // @ts-ignore
                    item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3)
                }
                return posts
            } else {
                return false
            }

            // // @ts-ignore
            // for (let i = 0; i < posts.items.length; i++) {
            //     // @ts-ignore
            //     delete posts.items[i]._id
            // }
        } else {

            // @ts-ignore
            const [likesStatus, posts] = await this.postsRepository.getAllPosts(+pageNumber, +pageSize, userId)

            for(const el of posts.items) {
                for(const item of likesStatus) {
                    if(item.id === el.id && item.userId === userId) {
                        el.extendedLikesInfo.myStatus = item.likeStatus
                    }
                }
            }

            for(let item of posts.items) {
                // @ts-ignore
                item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3)
            }

            return posts
        }
    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | undefined> {
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

    async getPostById(postId: string, userId?: string) {

        debugger

        if (!userId) {
            const post = await this.postsRepository.getPostById(postId)

            if(post) {
                debugger
                // @ts-ignore
                post.extendedLikesInfo.newestLikes = post.extendedLikesInfo.newestLikes.splice(0, 3)
                // @ts-ignore
                post!.extendedLikesInfo.myStatus = "None"
                return post
            } else {
                return undefined
            }
        } else {
            debugger
            // @ts-ignore
            const [likesStatus, post] = await this.postsRepository.getPostById(postId, userId)

            debugger

            if(!post) {
                return undefined
            }

            if (!likesStatus) {
                return post
            }

            post.extendedLikesInfo.newestLikes = post.extendedLikesInfo.newestLikes.splice(0, 3)
            post!.extendedLikesInfo.myStatus = likesStatus.likeStatus
            return post

        }
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        return this.postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    }

    async deletePost(postId: string): Promise<boolean> {
        return this.postsRepository.deletePost(postId)
    }

    async updateLikeStatus(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike"): Promise<boolean | undefined> {

        const addedLikeStatusAt = new Date()
        return this.postsRepository.updateLikeStatus(user, postId, likeStatus, addedLikeStatusAt)
    }
}

export const postsService = new PostsService()
