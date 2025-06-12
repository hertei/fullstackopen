const Course = ({course}) => (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )

const Header = ({course}) => {
  return(<h3>{course.name}</h3>)
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part}/>)}
    </div>
  )
}

const Part = ({part}) => {
  return(<p>{part.name} {part.exercises}</p>)
}

const Total = ({parts}) => {
  const total = parts.reduce((accumulator, currentValue) => (accumulator + currentValue.exercises), 0)  
  return(
    <b>
      total of {total} exercises
    </b>
  )
}

export default Course