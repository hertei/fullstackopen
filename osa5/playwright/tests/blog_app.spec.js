const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')  
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Lukki Maattainen',
        username: 'lmaattai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('blogs')).not.toBeVisible()
    await page.getByRole('button', {name: 'login'}).click()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('This is test blog')
      await page.getByTestId('author').fill('Test blog author')
      await page.getByTestId('url').fill('test blog url')
      await page.getByRole('button', { name: 'create'}).click()

      const errorDiv = await page.locator('.message')
      await expect(errorDiv).toContainText('a new blog \'This is test blog\' by \'Test blog author\' added')
      const blogDiv = await page.locator('.blogStyle')
      await expect(blogDiv).toContainText('This is test blog')
    })
  })

  describe('When logged in and blogs created', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, 'This is test blog', 'Test blog author', 'test blog url')
      await createBlog(page, 'This is second test blog', 'Test blog author', 'test blog url')
      await createBlog(page, 'This is third test blog', 'Test blog author', 'test blog url')
    })

    test('a blog can be liked', async ({ page }) => {
      const likedBlog = await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'})
      await likedBlog.getByRole('button', { name: 'view'}).click()
      await expect(likedBlog).toContainText('0')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(likedBlog).toContainText('1')
    })

    test('Blog creator can delete the blog', async ({ page }) => {
      const blogToRemove = await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'})
      await blogToRemove.getByRole('button', { name: 'view'}).click()
      await expect(blogToRemove).toBeVisible()
      await page.on('dialog', dialog => dialog.accept())
      await blogToRemove.getByRole('button', { name: 'remove'}).click()
      await expect(page.locator('.blogStyle').filter({ hasText: 'This is third test blog'})).not.toBeVisible()
    })

    test('Only Blog creator can see the blog remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'lmaattai', 'salainen')
      const blogToRemove = await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'})
      await blogToRemove.getByRole('button', { name: 'view'}).click()
      await expect(blogToRemove).toBeVisible()
      await expect(blogToRemove.getByRole('button', { name: 'remove'})).not.toBeVisible()
    })

    test.slow('Blogs are sorted descending order by likes', async ({ page }) => {
      const blogsAtStart = await page.locator('.blogStyle').allTextContents()
      await expect(blogsAtStart[0].match(/This is test blog/)).toBeTruthy()
      await expect(blogsAtStart[1].match(/This is second test blog/)).toBeTruthy()
      await expect(blogsAtStart[2].match(/This is third test blog/)).toBeTruthy()

      await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'}).getByRole('button', { name: 'view'}).click()
      await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'}).getByRole('button', { name: 'like'}).click()
      await page.getByText('1').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'}).getByRole('button', { name: 'like'}).click()
      await page.getByText('2').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'}).getByRole('button', { name: 'like'}).click()      
      await page.getByText('3').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is third test blog'}).getByRole('button', { name: 'hide'}).click()      

      await page.locator('.blogStyle').filter({ hasText: 'This is second test blog'}).getByRole('button', { name: 'view'}).click()
      await page.locator('.blogStyle').filter({ hasText: 'This is second test blog'}).getByRole('button', { name: 'like'}).click()
      await page.getByText('1').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is second test blog'}).getByRole('button', { name: 'like'}).click()
      await page.getByText('2').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is second test blog'}).getByRole('button', { name: 'hide'}).click()


      await page.locator('.blogStyle').filter({ hasText: 'This is test blog'}).getByRole('button', { name: 'view'}).click()
      await page.locator('.blogStyle').filter({ hasText: 'This is test blog'}).getByRole('button', { name: 'like'}).click()
      await page.getByText('1').waitFor()
      await page.locator('.blogStyle').filter({ hasText: 'This is test blog'}).getByRole('button', { name: 'hide'}).click()

      await expect(page.getByText('like')).not.toBeVisible()


      const blogsAtLast = await page.locator('.blogStyle').allTextContents()
      await expect(blogsAtLast[0].match(/This is third test blog/)).toBeTruthy()
      await expect(blogsAtLast[1].match(/This is second test blog/)).toBeTruthy()
      await expect(blogsAtLast[2].match(/This is test blog/)).toBeTruthy()
    })
  })
})