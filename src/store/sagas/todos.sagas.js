import { takeEvery, put } from 'redux-saga/effects'
import { merge } from 'ramda'
import uuid from 'uuid/v4'
import { actions } from '../reducers/todos.reducer'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const initialTodos = [
  { id: uuid(), name: 'Buy milk', completed: false },
  { id: uuid(), name: 'Write book', completed: true }
]

export function* fetchTodos() {
  yield delay(1000)
  yield put(actions.todosFetched(initialTodos))
}

export function* createTodo(action) {
  const { payload } = action
  yield delay(1000)
  const data = { id: uuid(), ...payload, completed: false }
  yield put(actions.todoCreated(data))
}

export function* updateTodo(action) {
  const { payload } = action
  yield delay(1000)
  const data = merge(payload, { isLoading: false })
  yield put(actions.todoUpdated(data))
}

export function* watchTodoActions() {
  yield takeEvery('todos/fetchTodos', fetchTodos)
  yield takeEvery('todos/createTodo', createTodo)
  yield takeEvery('todos/updateTodo', updateTodo)
}
