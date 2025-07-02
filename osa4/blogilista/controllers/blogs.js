const blogsRouter = require('express').Router()
// const { request } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.status(200)
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body).save()

  if (blog){
    response.status(201).json(blog)
  } else {
    response.status(400).json(blog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  if (Object.keys(request.body).includes('_id')){
    response
      .status(400)
      .send('DB _id is not allowed to change')
      .end()
  }

  await Blog
    .findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    })

  response
    .status(200)
    .end()
})

module.exports = blogsRouter