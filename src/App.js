import React from 'react';
import cx from 'classnames'
import { curry } from 'yafu'
import { append, assoc, map } from 'ramda'
import './App.css';

const { useState, useEffect } = React

const initialTodos = [
  { _id: 'td0', name: 'Buy milk', done: false },
  { _id: 'td1', name: 'Write book', done: true },
]

function fetchTodos (setState) {
  setTimeout(setState, 1000, initialTodos)
}

function useTheContext () {
  const [ state, setState ] = useState([])

  useEffect(() => {
    fetchTodos(setState)
  }, [])

  function setItemStatus (id, status) {
    setTimeout(() => {
      setState(map((item) => item._id === id ? assoc('done', status, item) : item))
    }, 1000)
  }

  function createItem (name) {
    setTimeout(() => {
      setState((list) => {
        return append({ _id: `td${list.length}`, name, done: false }, list)
      })
    }, 1000)
  }

  return { state, setItemStatus, createItem }
}

function TodoItem (props) {
  const { todo, onStatusChange } = props
  const { done } = todo
  const statusClass = cx({
    'is-done': done,
  })

  return (
    <div className="todo">
      <label>
        <input type="checkbox" checked={ done } onChange={ () => onStatusChange(todo) } />
        <span className={ `todo-name ${statusClass}` }>{ todo.name }</span>
      </label>
    </div>
  )
}

const createTodoItem = curry((changeStatus, todo) => {
  return <TodoItem key={ todo._id } todo={ todo } onStatusChange={ changeStatus } />

})

function App() {
  const { state: todos, setItemStatus, createItem } = useTheContext()
  const [ name, setName ] = useState('')

  function handleSubmit (e) {
    e.preventDefault()
    createItem(name)
  }

  function changeStatus (todo) {
    setItemStatus(todo._id, !todo.done)
  }

  return (
    <div className="content">
      <form onSubmit={ handleSubmit } className="todo-form" >
        <label>Add a Todo</label>
        <input
          type="text"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
        />
        <button type="submit">+ Add</button>
      </form>
      <div className="todos">
        { map(createTodoItem(changeStatus), todos) }
      </div>
    </div>
  );
}

export default App;
