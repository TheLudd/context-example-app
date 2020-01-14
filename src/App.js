import React from 'react';
import cx from 'classnames'
import { append, reject, identical, contains, assoc, map } from 'ramda'
import './App.css';

const {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect
} = React

const TodoContext = createContext({})

const initialTodos = [
  { _id: 'td0', name: 'Buy milk', done: false },
  { _id: 'td1', name: 'Write book', done: true },
]

function constructTodoActions (stateModifiers) {
  const { setList, setLoadingTodos, setIsCreating } = stateModifiers
  function fetchTodos () {
    setTimeout(setList, 1000, initialTodos)
  }

  function setItemStatus (id, status) {
    setLoadingTodos(append(id))
    setTimeout(() => {
      setList(map((item) => item._id === id ? assoc('done', status, item) : item))
      setLoadingTodos(reject(identical(id)))
    }, 1000)
  }

  function createItem (name) {
    setIsCreating(true)
    setTimeout(() => {
      setList((list) => {
        return append({ _id: `td${list.length}`, name, done: false }, list)
      })
      setIsCreating(false)
    }, 1000)
  }

  return {
    createItem,
    fetchTodos,
    setItemStatus,
  }
}

function useTodoResource () {
  const [ list, setList ] = useState([])
  const [ loadingTodos, setLoadingTodos ] = useState([])
  const [ isCreating, setIsCreating ] = useState(false)
  const actions = useMemo(() => {
    return constructTodoActions({ setList, setLoadingTodos, setIsCreating })
  }, [ setList, setLoadingTodos, setIsCreating ])

  useEffect(() => {
    actions.fetchTodos()
  }, [ actions ])

  return { list, actions, loadingTodos, isCreating }
}

function useTodoStore () {
  const {
    list: todos,
    loadingTodos,
    actions: todoActions,
    isCreating,
  } = useTodoResource()
  const state = { resources: { todos }, loadingProps: { loadingTodos }, isCreating }

  return { state, actions: { todoActions } }
}

function TodoItem (props) {
  const { todo, isLoading, onStatusChange } = props
  const { done } = todo
  const statusClass = cx({
    'is-done': done,
  })

  if (isLoading) {
    return <div>LOADING</div>
  }

  return (
    <div className="todo">
      <label>
        <input type="checkbox" checked={ done } onChange={ () => onStatusChange(todo) } />
        <span className={ `todo-name ${statusClass}` }>{ todo.name }</span>
      </label>
    </div>
  )
}

function TodoApp () {
  const { state, actions } = useContext(TodoContext)
  const { resources, loadingProps, isCreating } = state
  const { todoActions } = actions
  const { todos } = resources
  const { loadingTodos } = loadingProps
  const { createItem, setItemStatus } = todoActions

  const [ name, setName ] = useState('')

  function handleSubmit (e) {
    e.preventDefault()
    createItem(name)
  }

  function changeStatus (todo) {
    setItemStatus(todo._id, !todo.done)
  }

  useEffect(() => {
    if (!isCreating) {
      setName('')
    }
  }, [ isCreating ])

  return (
    <div className="content">
      <form onSubmit={ handleSubmit } className="todo-form" >
        <label>Add a Todo</label>
        <input
          disabled={ isCreating }
          type="text"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
        />
        <button type="submit">+ Add</button>
      </form>
      <div className="todos">
        { map((item) => {
          return (
            <TodoItem
              key={ item._id }
              todo={ item }
              isLoading={ contains(item._id, loadingTodos) }
              onStatusChange={ changeStatus }
            />
          )
        }, todos) }
      </div>
    </div>
  )
}

function Main() {
  return (
    <TodoContext.Provider value={ useTodoStore() } >
      <TodoApp />
    </TodoContext.Provider>
  );
}

export default Main;
