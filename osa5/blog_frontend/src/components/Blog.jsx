import { useState, useEffect } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {

  const [showAll, setShowAll] = useState(false)

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  const addLike = async () => {
    const id = blog.id
    const updatedBlog = await blogService.update(id, { ...blog, likes: blog.likes + 1 })    
    setBlogs(blogs.map(blog => 
        blog.id === id 
        ? {...blog, likes: updatedBlog.likes}
        : blog
    ))
  }

  if(showAll){
    return(
      <div className="blogStyle">
        <div> {blog.title} by {blog.author}  <button onClick={toggleShow}> hide </button> </div>
        <div> {blog.url} </div>
        <div> {blog.likes}  <button onClick={() => {addLike()}}> like </button></div>
        <div> {blog.user.name} </div>
      </div>  
      
  )} else {
    return(
      <div className="blogStyle">
        {blog.title} <button onClick={toggleShow}> view </button>
      </div>  
  )}
}

export default Blog