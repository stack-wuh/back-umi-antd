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
    url: [{ required: true, message: '跳转链接必填' }],
    artId: [{ required: true, messge: '必须关联文章' }]
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
    const [uploadFileList, setUploadFileList] = useState<object[]>([])

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

    const handleUploadChange = (file: object) => {
        const { fileList } = file
        const temp = fileList.map((fileItem: any) => {
            if (fileItem.response) {
                return {
                    ...fileItem,
                    thumbUrl: fileItem.response.data.urlPath
                }
            }
            return fileItem
        })
        setUploadFileList(temp)
    }

    const handleUploadRemove = (file: object): void => {
        const tempList = FileList.filter(v => v.uid === file.uid)
        setUploadFileList(tempList)
    }

    useEffect(() => {
        if (Object.keys(formValue).length) {
            const valueItem = {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: formValue?.image
            }
            setUploadFileList([valueItem])
            setTimeout(() => {
                setFieldsValue(formValue)
            }, 200)
        }
        return () => handleCancel()
    }, [formValue])

    const handleSubmit = async () => {
        const imageUrl = uploadFileList[uploadFileList.length-1].thumbUrl
        const data = await validateFields()
        if (data) {
            onSubmit({ ...data, image: imageUrl })
        }
    }

    const handleCancel = () => {
        resetFields()
        onCancel()
        setUploadFileList([])
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
            <Form.Item label='关联文章' name='art_id' rules={formRules.artId}>
                <Select>
                    {
                        Array.isArray(optionList) && (optionList.map(v => (<Option key={v.value} value={v.value}>{v.label}</Option>)))
                    }
                </Select>
            </Form.Item>

            <Form.Item label='封面图' name='image' rules={formRules.image} valuePropName='file' getValueFromEvent={normFile}>
                <Upload
                    onChange={ handleUploadChange }
                    onRemove={ handleUploadRemove }
                    fileList={uploadFileList} 
                    {...uploadProps} 
                    listType='picture-card'>
                    <UploadOutlined style={{fontSize: '30px'}} />
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button onClick={handleCancel} type='danger' style={{marginRight: '15px'}}>取消</Button>
                <Button onClick={handleSubmit} type='primary'>提交</Button>
            </Form.Item>
        </Form>
    </Modal>)
}

export default CreateForm