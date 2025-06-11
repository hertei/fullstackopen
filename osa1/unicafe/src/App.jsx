import { useState } from 'react'

const Button = ({onClick, name}) => <button onClick={onClick}>{name}</button>

const Statistics = ({good, neutral, bad}) => {
  if (good > 0 || neutral > 0 || bad > 0) {
    return (
      <table>
        <thead>
          <StatisticsLine text='good' value = {good} />
          <StatisticsLine text='neutral' value = {neutral} />
          <StatisticsLine text='bad' value = {bad} />
          <StatisticsLine text='all' value = {good + neutral + bad} />
          <StatisticsLine text='average' value = {(good - bad) / (good + neutral + bad)} />
          <StatisticsLine text='positive' value = {(good / (good + neutral + bad))*100} />
        </thead>
      </table>
    )
  }
  else {
    return <div>No feedback given</div>
  }
}

const StatisticsLine = ({text, value}) => {
  if (text == 'average'){
    return (
      <tr>
      <td>{text}</td>
      <td>{value.toFixed(1)}</td>
      </tr>
    )
  }else if (text == 'positive'){
    return (
      <tr>
        <td>{text}</td>
        <td>{value.toFixed(1)} %</td>
      </tr>
    )
  }
    else{
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }
}
  

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App