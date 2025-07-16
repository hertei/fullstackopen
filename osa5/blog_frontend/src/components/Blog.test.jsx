import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> component tests', () => {
  test('renders blog title and author, but not likes or url', () => {
    const blogUser = {
      name: 'Person who added the blog',
      username: 'Nimi'
    }

    const blog = {
      title: 'Blog\'s title',
      author: 'Author of the blog',
      url: 'this is url of blog',
      likes: 999,
      user: blogUser
    }

    render(<Blog blog={blog} user={blogUser} />)

    const needToBeFound = screen.getByText('Blog\'s title')
    const notToBeFoundAuthor = screen.queryByText('Author of the blog')
    const notToBeFoundUrl = screen.queryByText('this is url of blog')
    const notToBeFoundLikes = screen.queryByText('999')
  
    expect(needToBeFound).toBeDefined()
    expect(notToBeFoundAuthor).toBeNull()
    expect(notToBeFoundUrl).toBeNull()
    expect(notToBeFoundLikes).toBeNull()
  })

  test('renders all blog information after clicking \'view\' button', async() => {
    const blogUser = {
      name: 'Person who added the blog',
      username: 'Nimi'
    }

    const blog = {
      title: 'Blog\'s title',
      author: 'Author of the blog',
      url: 'this is url of blog',
      likes: 999,
      user: blogUser
    }

    render(<Blog blog={blog} user={blogUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)    

    const needToBeFound = await screen.findByText(/Blog\'s title/)
    const needToBeFoundAuthor = await screen.findByText(/Author of the blog/)
    const needToBeFoundUrl = screen.getByText('this is url of blog')
    const needToBeFoundLikes = screen.getByText('999')
    const needToBeFoundUser = screen.getByText('Person who added the blog')

  
    expect(needToBeFound).toBeDefined()
    expect(needToBeFoundAuthor).toBeDefined()
    expect(needToBeFoundUrl).toBeDefined()
    expect(needToBeFoundLikes).toBeDefined()
    expect(needToBeFoundUser).toBeDefined()
  })

  test('clicking twice the like button, calls event handler twice', async () => {

    const mockHandler = vi.fn()

    const blogUser = {
      name: 'Person who added the blog',
      username: 'Nimi'
    }

    const blog = {
      title: 'Blog\'s title',
      author: 'Author of the blog',
      url: 'this is url of blog',
      likes: 999,
      user: blogUser
    }

    render(<Blog blog={blog} user={blogUser} addLike={mockHandler}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})



