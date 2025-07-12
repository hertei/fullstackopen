const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  if (blog) {
    response.status(200)
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body)
  const user = request.user

  if (!blog){
    response.status(400).json({ error: 'userId missing or not valid' })
  }

  blog.user = user._id
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (!blog) {
    response.status(404).json({ error: 'blog not found' })
  } else if (!blog.user){
    response.status(403).json({ error: 'there\'s no key `user` in this blog' })
  }

  if ( blog.user.toString() === user._id.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
  } else {
    return response.status(401).json({ error: 'only user who added the blog, can remove it' })
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (Object.keys(request.body).includes('_id')){
    response
      .status(400)
      .send('DB _id is not allowed to change')
      .end()
  } else if (
    Object.keys(request.body).includes('likes')
  ) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes },
      { new: true, runValidators: true }
    )
    response.status(200).json(updatedBlog)
  } else if (!blog.user) {
    response.status(403).json({ error: 'there\'s no key `user` in this blog' })
  } else if ( blog.user.toString() === user._id.toString() ){
    await Blog
      .findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
      })
    response
      .status(200)
      .end()
  } else {
    response.status(401).json({ error: 'only blog owner can update blog author, title or url' })
  }
})

module.exports = blogsRouter