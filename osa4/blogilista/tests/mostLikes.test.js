const testBlogs = require('./testblogsArray').blogs
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  test('author of most likes is same',
    assert.deepStrictEqual(listHelper.mostLikes(testBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  )
})