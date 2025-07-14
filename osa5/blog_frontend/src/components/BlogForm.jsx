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
            type="text"
            value={title}
            name="Title"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="URL"
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm