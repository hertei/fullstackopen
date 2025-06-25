require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())

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

app.get('/api/persons/:id', morgan('tiny'), (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(person => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response, next) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  // }else if (persons.map(person => person.name.toLowerCase()).includes(body.name.toLowerCase())){
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  Person.findOne(({ name: body.name })).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: `Nimi ${body.name} on jo luettelossa` })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))

  })
})

app.put('/api/persons/:id', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response, next) => {
  
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const {name, number} = request.body

  Person.findByIdAndUpdate(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then((udpatedPerson) => {
          response.json(udpatedPerson)
        })
        .catch(error => next(error))
    })
    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})