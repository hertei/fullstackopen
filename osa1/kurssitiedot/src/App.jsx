const Header = (props) => {
  console.log(props)
  return(
    <h1>
      {props.course}
    </h1>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part part={props.parts[0]} exercise={props.parts[1]}/>
      <Part part={props.parts[2]} exercise={props.parts[3]}/>
      <Part part={props.parts[4]} exercise={props.parts[5]}/>
    </>
  )
}

const Part = (props) => {
  console.log(props)
  return(
    <p>
      {props.part} {props.exercise}
    </p>
  )
}

const Total = (props) => {
  console.log(props)
  return(
    <p>
      Number of exercises {props.total}
    </p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content parts={[part1, exercises1, part2, exercises2, part3, exercises3]}/>
      <Total total={exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

export default App