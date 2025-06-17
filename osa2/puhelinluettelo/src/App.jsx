import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({persons, filter}) => {
  const personsToShow = persons.filter(person => 
  person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <ul>
      {personsToShow.map((person, i) => (
        <li key={i}>{person.name} {person.number}</li>
      ))}
    </ul>
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

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName, newNumber)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map(name => name=name.name).includes(personObject.name)){
      alert(`${personObject.name}  is already added to phonebook`)
    }else{
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNoteChangeName = (event) => setNewName(event.target.value)
  const handleNoteChangeNumber = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        onChangeName={handleNoteChangeName} 
        newNumber={newNumber} 
        onChangeNumber={handleNoteChangeNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App