import React from 'react'
import { Button, Table, Switch, Modal, message } from 'antd'
import { connect } from 'dva'
import { router } from 'umi'
import PageLoading from '@/components/PageLoading'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { artTableColumns } from '../map'

function ArtList ({_, dispatch}, isloading) {
    const { data } = _
    const columns = [
        ...artTableColumns,
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (text, record) => {
                return (<Switch onChange={() => handleUpdate(record)} checked={text == 1}></Switch>)
            }
        },
        {
            title: '操作', 
            dataIndex: 'option', 
            key: 'option', 
            width: 200,
            fixed: 'right',
            render: (text, record) => OpsRender(record)
        }
    ]
    const OpsRender = (record) => {
        return (<React.Fragment key="buttons">
            <Button onClick={() => { router.push({ pathname: '/art/update', query: { id: record.id} }) }} type='link'>更新</Button>
            <Button onClick={() => handleDelete(record)} type='link'>删除</Button>
        </React.Fragment>)
    }
    
    const handleDelete = (data) => {
        Modal.confirm({
            title: '提示',
            content: '是否删除选中的项目, 请确认?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                try {
                    const { id } = data
                    dispatch({ type: 'art_list/deleteBy', payload: { id } })
                } catch (err) {
                    message.error(err)
                }
            }
        })
    }

    const handleUpdate = (params) => {
        const { id, state, ...args} = params
        dispatch({
            type: 'art_list/updateBy',
            payload: { id, state: ~~!+state}
        })
    }

    return (<PageHeaderWrapper>
       {
           !isloading ? 
            <PageLoading /> : 
            <Table scroll={{x: 1300}} columns={columns} rowKey='id' dataSource={data}></Table>
       }
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ art_list, loading }) => 
    ({ _: art_list, isloading: loading.effects['art_list/getList'] })
export default connect(mapStateToProps)(ArtList)