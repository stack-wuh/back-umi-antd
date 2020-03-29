import React, { useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Modal, message } from 'antd'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { TableListItem } from './data.d'
import TableOptionBtns, { BtnOptionProps } from '@/components/TableOptionBtns'
import { queryArticle, deleteArticle } from './service'
import { postMaterial } from '../../WechatManage/Material/service'

const ArticleList: React.FC<{}> = ({ history }) => {
    const actionRef = useRef(null)

    const optionBtnList: BtnOptionProps[] = [
        {
            text: '更新',
            onClick: ({_id}) => {
                history.push({ pathname: '/art/list/update', query: { id: _id } })
            }
        },
        {
            text: '删除',
            onClick: ({_id}) => {
                Modal.confirm ({
                    title: '提示',
                    content: '是否删除此条内容, 请确认?',
                    onOk: async () => {
                        const res = await deleteArticle({id: _id})
                        if (res.code === 20000) {
                            message.success(res.msg)
                            actionRef.current.reload()
                        } else {
                            message.error(res.msg)
                        }
                    }
                })
            }
        },
        {
            text: '一键推送至微信',
            onClick: () => {}
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
            title: '_id',
            dataIndex: '_id',
            width: 140,
            copyable: true
        },
        {
            title: 'title',
            dataIndex: 'title',
            width: 140
        },
        {
            title: 'sub_title',
            dataIndex: 'sub_title',
            ellipsis: true,
            width: 180
        },
        {
            title: '封面图',
            dataIndex: 'cover_img',
            width: 140
        },
        {
            title: 'type',
            dataIndex: 'type',
            width: 100,
            initialValue: '1',
            valueEnum: {
                2: {
                    text: 'markdown',
                    status: 'Default'
                },
                1: {
                    text: 'richtext',
                    status: 'Default'
                }
            }
        },
        {
            title: 'update_at',
            dataIndex: 'update_at',
            valueType: 'dateTime',
            width: 120
        },
        {
            title: '操作',
            dataIndex: 'options',
            hideInSearch: true,
            hideInForm: true,
            width: 220,
            render: (text, record) => {
                return (<TableOptionBtns payload={record} list={optionBtnList} /> )
            }
        }
    ]

    return (<PageHeaderWrapper>
        <ProTable<TableListItem>
            actionRef={actionRef}
            scroll={{ x: columns.length * 140} }
            headerTitle='文章列表'
            columns={columns}
            request={() => queryArticle()}
            rowKey='_id' />
    </PageHeaderWrapper>)
}

export default ArticleList