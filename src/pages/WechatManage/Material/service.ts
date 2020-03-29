import request from '@/utils/request'
import { TableListItem } from './data.d'

export async function queryMaterial (params: TableListItem) {
    return request('/api/wechat/material', {
        params
    })
}

export async function delMaterial (params: {media_id: string}) {
    return request('/api/wechat/material', {
        method: 'DELETE',
        data: params
    })
}

export async function postMaterial (params: { media_id: string}) {
    return request('/api/wechat/material', {
        method: 'POST',
        data: params
    })
}