require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(express.static('dist'))

let persons = []

app.get('/', morgan('tiny'), (request, response) => {
  response.send('<h1>Puhelinluettelo Backend</h1>')
})

app.get('/info', morgan('tiny'), (request, response) => {
  Person.countDocuments({}).then(numbers => {
    response.send(`
      <div>Phonebook has info for ${numbers} people</div>
      <div>${new Date().toString()}</div>`)
  })
})

app.get('/api/persons', morgan('tiny'), (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response) => {
  Person.deleteOne(Person.findById(request.params.id)).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }else if (persons.length > 0 && persons.map(person => person.name.toLowerCase()).includes(body.name.toLowerCase())){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  Person.findOne(({ name: body.name })).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: `Nimi ${body.name} on jo luettelossa` })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})