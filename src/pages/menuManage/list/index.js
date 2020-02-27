import React, {useState} from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Table, Button, Modal, Drawer, Form, Input } from 'antd'
import { connect } from 'dva'
import styles from './index.less'

const FormItem = Form.Item
const formWrapper = {
    labelCol: {
        md: { span: 4 }
    },
    wrapperCol: {
        md: { span: 16 }
    }
}

const rules = {
    label: [{ required: true, messgae: '请编辑标题' }],
    icon: [{ required: true, message: '请编辑图标' }],
    path: [{ required: true, message: '请编辑路由地址' }]
}

function SlideMenu ({_, dispatch}) {
    const [dialogVisible, changeDialogVisible] = useState(false)
    const [docsId, setDocsIdValue] = useState(null)
    const [form] = Form.useForm()
    const { data: dataSource } = _
    const { getFieldsValue, resetFields, setFieldsValue, validateFields } = form
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'label',
            dataIndex: 'label',
            key: 'label'
        },
        {
            title: 'path',
            dataIndex: 'path',
            key: 'path'
        },
        // {
        //     title: 'icon',
        //     dataIndex: 'icon',
        //     key: 'icon'
        // }
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            render: (text, record) => {
                return (<>
                    <Button onClick={() => handleUpdate(record)} type='link'>更新</Button>
                    <Button onClick={() => handleDelete(record)} type='link'>删除</Button>
                </>)
            }
        }
    ]
    
    const handleDelete = params => {
        const { id } = params
        Modal.confirm({
            title: '提示',
            content: '是否删除此条内容, 请确认?',
            okText: '确认',
            canceltext: '取消',
            onOk: () => {
                dispatch({ type: 'slide/delete', payload: { id } })
            }
        })
    }

    const handleUpdate = params => {
        const { label, icon, path, id } = params
        const _form = {
            label,
            icon,
            path: path.substr(1)
        }
        changeDialogVisible(true)
        setTimeout(() => {
            setFieldsValue(_form)
            setDocsIdValue(id)
        }, 500)
    }

    const handleSubmit = async params => {
        const valid = await validateFields()
        if (valid) {
            if (docsId) {
                dispatch({
                    type: 'slide/update',
                    payload: { ...valid, id: docsId }
                })
            } else {
                dispatch({
                    type: 'slide/create',
                    payload: valid
                })
            }
            
            setTimeout(()=> {
                handleCancel()
            }, 800)
        }
    }

    const handleCreate = () => {
        changeDialogVisible(true)
    }

    const handleCancel = () => {
        changeDialogVisible(false)
        resetFields()
    }

    return (<PageHeaderWrapper>
        <div className={styles.table__header}>
            <div></div>
            <Button type='primary' onClick={handleCreate}>新建</Button>
        </div>
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={dataSource}>
        </Table>

        {
            dialogVisible &&
            (<Drawer
              className={styles.drawer}
              visible={dialogVisible}
              closable={false}  
              width={520}
              title={'编辑菜单'}
              >
                  <Form form={form} {...formWrapper}>
                    <FormItem name='label' label='标题' rules={rules.label}>
                        <Input placeholder='标题'></Input>
                    </FormItem>
                    <FormItem name='path' label='路由地址' rules={rules.path}>
                        <Input
                            prefix={<span>/</span>}
                            placeholder='路由'></Input>
                    </FormItem>
                    <FormItem name='icon' label="前置图标" rules={rules.icon}>
                        <Input placeholder="图标"></Input>
                    </FormItem>
                  </Form>
                  <div
                    className={styles.drawer__footer}>
                        <Button onClick={handleCancel}>取消</Button>
                        <Button onClick={handleSubmit} type='primary'>提交</Button>
                  </div>
            </Drawer>)
        }
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ slide }) => ({ _: slide })

export default connect(mapStateToProps)(SlideMenu)