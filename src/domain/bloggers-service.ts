import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggersExtendedType, BloggersType, PostsOfBloggerType, PostType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-db-repository";

const _ = require("lodash");


// function omit(obj:any, ...props:any) {
//     const result = { ...obj };
//     props.forEach(function (prop:any) {
//         delete result[prop];
//     });
//     return result;
// }

function omit_Id(obj:any) {
    const result = { ...obj };
    if(obj.items){
        for (let i = 0; i < result.items.length; i++) {
            delete result.items[i]._id
        }
    } else {
        delete result._id
    }
    return result
}


export const bloggersService = {

    async getAllBloggers(pageNumber: string = '1' || undefined, pageSize:string = '10' || undefined, searchNameTerm: string | null = null): Promise<BloggersExtendedType | undefined | null> {

        const bloggersDb = await bloggersRepository.getAllBloggers(+pageNumber, +pageSize, searchNameTerm)
        // const bloggers = omit_Id(bloggersDb)
        return bloggersDb
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggersType> {
        const newBlogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        const createdBloggerDb = await bloggersRepository.createBlogger(newBlogger)
        // const createdBlogger = omit_Id(createdBloggerDb)
        return createdBloggerDb;
    },

    async getBloggerById(bloggerId: number): Promise<BloggersType | null> {
        const bloggerDb = await bloggersRepository.getBloggerById(bloggerId);
        // const blogger = omit_Id(bloggerDb)
        return bloggerDb
    },

    async updateBlogger(bloggerId: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(bloggerId, name, youtubeUrl)
    },

    async deleteBlogger(bloggerId: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(bloggerId)
    },

    async getPostsByBloggerId(bloggerId: number, pageNumber: string = '1' || undefined || null, pageSize: string = '10' || undefined || null): Promise<PostsOfBloggerType | null> {
        const postsDb = await bloggersRepository.getPostsByBloggerId(bloggerId, +pageNumber, +pageSize);
        // const posts = omit_Id(postsDb)
        return postsDb
    },

    async createPostByBloggerId (bloggerId: number, title: string, shortDescription: string, content: string) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        if (blogger) {
            const newPost = {
                id: +(new Date()),
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
