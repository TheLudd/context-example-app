import { takeEvery, put } from 'redux-saga/effects'
import { merge } from 'ramda'
import uuid from 'uuid/v4'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const initialTodos = [
  { id: uuid(), name: 'Buy milk', completed: false },
  { id: uuid(), name: 'Write book', completed: false }
]

export function* fetchTodos(actions) {
  yield delay(1000)
  yield put({ type: 'TODOS_FETCHED', meta: 'EVENT', payload: initialTodos })
}

export function* createTodo(action) {
  const { payload } = action
  yield delay(1000)
  yield put({ type: 'TODO_CREATED', meta: 'EVENT', payload: { id: uuid(), ...payload, completed: false } })
}

export function* updateTodo(action) {
  const { payload } = action
  yield delay(1000)
  yield put({ type: 'TODO_UPDATED', meta: 'EVENT', payload: merge(payload, { isLoading: false }) })
}

export function* watchTodoActions() {
  yield takeEvery('FETCH_TODOS', fetchTodos)
  yield takeEvery('CREATE_TODO', createTodo)
  yield takeEvery('UPDATE_TODO', updateTodo)
}
