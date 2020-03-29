import React, { useRef } from 'react'
import { message, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns, ActionType }  from '@ant-design/pro-table'
import TableOptionBtn, { BtnOptionProps } from '@/components/TableOptionBtns'
import { TableListItem } from './data.d'
import { queryMaterial, delMaterial } from './service'


const MaterialList: React.FC<{}> = () => {
    const actionRef = useRef<ActionType>()

    const optionBtn: BtnOptionProps[] = [
        {
            text: '删除',
            onClick: ({ media_id }) => {
                Modal.confirm({
                    title: '提示',
                    content: '是否要删除该条素材, 请确认?',
                    onOk: async () => {
                        const response = await delMaterial({ media_id })
                        if (response.code === 20004) {
                            message.success(response.msg)
                            if (actionRef.current) {
                                actionRef.current.reload()
                            }
                        } else {
                            message.error(response.msg)
                        }
                    }
                })
            } 
        }
    ]

    const columns: ProColumns<TableListItem>[] = [
        {
            title: '序号',
            valueType: 'index',
            width: 90,
            fixed: 'left'
        },
        {
            title: '素材ID',
            dataIndex: 'media_id',
            width: 160,
            copyable: true,
            ellipsis: true
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 140,
            copyable: true,
            ellipsis: true
        },
        {
            title: '作者',
            dataIndex: 'author',
            width: 120
        },
        {
            title: '描述',
            dataIndex: 'digest',
            width: 180,
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: '原文链接',
            dataIndex: 'content_source_url',
            width: 180,
            copyable: true,
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: '内容',
            dataIndex: 'content',
            width: 140,
            ellipsis: true,
            hideInSearch: true
        },  
        {
            title: '地址链接',
            dataIndex: 'url',
            width: 160,
            copyable: true,
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: '封面图',
            dataIndex: 'thumb_url',
            width: 160,
            copyable: true,
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: 'need_open_comment',
            dataIndex: 'need_open_comment',
            width: 160,
            initialValue: 0,
            valueEnum: {
                0: {
                    text: '关闭',
                    status: 'Error'
                },
                1: {
                    text: '开启',
                    status: 'Success'
                }
            }
        },
        {
            title: 'only_fans_can_comment',
            dataIndex: 'only_fans_can_comment',
            width: 160,
            initialValue: 0,
            valueEnum: {
                0: {
                    text: '关闭',
                    status: 'Error'
                },
                1: {
                    text: '开启',
                    status: 'Success'
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            valueType: 'dateTime',
            width: 200
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            valueType: 'dateTime',
            width: 200
        },
        {
            title: '操作',
            valueType: 'option',
            width: 160,
            hideInSearch: true,
            render: (text, record) => (<TableOptionBtn payload={record} list={optionBtn} />)
        }
    ]

    const handleFormatData = (data: object) => {
        const values = data?.item.reduce((prev: any, acc: object) => {
            const info = acc?.content?.news_item?.[0]
            prev.push({
                media_id: acc?.media_id,
                create_time: acc?.content?.create_time*1000,
                update_time: acc?.content?.update_time*1000,
                ...info
            })
            return prev
        }, [])
        return values
    }

    return (<PageHeaderWrapper>
        <ProTable<TableListItem>
            actionRef={actionRef}
            scroll={{x: columns.length*140}}
            columns={columns}
            rowKey='media_id'
            request={() => queryMaterial()}
            postData={handleFormatData} />
    </PageHeaderWrapper>)
}

export default MaterialList