import React, { useRef, useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Modal, message, List, Avatar, Button } from 'antd'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { TableListItem } from './data.d'
import TableOptionBtns, { BtnOptionProps } from '@/components/TableOptionBtns'
import { queryArticle, deleteArticle } from './service'
import { postMaterial, queryMaterial } from '../../WechatManage/Material/service'
import CreateForm from "./components/createForm";

const ArticleList: React.FC<{}> = ({ history }) => {
    const actionRef = useRef(null)
    const [isShowDialog, setDialogState] = useState<boolean>(false)
    const [listDataSource, setListDataSource] = useState([])
    const [itemInfo, setItemInfo] = useState<object>({})

    useEffect(() => {
        fetchOptionList()
    }, [])

    const fetchOptionList = async () => {
        const response = await queryMaterial({ type: 'image',count: 20, offset: 0 } )
        setListDataSource(response.data.item)
    }

    const handleSendToWx = async params => {
        const formModal =  {
            "articles": [
                {
                    "title": itemInfo?.title,
                    "thumb_media_id": params.media_id,
                    "author": 'shadow',
                    "digest": itemInfo?.sub_title,
                    "show_cover_pic": 1,
                    "content": itemInfo?.content,
                    "content_source_url": 'https://wuh.site/blog/detail/'+itemInfo.id
                },
                //若新增的是多图文素材，则此处应还有几段articles结构
            ]
        }
        const response = await postMaterial(formModal)
        if (response.code === 20000) {
            message.success('推送至微信成功')
            setDialogState(false)
        } else {
            message.error(response.msg)
        }
    }


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
            onClick: (data) => {
                setItemInfo(data)
                setDialogState(true)
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

        {
            isShowDialog && (<CreateForm 
                visible={isShowDialog}
                onCancel={() => setDialogState(false)} >
                    <List 
                        itemLayout='horizontal'
                        dataSource={listDataSource}
                        renderItem={item => (<List.Item>
                            <List.Item.Meta 
                                avatar={<Avatar src={item.url} />}
                                title={ <Button type='link'>{item.name}</Button> }
                                description={<span>{item.media_id}</span>} />
                                <Button onClick={() => handleSendToWx(item)} type='link'>提交</Button>
                        </List.Item>)} />
                </CreateForm>)
        }
    </PageHeaderWrapper>)
}

export default ArticleList