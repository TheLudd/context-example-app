import { combineReducers } from 'redux'

import { reducer } from './todos.reducer'


export default combineReducers({
  todosState: reducer,
})
