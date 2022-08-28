import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersExtendedType, BloggersType, PostsOfBloggerType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-db-repository";

class BloggersService {
    async getAllBloggers(
        pageNumber: string = '1',
        pageSize :string = '10',
        searchNameTerm: string | null = null
    ): Promise<BloggersExtendedType | undefined | null> {

        return bloggersRepository.getAllBloggers(+pageNumber, +pageSize, searchNameTerm)
    }

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: (+(new Date())).toString(),
            name,
            youtubeUrl
        }
        const createdBloggerDb = await bloggersRepository.createBlogger(newBlogger)
        // const createdBlogger = omit_Id(createdBloggerDb)
        return createdBloggerDb;
    }

    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const bloggerDb = await bloggersRepository.getBloggerById(bloggerId);
        // const blogger = omit_Id(bloggerDb)
        return bloggerDb
    }

    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    }

    async deleteBlogger(bloggerId: string): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    }

    async getPostsByBloggerId(bloggerId: string, pageNumber: string = '1' || undefined || null, pageSize: string = '10' || undefined || null): Promise<PostsOfBloggerType | null> {
        const postsDb = await bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize);
        // const posts = omit_Id(postsDb)
        return postsDb
    }

    async createPostByBloggerId (bloggerId: string, title: string, shortDescription: string, content: string) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
                id: (+(new Date())).toString(),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name
            }
            const createdPostDb = await postsRepository.createPost(newPost)
            // const createdPost = omit_Id(createdPostDb)
            return createdPostDb
        }
    }
}

export const bloggersService = new BloggersService()
