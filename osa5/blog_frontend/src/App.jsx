import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === null) {
    return null
  }  

  if (type === 'notification'){
    return (
      <div className="message">
        {message}
      </div>
  )} else if (type === 'error'){
    return (
      <div className="error">
        {message}
      </div>
  )}
}

const AddBlogForm = ({ addBlog, title, setTitle, author, setAuthor, url, setUrl }) => (
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
)


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
   const [message, setMessage] = useState({
    text: null,
    type: null
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          setUser(user)
          blogService.setToken(user.token)
        }
  }, [])

  const handleLogin = async (event) => {
      event.preventDefault()
      try {
          const user = await loginService.login({
            username, password,
          })
  
          window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
          )
          blogService.setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
        } catch (error) {
          setMessage({
            text: error.response.data.error || error.message,
            type: 'error'})
          setTimeout(() => {
            setMessage({text: null, type: null})
          }, 5000)
      }
    }

    const addBlog = async (event) => {
      try{
        event.preventDefault()
        const blogObject = {
          title: title,
          author: author,
          url: url
        }
        const newBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(newBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setMessage({
            text: `a new blog '${newBlog.title}' by '${newBlog.author}' added` ,
            type: 'notification'})
          setTimeout(() => {
            setMessage({text: null, type: null})
          }, 5000)
      } catch (error) {
          setMessage({
            text: error.response.data.error || error.message,
            type: 'error'})
          setTimeout(() => {
            setMessage({text: null, type: null})
          }, 5000)
      }
    }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <div>
      {!user && <div>
        <h2>Log in to application</h2> 
        <Notification message={message.text} type={message.type} />
        </div>
      }
      {!user && loginForm()}
      {user && 
        <div>
          <h2>blogs</h2>
          <Notification message={message.text} type={message.type} />
          <p>
            {user.name} logged in 
            <button onClick={handleLogout}>logout</button>
          </p>
          <h2>create new</h2>
          <AddBlogForm
            addBlog={addBlog}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
            />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      } 
    </div>
  )
}

export default App