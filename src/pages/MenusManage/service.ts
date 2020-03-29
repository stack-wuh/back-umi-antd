import request from '@/utils/request'
import { TableColumnProps } from './data.d'

export async function queryMenus(params?: TableColumnProps) {
    return request('/api/menus', {
        params
    })
}

export async function deleteMenus (params: object) {
    return request('/api/menus/delete', {
        method: 'DELETE',
        params
    })
}

export async function postMenus (params: TableColumnProps) {
    return request('/api/menus/create', {
        method: 'POST',
        data: params
    })
}

export async function updateMenus (params: TableColumnProps) {
    return request('/api/menus/update', {
        method: 'PUT',
        data: params
    })
}