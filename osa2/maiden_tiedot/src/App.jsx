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
        <h3>Weather in {countryInformation.capital}</h3>
        <Weather 
          lat={countryInformation.capitalInfo.latlng[0]}
          lon={countryInformation.capitalInfo.latlng[1]}
        />
      </>
    )
  }
  // Ei näytetä mitään ennen kuin tiedot on haettu
  return null
}

const Weather = ({lat, lon}) => {
  const weather_api_key = import.meta.env.VITE_OPENWEATHER_APIKEY
  const [weatherInfo, setWeather] = useState(null)

  // Haetaan pääkaupungin säätiedot
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${weather_api_key}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if (weatherInfo) {
      return (
        <>
          <div>
            Temperature {weatherInfo.current.temp} Celsius
          </div>
          <img src={`https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@2x.png`} />
          <div>
            Wind {weatherInfo.current.wind_speed} m/s
          </div>
        </>
    )
  }
}

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  // Jos haku osuu täsmälleen johonkin maahan, näytetään vain se maa
  const exactMatch = countries.find(
    c => c.toLowerCase() === value.toLowerCase()
  )

  // Valitaan näytettävä maa sen mukaan onko haku täsmälleen jokin maa, vai nimen osa
  const countriesToShow = exactMatch
    ? [exactMatch]
    : countries.filter(c => c.toLowerCase().includes(value.toLowerCase()))

  // Haetaan kaikki maat API rajapinnan kautta sovelluksen käynnistyessä
  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data.map(c => c.name.common))
      })
  }, [])

  // Hakukentän asetus
  const filterHandler = (countryName) => {
    setValue(countryName)
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
