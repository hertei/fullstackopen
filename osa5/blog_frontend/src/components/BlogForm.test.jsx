import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()
  const addMessage = vi.fn()

  render(<BlogForm createBlog={createBlog} addMessage={addMessage} />)

  const inputTitle = screen.getByPlaceholderText('write blog title here')
  const inputAuthor = screen.getByPlaceholderText('write blog author here')
  const inputUrl = screen.getByPlaceholderText('write blog url here')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing blog title...')
  await user.type(inputAuthor, 'testing blog author...')
  await user.type(inputUrl, 'testing blog url...')
  await user.click(sendButton)
  
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing blog title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing blog author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing blog url...')
})