export let bloggers = [
    {id: 1, name: 'Alex', youtubeUrl: 'https://www.alex.com'},
    {id: 2, name: 'Sasha', youtubeUrl: 'https://www.sasha.com'},
    {id: 3, name: 'Serg', youtubeUrl: 'https://www.serg.com'},
    {id: 4, name: 'Masha', youtubeUrl: 'https://www.masha.com'},
    {id: 5, name: 'Lena', youtubeUrl: 'https://www.lena.com'},
]

export const bloggersLocalRepository = {
    getAllBloggers () {
        return bloggers;
    },

    createBlogger (name: string, youtubeUrl: string) {
        const newBlogger = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger;
    },

    getBloggerById (bloggerId: number) {
        const blogger = bloggers.find(b => b.id === bloggerId);
        return blogger;
    },

    deleteBlogger (bloggerId: number) {
        let bloggerCount = bloggers.length

        bloggers = bloggers.filter(b => b.id !== bloggerId)

            if (bloggerCount > bloggers.length) {
                return true;
            } else {
                return false;
        }
    },

    updateBlogger (bloggerId: number, name: string, youtubeUrl: string) {

        const blogger = bloggers.find(b => b.id === bloggerId);

        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl
            // blogPost.bloggerName = blogPost.bloggerName
            return true;
        } else {
            return false;
        }
    },
}
