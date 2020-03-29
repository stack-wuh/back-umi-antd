import React, { useRef, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { TableColumnProps } from './data.d'
import TableOptionBtns from '@/components/TableOptionBtns'
import { queryMenus, deleteMenus, postMenus, updateMenus } from './service'
import CreateForm from './components/createForm'

const MenusList = () => {
    const actionRef = useRef(null)
    const proFormRef = useRef(null)
    const [form, setFormValue] = useState<TableColumnProps>({})
    const [isShowDialog, setDialogState] = useState<boolean>(false)

    const btnList = [
        {
            text: '更新',
            onClick: (data: object) => {
                setDialogState(true)
                setFormValue(data)
                setTimeout(() => {
                    proFormRef.current.setFieldsValue(data)
                }, 200)
            }
        },
        {
            text: '删除',
            onClick: ({_id}) => {
                Modal.confirm({
                    title: '提示',
                    content: '是否要删除此条内容, 请确认?',
                    onOk: async () => {
                        const response = await deleteMenus({id: _id})
                        if (response.code === 20004) {
                            message.success(response.msg)
                            actionRef.current.reload()
                        } else {
                            message.error(response.msg)
                        }
                    },
                })
            }
        }
    ]

    const columns: ProColumns<TableColumnProps>[] = [
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
            hideInForm: true
        },
        {
            title: 'label',
            dataIndex: 'label',
            width: 140,
            rules: [
                {required: true, message: '标签名必填'}
            ]
        },
        {
            title: 'icon',
            dataIndex: 'icon',
            width: 140,
            rules: [{ required: true, message: '图标必填' }]
        },
        {
            title: 'path',
            dataIndex: 'path',
            width: 140,
            rules: [{ required: true, message: '路径必填' }]
        },
        {
            title: '操作',
            dataIndex: 'option',
            width: 200,
            hideInSearch: true,
            hideInForm: true,
            fixed: 'right',
            render: (text, record) => {
                return (<TableOptionBtns payload={record} list={btnList} />)
            }
        }
    ]

    const handleSubmit = async (props: TableColumnProps) => {
        let response
        // eslint-disable-next-line dot-notation
        if (form['id']) {
            // eslint-disable-next-line dot-notation
            response = await updateMenus({...props, id: form['id']})
        } else {
            response = await postMenus(props)
        }
        if (response.code === 20001) {
            setDialogState(false)
            message.success(response.msg)
            if (actionRef.current) {
                actionRef.current.reload()
            }
        } else {
            message.error(response.msg)
        }
    }

    return (<PageHeaderWrapper>
        <ProTable<TableColumnProps>
            actionRef={actionRef}
            columns={columns}
            rowKey='_id'
            request={() => queryMenus()}
            headerTitle='菜单列表'
            toolBarRender={() => [
                <Button onClick={() => setDialogState(true)} type='primary'>新建</Button>
            ]}/>

        {
            isShowDialog && (<CreateForm isVisible={isShowDialog} onCancel={() => setDialogState(false)}>
                <ProTable<TableColumnProps>
                    formRef={proFormRef}
                    onSubmit={handleSubmit} 
                    type='form' 
                    columns={columns} />
            </CreateForm>)
        }
    </PageHeaderWrapper>)
}

export default MenusList