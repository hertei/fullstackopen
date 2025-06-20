const express = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1"
  },
  {
    name: "Ada Lovelace",
    number: "3298493274",
    id: "2"
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3"
  },
  
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4"
  }
]

app.get('/', morgan('tiny'), (request, response) => {
  response.send('<h1>Puhelinluettelo Backend</h1>')
})

app.get('/info', morgan('tiny'), (request, response) => {
  let numbers = persons.length
  response.send(`
    <div>Phonebook has info for ${numbers} people</div>
    <div>${new Date().toString()}</div>`)
})

app.get('/api/persons', morgan('tiny'), (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  let newId = (Math.random() * 1000).toFixed(0)
  let foundUnique = false
  
  while (!foundUnique){
    if (persons.map(n => Number(n.id)).includes(Number(newId))){
      newId = (Math.random() * 1000).toFixed(0)
    }else{
      foundUnique = true
    }

  }
  return String(newId)
}

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }else if (persons.map(person => person.name.toLowerCase()).includes(body.name.toLowerCase())){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})