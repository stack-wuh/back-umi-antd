import request from '@/utils/request'
import { FormValueType } from '../Update'

export async function queryArticle (params?: {}) {
    return request('/api/articles', {
        params
    })
}

export async function postArticle (params: FormValueType) {
    return request('/api/articles/create', {
        method: 'POST',
        data: params
    })
}

export async function deleteArticle (params: object) {
    return request('/api/articles/delete', {
        method: 'DELETE',
        params
    })
}