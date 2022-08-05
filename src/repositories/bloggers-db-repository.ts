import {
    bloggersCollection,
    BloggersExtendedType,
    BloggersType,
    postCollection,
    PostsOfBloggerType,
    PostType
} from "./db";


export const bloggersRepository = {

    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | null): Promise<BloggersExtendedType | undefined | null> {


        if (searchNameTerm) {
            const bloggers = await bloggersCollection.find({name: {$regex: searchNameTerm}}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

            const bloggersCount = await bloggersCollection.count({name: {$regex: searchNameTerm}})
            const pagesCount = Math.ceil(bloggersCount / pageSize)

            const result = {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize,
                totalCount: bloggersCount,
                items: bloggers
            }
            // @ts-ignore
            return result
        } else {

            const bloggers = await bloggersCollection.find({}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

            const bloggersCount = await bloggersCollection.count({})
            const pagesCount = Math.ceil(bloggersCount / pageSize)

            const result = {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize,
                totalCount: bloggersCount,
                items: bloggers
            }
            // @ts-ignore
            return result
        }
    },

    async createBlogger(newBlogger: BloggersType): Promise<BloggersType> {
        await bloggersCollection.insertOne(newBlogger)
        const blogger = await bloggersCollection.findOne({id: newBlogger.id}, {projection: {_id: 0}})

        // @ts-ignore
        return blogger;
    },

    async getBloggerById(bloggerId: string): Promise<BloggersType | null> {
        const blogger: BloggersType | null = await bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})
        return blogger;
    },

    async updateBlogger(bloggerId: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: bloggerId}, {$set: {name: name, youtubeUrl: youtubeUrl}})
        return result.matchedCount === 1
    },

    async deleteBlogger(bloggerId: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: bloggerId})
        return result.deletedCount === 1
    },

    async getPostsByBloggerId(bloggerId: string, pageNumber: number, pageSize: number): Promise<PostsOfBloggerType | null> {

        const postsCount = await postCollection.count({bloggerId})
        const pagesCount = Math.ceil(postsCount / pageSize)
        const posts: PostType[] | PostType = await postCollection.find({bloggerId}, {projection: {_id: 0}}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
        }

        // @ts-ignore
        return result

    },

    async isBlogger(bloggerId: string):Promise<boolean> {

        const blogger: BloggersType | null = await bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})

        return !!blogger;
    }
}


