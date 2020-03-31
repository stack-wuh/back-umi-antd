import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table'
import { Button, Modal, message } from 'antd'
import TableOptionBtn, { BtnOptionProps } from '@/components/TableOptionBtns'
import { queryBanner, delBanner, postBanner } from './service'
import { queryArticle } from '../ArticleManage/List/service'
import CreateForm from './components/createForm'
import { TableItemProps, SelectOptionProps } from './data.d'

const BannerList: React.FC<{}> = () => {
    const actionRef = useRef<ActionType>()
    const [isShowDialog, setDialogState] = useState<boolean>(false)
    const [entries, setEnteries] = useState<Object>({})
    const [optionEnum, setOptionEnum] = useState<SelectOptionProps>([])
    const [formValue, setFormValue] = useState({})


    const fetchOptionList = async (): Promise => {
        const response = await queryArticle()
        const { data } = response
        const temp = {}
        let list = []
        if (Array.isArray(data)) {
            list = data.map(v => ({ label: v.title, value: v._id  }))
            // eslint-disable-next-line no-return-assign
            list.forEach(v => (temp[v.value] = v.label))
            setEnteries(temp)
            setOptionEnum(list)
        }
    }
    
    const optionBtn: BtnOptionProps[] = [
        {
            text: '更新',
            onClick: (data: object): void => {
                fetchOptionList()
                setFormValue(data)
                setDialogState(true)
            }
        },
        {
            text: '删除',
            onClick: ({_id}) => {
                Modal.confirm({
                    title: '提示',
                    content: '该操作即将删除该条内容, 请确认?',
                    onOk: async () => {
                        const response = await delBanner({_id})
                        if (response.code === 20002) {
                            message.success(response.msg)
                            actionRef.current.reload()
                        } else {
                            message.error(response.msg)
                        }
                    }
                })
            }
        }
    ]

    const columns: ProColumns<TableItemProps>[] = [
        {
            title: '序号',
            valueType: 'index',
            width: 90,
            fixed: 'left'
        },
        {
            title: '_id',
            dataIndex: '_id',
            width: 160,
            hideInForm: true
        },
        {
            title: 'text',
            dataIndex: 'text',
            width: 160,
            rules: [{required: true, message: 'text必填'}]
        },
        {
            title: '关联文章',
            dataIndex: 'art_id',
            width: 160,
            copyable: true,
            ellipsis: true,
            hideInForm: true,
            hideInSearch: true
        },
        {
            title: '关联文章',
            dataIndex: 'art_id',
            hideInTable: true,
            rules: [{required: true, message: '必选关联文章'}],
            valueEnum: {
                ...entries
            }
        },
        {
            title: '封面图',
            dataIndex: 'image',
            width: 160,
            ellipsis: true,
            copyable: true,
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: 'url',
            dataIndex: 'url',
            width: 160,
            copyable: true,
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: 'update_at',
            dataIndex: 'update_at',
            width: 180,
            valueType: 'dateTime',
            hideInForm: true
        },
        {
            title: '操作',
            dataIndex: 'option',
            width: 200,
            hideInSearch: true,
            hideInForm: true,
            render: (text, record) => (<TableOptionBtn payload={record} list={optionBtn} />)
        }
    ]

    const hanldeSubmit = async (values: object) => {
       const response = await postBanner(values)
       if (response.code === 20001 || response.code === 20002) {
           message.success(response.msg)
           setDialogState(false)
           actionRef.current.reload()
       } else {
           message.error(response.msg)
       }
    }

    return (<PageHeaderWrapper>
        <ProTable<TableItemProps>
            actionRef={actionRef}
            scroll={{ x: columns.length*140 }}
            columns={columns}
            rowKey='_id'
            request={() => queryBanner()}
            headerTitle='Banner列表'
            toolBarRender={() => [
                <Button type='primary' onClick={() => { setDialogState(true); fetchOptionList(); }} >新建</Button>
            ]} />
        {
            isShowDialog && (<CreateForm
                    formValue={formValue}
                    optionList={optionEnum}
                    isVisible={isShowDialog} 
                    onCancel={() => setDialogState(false)}
                    onSubmit={hanldeSubmit} />)
        }
    </PageHeaderWrapper>)
}

export default BannerList