import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from '@drizzle/store'
import tokenListSaga from './customSaga'

export default function * root() {

    const sagas = [...drizzleSagas.map(saga => fork(saga)), fork(tokenListSaga)];
    yield all(
        sagas
    )
}
