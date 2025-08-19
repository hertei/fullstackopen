import { useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import PropTypes from 'prop-types'


const AnecdoteForm = ({ queryClient }) => {
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: async ( newAnecdote ) => {
      await queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

AnecdoteForm.propTypes = {
  queryClient: PropTypes.object.isRequired
}

export default AnecdoteForm
