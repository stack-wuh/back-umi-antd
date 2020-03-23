import React, { useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { connect } from 'dva'
import { bannerGetBy, bannerCreateBy, bannerUpdateBy } from '@/services/banner'
import { Button, Form, message } from 'antd'
import CreateForm from './components/createForm'
import CustomForm from './components/form'

const Banner = ({banner, dispatch}) => {
    const { data: dataSource } = banner
    const [isDialogVisible, setisDialogVisible] = useState(false)
    const [initialValues, setInitialValues] = useState({})
    const [form] = Form.useForm()
    const { validateFields, resetFields } = form
    const handleDelBy = ({_id}) => {
        dispatch({
            type: 'banner/delete',
            payload: {
                _id
            }
        })
        dispatch({
            type: 'banner/fetch'
        })
    }

    const handleSubmit = async params => {
        const valid = await validateFields()
        if (valid) {
            const image = valid.image.file.response.data.urlPath
            const payload = {
                ...valid,
                image
            }
            const response = await bannerCreateBy(payload)
            dispatch({type: 'banner/fetch'})
            if (response.code === 20001) {
                message.success(response.msg)
                setTimeout(() => {
                    setisDialogVisible(false)
                }, 300)
            } else {
                message.error(response.msg)
            }
        }
    }

    const handleUpdateBy = async params => {
        setInitialValues(params)
        setisDialogVisible(true)
    }

    const handleCancel = params => {
        resetFields()
        setInitialValues({})
        setTimeout(() => {
            setisDialogVisible(false)
        }, 300)
    }

    const columns = [
        {
           title: '标题',
           dataIndex: 'text' 
        },
        {
            title: '图片',
            dataIndex: 'image',
            hideInSearch: true,
            valueType: 'image'
        },
        {
            title: '跳转地址',
            dataIndex: 'url'
        },
        {
            title: '更新时间',
            dataIndex: 'update_at',
            valueType: 'dateTime'
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            width: 160,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button onClick={() => handleDelBy(record)} type='link'>删除</Button>
                    <Button onClick={() => handleUpdateBy(record)} type='link'>更新</Button>
                </div>)
            }
        }
    ]

    return (<PageHeaderWrapper>
        <ProTable
            scroll={{
                x: columns.length * 120,
            }}
            dataSource={dataSource}
            headerTitle='Banner列表'
            rowKey='_id'
            columns={columns}
            search={false}
            toolBarRender={()=> [
                <Button onClick={() => setisDialogVisible(true)} type='primary' size='small'>新建</Button>
            ]}>
        </ProTable>
        <CreateForm isDialogVisible={isDialogVisible} onCancel={() => setisDialogVisible(false)}>
            <CustomForm initialValues={initialValues} form={form} handleSubmit={() => handleSubmit()} handleCancel={() => handleCancel()} />
        </CreateForm>
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ banner }) => ({ banner })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(Banner)