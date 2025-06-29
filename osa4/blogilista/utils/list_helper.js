const lodash = require('lodash')


const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return likes
}

const favoriteBlog = (blogs) => {
  const mostLikesBlog = blogs.reduce((mostlikes, blog) => {
    if (mostlikes.likes < blog.likes){
      return blog
    }
  }, {
    _id: '5a422aa71b54a676234d17fc',
    title: 'minus',
    author: 'minus',
    url: 'minus',
    likes: -1,
    __v: 0
  })

  return mostLikesBlog
}

const mostBlogs = (blogs) => {
  const count = lodash.countBy(blogs, 'author')
  const blogger = lodash.maxBy(Object.keys(count), (n) => count[n])
  return {
    author: blogger,
    blogs: count[blogger]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}