const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '6868135595d81bec7cbc65c9',
    username: 'teppo',
    name: 'Teppo Testaaja',
    passwordHash: '$2b$10$cQmNA2v.T.Tc2396RkR7J.LZwxDPKicQxmXAcmcNs7H4EfbXzy1Hy',
    __v: 0
  },
  {
    _id: '68681c941c36ddbec6536125',
    username: 'mikko',
    name: 'Mikko Testaaja',
    passwordHash: '$2b$10$DUi3MyNYU1ML37ZCWOZdkOfZMA.JrmhQhgAASnRVqXtKx/MN/6KjO',
    __v: 0
  },
  {
    _id: '686821894b7a3ed05a7c0571',
    username: 'tauno',
    name: 'Tauno Testaaja',
    passwordHash: '$2b$10$LBAAworxG73PYekXh4I3LOg/3Di7XjJDA8lUWhljbjQ.25Uf3v3jK',
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    _id: '5a422bc61b54a676234d17fc',
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon',
    likes: 0,
    __v: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports =  { initialBlogs, nonExistingId, blogsInDb, initialUsers }