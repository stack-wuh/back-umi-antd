import React, { useState } from 'react'
import { Button, Table, Switch, Modal, message, List, Avatar } from 'antd'
import { connect } from 'dva'
import { router } from 'umi'
import PageLoading from '@/components/PageLoading'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { artTableColumns } from '../map'
import SendToWx from './sendWx'

function ArtList ({_, dispatch, material}, isloading, isListLoading) {
    const [isWxDialog, setisWxDialog] = useState(false)
    const [itemInfo, setItemInfo] = useState({})
    const { data } = _
    const { data: listData } = material
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
            title: '封面图',
            dataIndex: 'cover_img'
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
            <Button onClick={() => handleOpenSend(record)} type='link'>一键推送微信素材</Button>
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

    const handleOpenSend = params => {
        setisWxDialog(true)
        setItemInfo(params)
        dispatch({ type: 'material/GetMaterialList', payload: { type: 'image', offset: 0, count: 20 } })
    }

    const handleSendWx = params => {
        const formModal =  {
            "articles": [
                {
                    "title": itemInfo.title,
                    "thumb_media_id": params.media_id,
                    "author": 'shadow',
                    "digest": itemInfo.sub_title,
                    "show_cover_pic": 1,
                    "content": itemInfo.content,
                    "content_source_url": 'https://wuh.site'
                },
                //若新增的是多图文素材，则此处应还有几段articles结构
            ]
        }
        dispatch({ type: 'material/PostMaterial', payload: formModal })
        setTimeout(() => {
            setisWxDialog(false)
        }, 500)
    }

    return (<PageHeaderWrapper>
       {
           !isloading ? 
            <PageLoading /> : 
            <Table scroll={{x: 1300}} columns={columns} rowKey='id' dataSource={data}></Table>
       }
       <SendToWx isVisible={isWxDialog} onCancel={() => setisWxDialog(false)} >
            <List
                loading={isListLoading}
                itemlayout='horizontal'
                dataSource={listData}
                renderItem={item => (<List.Item>
                    <List.Item.Meta  
                        avatar={<Avatar src={item.url} />} 
                        title={ <Button type='link'>{item.name}</Button> }
                        description={<span>{item.media_id}</span>}/>
                    <Button onClick={() => handleSendWx(item)} type='link'>提交</Button>
                </List.Item>)}>
            </List>
       </SendToWx>
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ art_list, loading, material }) => 
    ({  _: art_list,
        material,
        isloading: loading.effects['art_list/getList'], 
        isListLoading: loading.effects['material/GetMaterialList'] })
export default connect(mapStateToProps)(ArtList)