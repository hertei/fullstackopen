import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      {anecdote.content}
      <div>
        has {anecdote.votes} <button onClick={handleClick}>vote</button>
      </div> 
    </div>
  )
}

const AnecdoteList = () => {

  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    
    if ( filter === '' ) {
      return anecdotes
    }
    return anecdotes.filter(anecdote => 
      anecdote.content.includes(filter))
  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => { 
            dispatch(setNotification(`voted anecdote '${anecdote.content}'`, 3))
            dispatch(addVote(anecdote.id))}}
        />
      )}
    </div>
    )
}

export default AnecdoteList

/*
{anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
        </div>
      </div>
    )}
*/