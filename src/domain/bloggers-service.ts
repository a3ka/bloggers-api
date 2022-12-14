import {BloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersExtendedType, BloggersType, PostsOfBloggerType} from "../repositories/db";
import {PostsRepository} from "../repositories/posts-db-repository";

class BloggersService {
    private bloggersRepository: BloggersRepository;
    private postsRepository: PostsRepository;

    constructor() {
        this.bloggersRepository = new BloggersRepository()
        this.postsRepository = new PostsRepository()
    }

    async getAllBloggers(
        pageNumber: string = '1',
        pageSize: string = '10',
        searchNameTerm: string | null = null
    ): Promise<BloggersExtendedType | undefined | null> {

        return this.bloggersRepository.getAllBloggers(+pageNumber, +pageSize, searchNameTerm)
    }

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: (+(new Date())).toString(),
            name,
            youtubeUrl
        }
        const createdBloggerDb = await this.bloggersRepository.createBlogger(newBlogger)
        // const createdBlogger = omit_Id(createdBloggerDb)
        return createdBloggerDb;
    }

    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const bloggerDb = await this.bloggersRepository.getBloggerById(bloggerId);
        // const blogger = omit_Id(bloggerDb)
        return bloggerDb
    }

    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await this.bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    }

    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return this.bloggersRepository.deleteBlogger(bloggerId)
    }

    async getPostsByBloggerId(bloggerId: string, pageNumber: string = '1' || undefined || null, pageSize: string = '10' || undefined || null, userId?: string): Promise<PostsOfBloggerType | null | undefined> {

        if (!userId) {

            const posts = await this.bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize);

            if (posts) {
                for (let item of posts.items) {
                    // @ts-ignore
                    item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3)
                }
                return posts
            } else {
                return undefined
            }

        } else {

            // @ts-ignore
            const [likesStatus, posts] = await this.bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize, userId);

            for (const el of posts.items) {
                for (const item of likesStatus) {
                    if (item.id === el.id && item.userId === userId) {
                        el.extendedLikesInfo.myStatus = item.likeStatus
                    }
                }
            }

            for (let item of posts.items) {
                // @ts-ignore
                item.extendedLikesInfo.newestLikes = item.extendedLikesInfo.newestLikes.splice(0, 3)
            }
            return posts
        }

    }

    async createPostByBloggerId(bloggerId: string, title: string, shortDescription: string, content: string) {
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
            const createdPostDb = await this.postsRepository.createPost(newPost)
            // const createdPost = omit_Id(createdPostDb)
            return createdPostDb
        }
    }
}

export const bloggersService = new BloggersService()
