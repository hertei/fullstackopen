import { useState } from 'react'

const BlogForm = ({createBlog, addMessage}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    try{
      await createBlog({
        title: title,
        author: author,
        url: url
      })

      setTitle('')
      setAuthor('')
      setUrl('')

      addMessage({
        text: `a new blog '${title}' by '${author}' added` ,
        type: 'notification'})
      setTimeout(() => {
        addMessage({text: null, type: null})
      }, 5000)
    } catch (error) {
      addMessage({
        text: error.response.data.error || error.message,
        type: 'error'})
      setTimeout(() => {
        addMessage({text: null, type: null})
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            type="text"
            value={title}
            name="Title"
            onChange={event => setTitle(event.target.value)}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type="text"
            value={author}
            name="Author"
            onChange={event => setAuthor(event.target.value)}
            placeholder='write blog author here'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type="text"
            value={url}
            name="URL"
            onChange={event => setUrl(event.target.value)}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm