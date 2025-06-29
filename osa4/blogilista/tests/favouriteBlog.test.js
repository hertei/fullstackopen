const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const manyblogs = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'One',
  author: 'One',
  url: 'One',
  likes: 1,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17f9',
  title: 'Two',
  author: 'Two',
  url: 'Two',
  likes: 2,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17fa',
  title: 'Three',
  author: 'Three',
  url: 'Three',
  likes: 3,
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17fb',
  title: 'Four',
  author: 'Four',
  url: 'Four',
  likes: 4,
  __v: 0
}]


describe('favourite blog', () => {
  test('favourite blog is same',
    assert.deepStrictEqual(listHelper.favoriteBlog(manyblogs), manyblogs[3])
  )
})