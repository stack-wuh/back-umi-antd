import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Button, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { articleList } from '@/services/article'

const FormItem = Form.Item
const formWrapper = {
    labelCol: {
        span: 7
    },
    wrapperCol: {
        span: 13
    }
}
const Rules = {
    text: [{ required: true, message: '编辑标题'}],
    url: [{ required: true, message: '编辑跳转地址'}, { type: 'url', message: 'url不合法' }],
    image: [{ required: true, message: '上传封面图'}, { type: 'url', message: '图片路径不合法', transform: ({file}) => {
        try {
            if (file.response && file.response.code === 20000) {
                return file.response.data.urlPath
            }
        } catch(err) {
            throw new Error(err)
        }
    }}],
    article: [{ required: true, message: '选择文章'}]
}

const CustomForm = props => {
    const {form, handleSubmit, handleCancel, initialValues} = props
    const { setFieldsValue, resetFields } = form
    const [selectValue, setselectValue] = useState(null)

    useEffect(() => {
        if (Object.keys(initialValues).length) {
            setFieldsValue(initialValues)
        }
    }, [initialValues])

    const uploadProps = {
        name: 'file',
        action: 'https://api.wuh.site/upload/image'
    }

    let timer
    let currentValue
    const fetch = (value, cb) => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        currentValue = value
        
        const fake = () => {
            articleList({title: currentValue})
                .then(res => {
                    const _data = res.data.map(v => ({text: v.title + v.sub_title, value: v._id}))
                    setselectValue(_data)
                })
        }
        timer = setTimeout(fake(), 300)
    }

    const handleSearch = value => {
        fetch(value, data => setselectValue(data))
    }
    const options = selectValue && selectValue.map(v => (<Select.Option key={v.value} >{v.text}</Select.Option>))
    return (<Form form={form} {...formWrapper}>
        <FormItem name='text' label='标题' rules={Rules.text}>
            <Input placeholder='请编辑标题' />
        </FormItem>
        <FormItem name='url' label='跳转地址' rules={Rules.url}>
            <Input placeholder='请编辑跳转地址' />
        </FormItem>
        <FormItem name='art_id' label='关联文章' rules={Rules.article}>
            <Select
               showSearch
               showArrow={true}
               filterOption={false}
               onSearch={handleSearch} >
               {options}
            </Select>
        </FormItem>
        <FormItem name='image' label='封面图' rules={Rules.image} >
            <Upload {...uploadProps} listType='picture-card' valuePropName='fileList'>
                <UploadOutlined style={{fontSize: '30px'}} />
            </Upload>
        </FormItem>
        <FormItem style={{textAlign: 'center'}}>
            <Button style={{marginRight: '15px'}} onClick={() => handleCancel()}>取消</Button>
            <Button onClick={() => handleSubmit()} type='primary'>提交</Button>
        </FormItem>
    </Form>)
}

export default CustomForm