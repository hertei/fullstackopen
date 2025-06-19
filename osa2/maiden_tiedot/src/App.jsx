import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({country}) => {
  return (
      <div>
        {country}
      </div>
  )
}

const CountryInformation = ({country}) => {
  console.log(`Vain yksi maa ${country}`)
  const [countryInformation, setInformation] = useState(null) 
  
  useEffect (() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        console.log(`Ainoan maan tiedot ${response.data}`)
        setInformation(response.data)
      })
    },[])
  if (countryInformation){
    return (
      <>
        <h2>{countryInformation.name.common}</h2>
        <div>Capital: {countryInformation.capital}</div>
        <div>Area: {countryInformation.area}</div>
        <h3>Languages</h3>
        {Object.values(countryInformation.languages).map((lang, key) => (
          <li key={key}>
            {lang}
          </li>
        ))}
        <div>
        <img src={countryInformation.flags.png} width="200"/>
        </div>
      </>
    )
  }
}

const Information = ({countriesToShow, country}) => {
  return (countriesToShow.length >= 10
      ? <div>Too many matches, specify antoher filter</div>
      : countriesToShow.length === 1
        ? countriesToShow.map(country  => 
          <CountryInformation
            key={country}
            country={country}
          />)
        : countriesToShow.map(country  => 
          <Countries
            key={country}
            country={country}
          />
      )
    )
}


const App = () => {
  const [value, setValue] = useState('')
  const [country, setCountry] = useState(null)
  const [countries, setCountries] = useState([])
  
  const countriesToShow = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()))

  //haetaan kaikki maat
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data.map(c => c=c.name.common))
      })
    },[])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCountry(value)
    setValue('')
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries: <input value={value} onChange={handleChange} />
      </form>
      <Information 
        countriesToShow={countriesToShow}
        country={country}/>
    </div>
  )
}

export default App
