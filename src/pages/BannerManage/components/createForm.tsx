import React, { ReactNode, useState, useEffect } from 'react'
import { Modal, Form, Input, Upload, Button, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { Option } = Select

export interface CreateFormProps {
    isVisible: boolean,
    children: ReactNode,
    onCancel: () => void,
    onSubmit: () => void,
    optionList: object[],
    formValue: object
}

export interface CoverUploadProps {
    isShowUpload?: boolean,
    imgUrl?: string,
    onChange?: () => void
}

const formRules = {
    text: [{ required: true, message: '描述必填' }],
    image: [{ required: true, message: '封面图必填'} ],
    url: [{ required: true, message: '跳转链接必填' }]
}

const CoverUpload: React.FC<CoverUploadProps> = ({isShowUpload = true, imgUrl = '', onChange, ...props}) => {
    const [canShowUpload, setUploadState] = useState(isShowUpload)

    useEffect(() => {
        if (imgUrl.length) {
            setUploadState(false)
        }
    }, [imgUrl])

    const uploadProps = {
        action: 'https://api.wuh.site/upload/image',
        name: 'file'
    }

    const normFile = e => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    if (canShowUpload) {
        return (<Form.Item
            {...props}
            label='封面图' 
            name='image' 
            valuePropName='fileList' 
            getValueFromEvent={normFile} >
            <Upload {...uploadProps} listType='picture-card' onChange={onChange} >
                <UploadOutlined style={{fontSize: '30px'}} />
            </Upload>
        </Form.Item>)
    }
    return (<Form.Item label='封面图' name='image' valuePropName='src'>
        <img src={imgUrl} alt="cover_img" style={{width: '140px', objectFit: 'contain'}} />
        <Button onClick={() => setUploadState(true)}>重新选择</Button>
    </Form.Item>)
}

const CreateForm: React.FC<CreateFormProps> = ({
    isVisible,
    onCancel,
    onSubmit,
    optionList,
    formValue
}) => {
    const [form] = Form.useForm()
    const { resetFields, validateFields, setFieldsValue } = form
    const [isShowUpload, setUploadState] = useState<boolean>(true)
    const [coverImg, setCoverImg] = useState<string>()

    const handleUploadChange = ({file}) => {
        try {
            const { response } = file
            if (response && response.data) {
                const { data: { urlPath } } = response
                setCoverImg(urlPath)
                setFieldsValue({image: urlPath})
            }
        } catch(err) {
            throw Error(err)
        }
    }

    useEffect(() => {
        if (Object.keys(formValue).length) {
            setUploadState(false)
            setCoverImg(formValue.image)
            setFieldsValue(formValue)
        }
        return () => handleCancel()
    }, [formValue])

    const handleSubmit = async () => {
        const data = await validateFields()
        if (data) {
            onSubmit(data)
        }
    }

    const handleCancel = () => {
        resetFields()
        setUploadState(true)
        onCancel()
    }

    return (<Modal
        destroyOnClose
        title='提示'
        footer={null}
        visible={isVisible}
        onCancel={onCancel}>
        <Form 
            form={form}
            labelCol={{span: 4}} wrapperCol={{span: 14}}>
            <Form.Item rules={formRules.text} label='描述' name='text'>
                <Input  />
            </Form.Item>
            <Form.Item rules={formRules.url} label='链接地址' name='url'>
                <Input  />
            </Form.Item>
            <Form.Item label='关联文章' name='art_id'>
                <Select>
                    {
                        Array.isArray(optionList) && (optionList.map(v => (<Option key={v.value} value={v.value}>{v.label}</Option>)))
                    }
                </Select>
            </Form.Item>
            <CoverUpload
                rules={formRules.image}
                isShowUpload={isShowUpload}
                imgUrl={coverImg}
                onChange={handleUploadChange} />
            <Form.Item>
                <Button onClick={handleCancel} type='danger' style={{marginRight: '15px'}}>取消</Button>
                <Button onClick={handleSubmit} type='primary'>提交</Button>
            </Form.Item>
        </Form>
    </Modal>)
}

export default CreateForm