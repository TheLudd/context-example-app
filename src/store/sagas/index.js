import { fork } from 'redux-saga/effects'
import { watchTodoActions } from './todos.sagas'

export default function* rootSaga() {
  yield fork(watchTodoActions)
}
