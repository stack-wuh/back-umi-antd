import React from 'react'
import { Button, Tag, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { connect } from 'dva'
import moment from 'moment'
import PageLoading from '@/components/PageLoading'

const Material = ({ data, dispatch }) => {
    const columns = [
        {
            title: 'media_id',
            dataIndex: 'media_id',
            width: 220,
            ellipsis: true,
            copyable: true,
            fixed: 'left'
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 140,
            render: (text, record) => {
                const data = record && record.content && record.content.news_item[0]
                const { title } = data
                return (<span>{title}</span>)
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            width: 120,
            render: (text, record) => {
                const data = record && record.content && record.content.news_item[0]
                const { author } = data
                return (<Tag color='purple'>{author}</Tag>)
            }
        },
        {
            title: '链接',
            dataIndex: 'url',
            width: 220,
            copyable: true,
            render: (text, record) => {
                const data = record && record.content && record.content.news_item[0]
                const { url } = data
                return (<span>{url}</span>)
            }
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            width: 120,
            render: (text, record) => {
                return <span>{moment(record.content.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            width: 120,
            render: (text, record) => {
                return (<span>{moment(record.content.update_time*1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: 120,
            render: (text, record) => {
                return (<div>
                    <Button onClick={() => handleDelBy(record)} type='link'>删除</Button>
                </div>)
            }
        }
    ]

    const handleDelBy = params => {
        Modal.confirm({
            title: '提示',
            content: '即将删除素材, 请确认?',
            onCancel: () => {},
            onOk: () => {
                dispatch({ type: 'material/DelMaterial', payload: { media_id: params.media_id } })
            }
        })
    }

    return(<React.Fragment>
        <PageHeaderWrapper>
            {
                data 
                    ? <ProTable scroll={{x: columns.length * 120}} rowKey={'media_id'} columns={columns} dataSource={data} ></ProTable>
                    : <PageLoading />
            }
        </PageHeaderWrapper>
    </React.Fragment>)
}

export default connect(state => state.material)(Material)