import React, { useState } from 'react'
import { connect } from 'dva'
import { Table, Button, Modal, Drawer, Form, Input } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { userForm } from '../map'
import styles from './index.less'

const FormItem=Form.Item

const formWrapper = {
    labelCol: {
        md: { span: 4 }
    },
    wrapperCol: {
        md: { span: 16}
    }
}
function User ({ _, dispatch }) {
    const { data: dataSource } = _
    const [dialogVisible, changeDialogVisble] = useState(false)
    const [docsId, setDocsId] = useState(null)
    const [form] = Form.useForm()
    const { resetFields, validateFields, setFieldsValue } = form
    const handleDelete = params => {
        const { id } = params
        Modal.confirm({
            title: '提示',
            content: '是否删除该条信息, 请确认?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                dispatch({ type: 'user_list/delete', payload: { id } })
            }
        })
    }
    const handleUpdate = params => {
        const { id, ..._form } = params
        setDocsId(id)
        changeDialogVisble(true)
        setTimeout(() => {
            setFieldsValue(_form)
        }, 500)
    }

    const handleCancel = () => {
        resetFields()
        changeDialogVisble(false)
    }

    const handleSubmit = async () => {
        const res = await validateFields()
        if (docsId) {
            dispatch({
                type: 'user_list/update',
                payload: { ...res, id: docsId }
            })
        } else {
            dispatch({
                type: 'user_list/create',
                payload: res
            })
        }
        handleCancel()
    }

    const handleCreate = () => {
        changeDialogVisble(true)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '真实姓名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'github',
            dataIndex: 'github',
            key: 'github'
        },
        {
            title: 'update_at',
            dataIndex: 'update_at',
            key: 'update_at'
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            width: 180,
            fixed: 'right',
            render: (text, record) => {
                return (<>
                    <Button onClick={() => handleUpdate(record)} type='link'>更新</Button>
                    <Button onClick={() => handleDelete(record)} type='link'>删除</Button>
                </>)
            }
        }
    ]
    const renderItem = () => {
        return (<div>
            {
                Object.keys(userForm).map((item, index) => {
                    return (<FormItem {...userForm[item].props} name={item} key={index} rules={userForm[item].rules} >
                        <Input type={userForm[item].props.type} />
                    </FormItem>)
                })
            }
        </div>)
    }
    return (<PageHeaderWrapper>
        <div className={styles.header}>
            <Button onClick={handleCreate} type='primary'>新建</Button>
        </div>
        <Table rowKey='id' scroll={{x: 1300, y: 500}} columns={columns} dataSource={dataSource} />
        {
            dialogVisible && 
            (<Drawer
                closable={false}
                title={'编辑用户'}
                width={500}
                visible={dialogVisible}
                >
                <Form
                  {...formWrapper}
                  form={form}>
                  { renderItem() }
                </Form>
                <div className={styles.footer}>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button onClick={handleSubmit} type='primary'>提交</Button>
                </div>
            </Drawer>)
        }
    </PageHeaderWrapper>)
}

// eslint-disable-next-line @typescript-eslint/camelcase
const mapStateToProps = ({ user_list }) => ({ _: user_list })

export default connect(mapStateToProps)(User)