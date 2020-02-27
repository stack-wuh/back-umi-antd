import request from '@/utils/request'

export async function slideGetBy (params) {
    return request('/api/menus')
}

export async function slideCreateBy (params) {
    return request('/api/menus/create', {
        method: 'POST',
        params
    })
}

export async function slideUpdateBy (params) {
    return request('/api/menus/update', {
        method: 'PUT',
        params
    })
}

export async function slideDeleteBy (params) {
    return request('/api/menus/delete', {
        method: 'DELETE',
        params
    })
}