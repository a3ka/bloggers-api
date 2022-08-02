
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {BloggersExtendedType, PostsOfBloggerType, PostType} from "../repositories/db";



export const postsService = {
    async getAllPosts (pageNumber: string = "1" || undefined || null, pageSize: string = "10" || undefined || null): Promise<{}> {

        const postsDb = await postsRepository.getAllPosts(+pageNumber, +pageSize)
        // @ts-ignore
        const posts = {...postsDb}

        // @ts-ignore
        for (let i = 0; i < posts.items.length; i++) {
            // @ts-ignore
            delete posts.items[i]._id
        }

        return posts

    },

    async createPost (title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType | undefined> {
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

            const createdPost = await postsRepository.createPost(newPost)
            return createdPost
        }
    },

    async getPostById (postId: number): Promise<PostType | null> {

        return postsRepository.getPostById(postId)
    },

    async updatePost (postId: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean>  {
        return postsRepository.updatePost(postId, title, shortDescription, content, bloggerId)
    },

    async deletePost (postId: number): Promise<boolean>  {
        return postsRepository.deletePost(postId)
    }
}
