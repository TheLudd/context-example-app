import { append, merge, lensProp, over, curry, compose, map, identical, assoc } from 'ramda'

const initialState = {
  todos: [],
  filters: {},
  isLoading: false,
  isCreating: false,
}

const updateByEntity = curry((partialEntity, list) => map((entity) => {
  return identical(entity.id, partialEntity.id)
    ? merge(entity, partialEntity)
    : entity
}, list))

const todosReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'FETCH_TODOS':
      return assoc('isLoading', true, state)
    case 'CREATE_TODO':
      return assoc('isCreating', true, state)
    case 'UPDATE_TODO':
      return over(lensProp('todos'), updateByEntity({ id: action.payload.id, isLoading: true }), state)
    case 'FILTER_TODOS':
      return assoc('filters', action.payload, state)
    case 'TODOS_FETCHED':
      return compose(assoc('isLoading', false), assoc('todos', action.payload))(state)
    case 'TODO_CREATED':
      return assoc('isCreating', false, over(lensProp('todos'), append(action.payload), state))
    case 'TODO_UPDATED':
      return over(lensProp('todos'), updateByEntity(action.payload), state)
    default:
      return state
  }
}

export default todosReducer
