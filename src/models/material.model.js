import {
    getMaterialList,
    postMaterial,
    delMaterial
} from '@/services/wx'
import {message} from 'antd'
const Model = {
    namespace: 'material',
    state: {
        data: []
    },
    effects: {
        * GetMaterialList ({ payload }, { call, put }) {
            const res = yield call(getMaterialList, payload)
            yield put({ type: 'save', payload: res.data })
        },
        * PostMaterial ({payload}, {call}) {
            const res = yield call(postMaterial, payload)
            if (res.code === 20000 && res.data.media_id) {
                message.success('操作成功'+ res.data.media_id)
            } else {
                message.error('操作失败' + res.msg)
            }
        },
        * DelMaterial ({payload}, {call, put}) {
            const res = yield call(delMaterial, payload)
            if (res.code === 20002) {
                message.success('操作成功')
                yield put({ type: 'GetMaterialList' })
            } else {
                message.error('操作失败' + res.msg)
            }
        }
    },
    reducers: {
        save (state, { payload }) {
            return {
                ...state,
                data: payload.item
            }
        }
    },
    subscriptions: {
        setup ({ history, dispatch }) {
            history.listen(({pathname}) => {
                if (pathname === '/wx-material') {
                    dispatch({
                        type: 'GetMaterialList'
                    })
                }
            })
        }
    }
}

export default Model