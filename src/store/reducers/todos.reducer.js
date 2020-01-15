import { K, compose } from 'yafu'
import { append, merge, lensProp, over, curry, map, identical, assoc } from 'ramda'

import { createSlice } from '@reduxjs/toolkit'

function createFunctionalSlice (conf) {
  const modifiedConf = overReducers(map((fn) => (state, action) => fn(action.payload, state)), conf)
  return createSlice(modifiedConf)
}

const initialState = {
  todos: [],
  filters: { name: '' },
  isLoading: false,
  isCreating: false,
}

const updateByEntity = curry((partialEntity, list) => map((entity) => {
  return identical(entity.id, partialEntity.id)
    ? merge(entity, partialEntity)
    : entity
}, list))

const overReducers = over(lensProp('reducers'))
const overTodos = over(lensProp('todos'))

const sliceConf = {
  initialState,
  name: 'todos',
  reducers: {
    fetchTodos: K(assoc('isLoading', true)),
    createTodo: K(assoc('isCreating', true)),
    todosFetched: (todos, state) => merge(state, { todos, isLoading: false }),
    filterTodos: assoc('filters'),
    todoCreated: (todo, state) => assoc('isCreating', false, over(lensProp('todos'), append(todo), state)),
    updateTodo: (update, state) => overTodos(updateByEntity({ id: update.id, isLoading: true }), state),
    todoUpdated: compose(overTodos, updateByEntity),
  }
}

const { reducer, actions } = createFunctionalSlice(sliceConf)

export { reducer, actions }
