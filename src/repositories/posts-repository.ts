import {bloggers} from "./bloggers-local-repository";

let posts:PostType[] = [
    {
        id: 1,
        title: '1st Post',
        shortDescription: 'Description of 1st post',
        content: 'Content of 1st Post',
        bloggerId: 1,
        bloggerName: 'Alex'
    },
    {
        id: 2,
        title: '2nd Post',
        shortDescription: 'Description of 2 post',
        content: 'Content of 2 Post',
        bloggerId: 2,
        bloggerName: 'Sasha'
    },
    {
        id: 3,
        title: '3 Post',
        shortDescription: 'Description of 3 post',
        content: 'Content of 3 Post',
        bloggerId: 3,
        bloggerName: 'Serg'
    },
    {
        id: 4,
        title: '4s Post',
        shortDescription: 'Description of 4 post',
        content: 'Content of 4 Post',
        bloggerId: 4,
        bloggerName: 'Masha'
    },
    {
        id: 5,
        title: '5s Post',
        shortDescription: 'Description of 5 post',
        content: 'Content of 5 Post',
        bloggerId: 5,
        bloggerName: 'Lena'
    },
]

type PostType = {
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}



export const postsRepository = {
    getAllPosts () {
        return posts;
    },

    createPost (title: string, shortDescription: string, content: string, bloggerId: number) {
        const blogger = bloggers.find(b => b.id === +bloggerId);
        if (blogger) {
            const newPost = {
                id: +(new Date()),
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger.name
            }
            posts.push(newPost)
            return newPost
        }
    },

    getPostById (postId: number) {
        const post = posts.find(p => p.id === postId);
        return post;
    },

    isBlogger (bloggerId: number) {
        const blogger = bloggers.find(b => b.id === bloggerId);

        if (blogger) {
            return true;
        } else {
            return false;
        }
    },

    updatePost (postId: number, title: string, shortDescription: string, content: string, bloggerId: number) {

        const blogPost = posts.find(p => p.id === postId);

        if (blogPost) {
            blogPost.title = title
            blogPost.shortDescription = shortDescription
            blogPost.content = content
            blogPost.bloggerId = bloggerId
            // blogPost.bloggerName = blogPost.bloggerName
            return true;
        } else {
            return false;
        }
    },

    deletePost (postId: number) {
        // for (let i = 0; i < posts.length; i++) {
        //     if (posts[i].id === postId) {
        //         posts.splice(i, 1);
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }

        let postCount = posts.length

        posts = posts.filter(b => b.id !== postId)

        if (postCount > posts.length) {
            return true;
        } else {
            return false;
        }

    }
}
