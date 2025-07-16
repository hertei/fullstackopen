import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, user, addLike }) => {
  const [showAll, setShowAll] = useState(false)

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  const defaultAddLike = async () => {
    const id = blog.id
    const updatedBlog = await blogService.update(id, { ...blog, likes: blog.likes + 1 })    
    setBlogs(blogs.map(blog => 
      blog.id === id 
        ? {...blog, likes: updatedBlog.likes}
        : blog
    ))
  }

  const handleLike = addLike ? () => addLike(blog) : defaultAddLike

  const removeBlog = async () => {
    const id = blog.id
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    }
  }

  if(showAll){
    return(
      <div className="blogStyle">
        <div> {blog.title} by {blog.author}  <button onClick={toggleShow}> hide </button> </div>
        <div> {blog.url} </div>
        <div> {blog.likes}  <button onClick={handleLike}> like </button></div>
        <div> {blog.user.name} </div>
        {(user.username === blog.user.username) && <button onClick={removeBlog}> remove </button>}
      </div>  
      
    )} else {
    return(
      <div className="blogStyle">
        {blog.title} <button onClick={toggleShow}> view </button>
      </div>  
    )}
}

export default Blog