const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const oneblog = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Oneblog',
  author: 'Oneblog',
  url: 'oneblog',
  likes: 1,
  __v: 0
}]

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


describe('total likes', () => {
  test('empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]),0)
  })

  test('one blog likes equals likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(oneblog), 1)
  })

  test('blogger list is calculated right',
    assert.strictEqual(listHelper.totalLikes(manyblogs), 10)
  )
})