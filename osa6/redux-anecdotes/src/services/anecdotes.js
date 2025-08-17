import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}
const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (id, modifiedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, modifiedObject)
  return response.data
}



export default {
  getAll,
  getOne,
  createNew,
  update,
}