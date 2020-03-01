import {
  userQueryBy,
  userCreateBy,
  userUpdateBy,
  userDeleteBy
} from '@/services/user'
import { 
  message
} from 'antd'

const model = {
    namespace: 'user_list',
    state: {
        data: []
    },
    effects: {
        *query (_, { call, put }) {
            const response = yield call(userQueryBy, _.payload)
            if (response && response.code === 20000) {
                yield put({ type: 'save', payload: response })
            } else {
                message.error('操作失败' + response.msg)
            }
        },

        *create (_, { call, put }) {
            const response = yield call(userCreateBy, _.payload)
            if (response.code === 20001) {
                message.success('新建成功')
                yield put({ type: 'query' })
            } else {
                message.error('新建失败')
            }
        },
        *update (_, { call, put }) {
            const response = yield call(userUpdateBy, _.payload)
            if (response.code === 20001) {
                message.success('更新成功')
                yield put({ type: 'query' })
            } else {
                message.error('更新失败' + response.msg)
            }
        },
        *delete (_, { call, put }) {
            const response = yield call(userDeleteBy, _.payload)
            if (response.code === 20002) {
                message.success('删除成功')
                yield put({ type: 'query' })
            } else {
                message.error('删除失败' + response.msg)
            }
        }
    },
    reducers: {
        save: (state, {payload}) => {
            return {
                ...state,
                data: payload.data || []
            }
        }
    },
    subscriptions: {
        setup: ({ history, dispatch }) => {
            history.listen(({pathname}) => {
                if (pathname === '/user-list') {
                    dispatch({ type: 'query' })
                }
            })
        }
    }
}

export default model