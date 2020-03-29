import request from '@/utils/request'
import { TableItemProps } from './data.d'

export async function queryBanner (params: TableItemProps) {
    return request('/api/banner', {
        params
    })
}

export async function postBanner (params: TableItemProps) {
    return request('/api/banner/create', {
        method: 'POST',
        data: params
    })
}

export async function delBanner (params: {id: string}) {
    return request('/api/banner/delete', {
        method: 'DELETE',
        data: params
    })
}

export async function putBanner (params: TableItemProps) {
    return request('/api/banner/update', {
        method: 'PUT',
        data: params
    })
}