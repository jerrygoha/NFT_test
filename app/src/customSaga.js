import { takeLatest, call } from 'redux-saga/effects';

function * getTokenInfo(action) {
    const instance = action.contract;
    if (action.payload.flag) {
        const owner = yield call(instance.methods.ownerOf(action.payload.tokenId).call);
        console.log(owner);
    }
}

function * tokenInfoSaga() {
    yield takeLatest('SELECT_TOKEN', getTokenInfo);
}

export default tokenInfoSaga;

