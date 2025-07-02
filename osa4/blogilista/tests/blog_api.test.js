const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./testHelper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('Blog API tests when initialBlogs are added to database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('getting blogs from database', () => {
    test('blogs are returned as json and amount of blogs is right', async () => {
      const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('returned blogs identifier is called \'id\'', async () => {
      const response = await api.get('/api/blogs')
      assert(Object.keys(response.body[0]).includes('id'))
    })
  })

  describe('adding blog into database', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        _id: '5a422a851b54a676234d17aa',
        title: 'Testable blog',
        author: 'Tester',
        url: 'no_url',
        likes: 0,
        __v: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('Testable blog'))
    })

    test('likes default value is zero', async () => {
      const newBlog = {
        _id: '5a422a851b54a676234d17ab',
        title: 'Zero likes',
        author: 'Tester',
        url: 'no_url',
        __v: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const resultBlog = await api
        .get(`/api/blogs/${newBlog._id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body.likes, 0)
    })

    test('post without title or url responds status 400', async () => {
      const newBlog = {
        _id: '5a422a851b54a676234d17cd',
        author: 'Tester',
        likes: 0,
        __v: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    })
  })

  describe('deleting or modifying blogs', () => {
    test('deletion of a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd= await helper.blogsInDb()
      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('modifying a blog succeeds', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]

      blogToModify.title = 'new title',
      blogToModify.author = 'new author',
      blogToModify.url = 'new url',
      blogToModify.likes = -9999

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(200)

      const modifiedBlog = await api.get(`/api/blogs/${blogToModify.id}`)

      assert(
        modifiedBlog.body.title === 'new title' &&
        modifiedBlog.body.author === 'new author' &&
        modifiedBlog.body.url === 'new url' &&
        modifiedBlog.body.likes === -9999
      )
    })

    test('modifying _id fails with status code 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const invalidBlog = {
        _id: '999999999999999999999999',
        title: 'invalid blog'
      }

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(invalidBlog)
        .expect(400)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})