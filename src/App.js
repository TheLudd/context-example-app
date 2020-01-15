import React, { useState, useEffect } from 'react'
import { map, isEmpty, isNil } from 'ramda'
import { useSelector, useDispatch } from 'react-redux'
import './App.css'

const noop = () => {}

function TodoItem (props) {
  const { todo, setCompleted } = props

  const handleToggleComplete = (e) => setCompleted(todo.id, !todo.completed)

  return (
    <div className="todo">
      <label>
        { !todo.isLoading &&
          <div className="todo-completed" onClick={ handleToggleComplete }>[{ todo.completed ? '+' : ' ' }]</div>
        }
        <span className="todo-name">{ todo.name }</span>
      </label>
    </div>
  )
}


function App() {
  const dispatch = useDispatch()
  const { todos: pureTodos, filterFn, isLoading, isCreating } = useSelector(store => store.todosState)
  const [ name, setName ] = useState('')

  const todos = filterFn(pureTodos)

  useEffect(() => {
    dispatch({ type: 'FETCH_TODOS', meta: 'COMMAND', payload: null })
    return () => null
  }, [dispatch])

  const handleSubmitTodo = (e) => {
    e.preventDefault()
    dispatch({ type: 'CREATE_TODO', meta: 'COMMAND', payload: { name } })
  }

  const handleFilterTodos = (e) => {
    e.preventDefault()
    dispatch({ type: 'FILTER_TODOS', meta: 'COMMAND', payload: { name: 'hello' } })
  }

  const setCompleted = (id, completed) => dispatch({ type: 'UPDATE_TODO', meta: 'COMMAND', payload: { id, completed } })

  return (
    <div className="content">
      <form onSubmit={ handleSubmitTodo } className="todo-form" >
        <label>ADD A TODO</label>
        <input
          type="text"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
          disabled={ isCreating }
        />
        <button type="submit" disabled={ isCreating }>
          { isCreating ? '...' : '+ Add' }
        </button>
      </form>
      <form onSubmit={ handleFilterTodos } className="todo-form">
        <label>FILTERS</label>
        <input
          type="text"
          name="name"
          disabled={ isLoading }
        />
        <button type="submit" disabled={ isLoading }>
          { isLoading ? '...' : '- Filter' }
        </button>
        <div className="filter-complete">
          <label>
            <input type="radio" name="completed" value={ 'all' } onChange={ noop } />
            All
          </label>
          <label>
            <input type="radio" name="completed" value={ true } onChange={ noop } />
            Completed
          </label>
          <label>
            <input type="radio" name="completed" value={ false } onChange={ noop } />
            To do
          </label>
        </div>
      </form>
      <div className="todos">
        { map( (todo) =>
          <TodoItem key={ todo.id } todo={ todo } setCompleted={ setCompleted } />
        , todos) }
        { isLoading &&
          <div className="loader" />
        }
      </div>
    </div>
  )
}

export default App
