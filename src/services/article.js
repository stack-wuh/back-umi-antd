import request from '@/utils/request'

export async function articleList (params) {
    return request(`/api/articles`, {
        params
    })
}

export async function articleUpdateBy (params) {
    return request('/api/articles/update', {
        method: 'PUT',
        data: params
    })
}

export async function articleCreate (params) {
    return request('/api/articles/create', {
        method: 'POST',
        data: params
    })
}

export async function articleDelete (params) {
    return request('/api/articles/delete', {
        method: 'DELETE',
        params
    })
}

export async function articleDetail (params) {
    return request('/api/articles/detail', {
        method: 'GET',
        params
    })
}