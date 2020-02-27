import { articleList, articleUpdateBy, articleCreate, articleDelete, articleDetail } from '@/services/article'
import { message } from 'antd'

const Model = {
    namespace: 'art_list',
    state: {
        data: [],
        info: []
    },
    effects: {
        * getList (_, { call, put }) {
            const response = yield call(articleList, _.payload)
            yield put({ type: 'save', payload: response })
        },
        * updateBy (_, { call, put }) {
            const response = yield call(articleUpdateBy, _.payload)
            if (response.code === 20000) {
                message.success(response.msg)
                yield put({ type: 'getList'})
            } else {
                message.error(response.msg)
            }
        },
        * createBy (_, { call }) {
            const response = yield call(articleCreate, _.payload)
            if (response.code === 20000) {
                message.success(response.msg)
            } else {
                message.error(response.msg)
            }
        },
        * deleteBy (_, { call, put }) {
            const response = yield call(articleDelete, _.payload)
            if (response.code === 20000) {
                message.success(response.msg)
                yield  put({ type: 'getList'})
            } else {
                response.error(response.msg)
            }
        },
        * detailBy (_, { call, put }) {
            const response = yield call(articleDetail, _.payload)
            if (response.code === 20000) {
                yield put ({ type: 'saveInfo', payload: response })
            }
        }
    },
    reducers: {
        save (state, { payload }) {
            return {
                ...state,
                data: payload.data,
            }
        },
        saveInfo (state, { payload }) {
            return {
                ...state,
                info: payload.info
            }
        },
        clearInfo (state) {
            return {
                ...state, 
                info: []
            }
        }
    },
    subscriptions: {
        setup ({history, dispatch}) {
            history.listen(({pathname}) => {
              if (pathname === '/art') {
                  dispatch({ type: 'getList' })
              }
            })
        }
    }
}

export default Model