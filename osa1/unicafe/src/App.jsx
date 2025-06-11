import { useState } from 'react'

const Button = ({onClick, name}) => <button onClick={onClick}>{name}</button>

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (value) => {
    switch (value) {
      case 1:
        setGood(good + 1)
        break;
      case 0:
        setNeutral(neutral + 1)
        break;
      case -1:
        setBad(bad + 1)
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => handleClick(1)} name='good'/>
      <Button onClick={() => handleClick(0)} name='neutral'/>
      <Button onClick={() => handleClick(-1)} name='bad'/>
      <h2>Statistics</h2>
        <div>Hyviä: {good}</div>
        <div>Neutraaleja: {neutral}</div>
        <div>Huonoja: {bad}</div>
    </div>
  )
}

export default App