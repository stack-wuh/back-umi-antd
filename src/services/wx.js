import request from '@/utils/request'

export async function getMaterialList (params) {
    return request('/api/wechat/material', {
        params
    })
}

export async function postMaterial (params) {
    return request('/api/wechat/material', {
        method: 'POST',
        data: params
    })
}

export async function delMaterial (params) {
    return request('/api/wechat/material', {
        method: 'DELETE',
        data: params
    })
}