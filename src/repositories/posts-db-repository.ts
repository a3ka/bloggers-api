import {likesStatusCollection, LikesStatusType, PostsModel, PostsOfBloggerType, PostType} from "./db";

export class PostsRepository {

    async getAllPosts(pageNumber: number, pageSize: number, userId?: string): Promise<PostsOfBloggerType | undefined | null> {
        const postsCount = await PostsModel.count({})
        const pagesCount = Math.ceil(postsCount / pageSize)
        const posts: PostType[] | PostType = await PostsModel.find({}, {
            _id: 0,
            __v: 0
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).lean()

        const result = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts
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

    async createPost(newPost: PostType): Promise<PostType | undefined> {
        await PostsModel.insertMany([newPost])
        return newPost
    }

    async getPostById(postId: string, userId?: string) {

        if(!userId) {
            return PostsModel.findOne({id: postId}, {_id: 0, __v: 0})
        }

        if(userId) {
            // const likesStatus:LikesStatusType|null = await likesStatusCollection.find({id: postId, userId}).limit(3).toArray() // ?????
            // @ts-ignore
            const likesStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: postId, userId})

            const post = await PostsModel.findOne({id: postId}, {_id: 0, __v: 0})
            return [likesStatus, post]
        }
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const result = await PostsModel.updateOne({id: postId}, {$set: {title, shortDescription, content, bloggerId}})
        return result.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const result = await PostsModel.deleteOne({id: postId})
        return result.deletedCount === 1
    }

    async deleteAllPost(): Promise<boolean> {
        await PostsModel.deleteMany({})
        return true
    }

    async updateLikeStatus(user: any, postId: string, likeStatus: "None" | "Like" | "Dislike", addedLikeStatusAt: object): Promise<boolean|undefined> {
        const isLikeStatus:LikesStatusType|null = await likesStatusCollection.findOne({id: postId, userId: user.id})

        if (!isLikeStatus) {
            await likesStatusCollection.insertOne({id: postId, userId: user.id, likeStatus})
            if(likeStatus === "Like") {
                // await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": 1}, })
                // await PostsModel.findOneAndUpdate({id: postId}, {"likesInfo.myStatus": likeStatus})
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": 1}})

                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }

                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }
            if(likeStatus === "Dislike") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.dislikesCount": 1}})
                return true
            }

        } else {

            await likesStatusCollection.updateOne({id: postId, userId: user.id}, {$set: {likeStatus}})

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Dislike") {
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": 1, "extendedLikesInfo.dislikesCount": -1}})
                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }
                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "None") {
                const a = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": 1}})

                const newestLike = {
                    addedAt:addedLikeStatusAt,
                    userId: user.id,
                    login: user.login
                }
                // @ts-ignore
                a.extendedLikesInfo.newestLikes = [newestLike, ...a.extendedLikesInfo.newestLikes]
                // @ts-ignore
                await a.save()
                return true
            }

            if(likeStatus === "Like" && isLikeStatus.likeStatus === "Like") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Like") {
                // await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"likesInfo.likesCount": -1}})
                // await PostsModel.findOneAndUpdate({id: postId}, {"likesInfo.myStatus": likeStatus})
                const posts:PostType|null = await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": -1, "extendedLikesInfo.dislikesCount": 1}})

                // @ts-ignore
                posts.extendedLikesInfo.newestLikes = posts.extendedLikesInfo.newestLikes.filter(obj => obj.userId !== user.id)

                // @ts-ignore
                await posts.save()



                // if(posts) {
                //     // @ts-ignore
                //     for(const like of posts.extendedLikesInfo.newestLikes) {
                //         // @ts-ignore
                //         if(like.userId === user.id) {
                //
                //         }
                //     }
                // }

                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus === "Dislike") {
                return true
            }

            if(likeStatus === "Dislike" && isLikeStatus.likeStatus !== "Like") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Like") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.likesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "Dislike") {
                await PostsModel.findOneAndUpdate({id: postId}, {$inc: {"extendedLikesInfo.dislikesCount": -1}})
                return true
            }

            if(likeStatus === "None" && isLikeStatus.likeStatus === "None") {
                return true
            }
            return true
        }
    }
}

export const postsRepository = new PostsRepository()
