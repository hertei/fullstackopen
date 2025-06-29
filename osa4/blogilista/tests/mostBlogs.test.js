const testBlogs = require('./testblogsArray').blogs
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  test('author of most blogs is same',
    assert.deepStrictEqual(listHelper.mostBlogs(testBlogs), {
      author: 'Robert C. Martin',
      blogs: 3
    })
  )
})