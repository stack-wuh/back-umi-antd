import {
    bannerGetBy,
    bannerDeleteBy
} from '@/services/banner'

const Model = {
    namespace: 'banner',
    state: {
        data: []
    },
    effects: {
        * fetch (_, { call, put }) {
            const response = yield call(bannerGetBy, _.payload)
            yield put({ type: 'save', payload: response })
        },
        * delete (_, { call, put }) {
            const response = yield call(bannerDeleteBy, _.payload)
            yield put({ type: 'fetch' })
        },
        * create (_, { call, put }) {

        }
    },
    reducers: {
        save: (state, {payload}) => ({ ...state, data: payload.data })
    },
    subscriptions: {
        setup ({history, dispatch}) {
            history.listen(({pathname}) => {
                if (pathname === '/banner') {
                    dispatch({
                        type: 'fetch'
                    })
                }
            })
        }
    }
}

export default Model