import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Person = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </div>
  )
}

const Filter = ({filter, onChange}) => {
  return (
    <form>
      <div>
        filter shown with: 
        <input
          value = {filter}
          onChange= {onChange}/>
      </div>
    </form>
  )
}

const PersonForm = ({addPerson, newName, onChangeName, newNumber, onChangeNumber}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input 
          value={newName}
          onChange={onChangeName}/>
      </div>
      <div>
        number: <input 
          value={newNumber}
          onChange={onChangeNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({
    text: null,
    type: ''
  })

  const personsToShow = persons.filter(person => 
  person.name.toLowerCase().includes(filter.toLowerCase()))


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map(name => name=name.name).includes(personObject.name)){
      const person = persons.find(p => p.name === personObject.name)   
      const changedPerson = {...person, number: personObject.number}
      if (confirm(`${personObject.name} is already in phonebook, update the number ${person.number} to ${personObject.number} ?`)){  
        personService
          .updatePerson(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== personObject.name ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage({
              text: `Updated number for ${returnedPerson.name}`,
              type: 'notification'
            })
            setTimeout(() => {
              setMessage({
                text: null
            })
            }, 3000)
            
          })
          .catch(error => {
            setMessage({
              text: `Person update failed for ${changedPerson.name}: ${error.response.data.error}`,
              type: 'error'
            })
            setTimeout(() => {
              setMessage({
                text: null
            })
            }, 3000)
          })
      }else{
        setNewName('')
        setNewNumber('')
      }
    }else{
      personService
        .createPerson(personObject)
        .then(returnedPerson => {         
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({
              text: `Added ${returnedPerson.name}`,
              type: 'notification'
            })
            setTimeout(() => {
              setMessage({
                text: null
            })
            }, 3000)
        })
        .catch(error => {
            console.log(error.response.data)
            setMessage({
              text: `Person validation failed: ${error.response.data.error}`,
              type: 'error'
            })
            setTimeout(() => {
              setMessage({
                text: null
            })
            }, 5000)
            setPersons(persons.filter(p => p.name !== personObject.name))
          })
    }
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (confirm(`Poistetaanko ${personToDelete.name}?`)){
      personService
        .deletePerson(id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id !== id))
          console.log(`Deleted ${Object.entries(returnedPerson)}`)
          
          setMessage({
            text:`Deleted ${personToDelete.name}`,
            type: 'notification'
          })
          setTimeout(() => {
            setMessage({
                text: null
            })
          }, 3000)
        })
        .catch(() => {
          setMessage({
              text: `${personToDelete.name} was already deleted from server`,
              type: 'error'
            })
            setTimeout(() => {
              setMessage({
                text: null
            })
            }, 3000)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }

  const handleNoteChangeName = (event) => setNewName(event.target.value)
  const handleNoteChangeNumber = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <Notification message={message.text} type={message.type} />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        onChangeName={handleNoteChangeName} 
        newNumber={newNumber} 
        onChangeNumber={handleNoteChangeNumber}
      />
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <Person
          key = {person.id}
          person = {person}
          deletePerson={() => deletePerson(person.id)}
        />
      )}
    </div>
  )
}

export default App