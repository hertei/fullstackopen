import { useState, useEffect } from 'react'
import axios from 'axios'

// Palautetaan maan nimi
const Countries = ({ country, filterHandler }) => {
  return (
    <div>
      {country}
      <button onClick={() => {
        filterHandler(country)
        return(
        <CountryInformation
        key={country}
        country={country}
      />)
      }}>select</button>
    </div>
  )
}

// Näytetään maat tai maan tiedot suodatuksen perusteella
const Information = ({ countriesToShow, filterHandler }) => {
  // Jos maita yli 10, pyydetään tarkennus
  if (countriesToShow.length >= 10) {
    return <div>Too many matches, specify another filter</div>
  }
  // Jos vain yksi maa, näytetään sen tiedot
  if (countriesToShow.length === 1) {
    return countriesToShow.map(country =>
      <CountryInformation
        key={country}
        country={country}
      />
    )
  }
  // Muussa tapauksessa listataan maat
  return countriesToShow.map(country =>
    <Countries
      key={country}
      country={country}
      filterHandler={filterHandler}
    />
  )
}

// Haetaan ja näytetään yksittäisen maan tiedot
const CountryInformation = ({ country }) => {
  const [countryInformation, setInformation] = useState(null)

  // Haetaan maan tiedot
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        setInformation(response.data)
      })
  }, [country])

  // Näytetään tiedot kun ne on haettu
  if (countryInformation) {
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
          <img src={countryInformation.flags.png} width="200" />
        </div>
      </>
    )
  }
  // Ei näytetä mitään ennen kuin tiedot on haettu
  return null
}

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  // Suodatetaan maat hakukentän arvon perusteella
  const countriesToShow = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()))

  // Haetaan kaikki maat API rajapinnan kautta sovelluksen käynnistyessä
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data.map(c => c.name.common))
      })
  }, [])

  // Hakukentän asetus
  const filterHandler = (event) => {
    setValue(event)
  }

  // Päivitetään hakukentän arvo
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
      <form>
        find countries: <input value={value} onChange={handleChange} />
      </form>
      <Information
        countriesToShow={countriesToShow}
        filterHandler={filterHandler}
      />
    </div>
  )
}

export default App
