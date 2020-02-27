import { 
    slideGetBy,
    slideCreateBy,
    slideUpdateBy,
    slideDeleteBy
} from '@/services/slide'
import { message } from 'antd'

const model = {
    namespace: 'slide',
    state: {
        data: []
    },
    effects: {
        *fetch (_, { call, put }) {
            const response = yield call(slideGetBy, _.payload)
            yield put({ type: 'save', payload: response})
        },
        *delete (_, { call, put }) {
            const response = yield call(slideDeleteBy, _.payload)
            if (response.code === 20004) {
                message.success('删除成功')
                yield put({ type: 'fetch' })
            } else {
                message.error('删除失败')
            }
        },
        *update (_, { call, put }) {
            const response = yield call(slideUpdateBy, _.payload)
            if (response.code === 20001) {
                message.success('更新成功')
                yield put({ type: 'fetch' })
            } else {
                message.error('更新失败'+ response.msg)
            }
        },
        *create (_, { call, put }) {
            const response = yield call(slideCreateBy, _.payload)
            if (response.code === 20001) {
                message.success('新建成功')
                yield put({ type: 'fetch' })
            } else {
                message.error('新建失败')
            }
        }
    },
    reducers: {
        save (state, { payload }) {
            return {
                state,
                data: payload.data
            }
        }
    },
    subscriptions: {
        setup ({ history, dispatch }) {
            history.listen(({ pathname }) => {
                if (pathname === '/slide') {
                    dispatch({ 
                        type: 'fetch'
                     })
                }
            })
        }
    }
}

export default model