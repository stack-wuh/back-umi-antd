import request from '@/utils/request'

export async function bannerGetBy (params) {
    return request('/api/banner')
}

export async function bannerDeleteBy (params) {
    return request('/api/banner/delete', {
        method: 'DELETE',
        data: params
    })
}

export async function bannerCreateBy (params) {
    return request('/api/banner/create', {
        method: 'POST',
        data: params
    })
}

export async function bannerUpdateBy (params) {
    return request('/api/banner/update', {
        method: 'UPDATE',
        data: params
    })
}