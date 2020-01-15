import React, { useState, useMemo, useEffect } from 'react'
import { compose } from 'yafu'
import { assoc, map, curry, isNil, identical, filter, both, test } from 'ramda'
import { useSelector, useDispatch } from 'react-redux'
import { actions } from './store/reducers/todos.reducer'
import './App.css'

const noop = () => {}

const filterOnStatus = curry((filterVal, item) => isNil(filterVal) || filterVal === item.completed)
const filterOnName = curry((filterVal, item) => identical(filterVal, '') || test(new RegExp(filterVal, 'i'), item.name))

const filterTodos = (filters, todos) => {
  const { name, completed } = filters
  return filter(both(filterOnStatus(completed), filterOnName(name)), todos)
}

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

function tv (fn) {
  return (e) => fn(e.target.value)
}

function getCompletedFilterValue (string) {
  return string === 'all' ? undefined : string === 'true'
}

function App() {
  const dispatch = useDispatch()
  const { todos: pureTodos, filters, isLoading, isCreating } = useSelector(store => store.todosState)
  const [ name, setName ] = useState('')
  const { name: nameFilter, completed: completedFilter } = filters

  const todos = useMemo(() => filterTodos(filters, pureTodos), [ filters, pureTodos ])

  const hasFilters = (filters.name && filters.name.length > 0) || !isNil(filters.completed)

  useEffect(() => {
    dispatch(actions.fetchTodos())
    return () => null
  }, [dispatch])

  const handleSubmitTodo = (e) => {
    e.preventDefault()
    const todo = { name }
    dispatch(actions.createTodo(todo))
  }

  const dispatchFilterTodos = (payload) => {
    dispatch(actions.filterTodos(payload))
  }

  function updateNameFilter (name) {
    dispatchFilterTodos(assoc('name', name, filters))
  }

  function updateCompletedFilter (val) {
    dispatchFilterTodos(assoc('completed', val, filters))
  }

  const handleClearFilters = () => {
    dispatch(actions.filterTodos({}))
  }

  const setCompleted = (id, completed) => dispatch(actions.updateTodo({ id, completed }))

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
      <div className="todo-form">
        <label>
          FILTERS
          { hasFilters &&
            <span className="filter-clear" onClick={ handleClearFilters }>X Clear</span>
          }
        </label>
        <input
          type="text"
          name="name"
          value={ nameFilter }
          onChange={ tv(updateNameFilter) }
          disabled={ isLoading }
        />
        <div className="filter-complete" onChange={ tv(compose(updateCompletedFilter, getCompletedFilterValue)) }>
          <label>
            <input type="radio" name="completed" value="all" checked={ completedFilter === 'all' } onChange={ noop } />
            All
          </label>
          <label>
            <input type="radio" name="completed" value="true" checked={ completedFilter === true } onChange={ noop } />
            Completed
          </label>
          <label>
            <input type="radio" name="completed" value="false" checked={ completedFilter === false } onChange={ noop } />
            To do
          </label>
        </div>
      </div>
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
