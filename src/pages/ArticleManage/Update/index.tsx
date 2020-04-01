import React, { useState, useEffect, ReactNode, useRef }  from 'react'
import classnames from 'classnames'
import { Form, Input, Select, Upload, Button, message } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { UploadOutlined } from '@ant-design/icons'
import { TableListItem } from '../List/data.d'
import RichEditor from '@/components/RichEditor'
import MarkdownEditor from '@/components/Markdown'
import { postArticle, queryArticle, updateArticle } from '../List/service'

const { Option } = Select

export interface ArtType {
    label: string,
    value: string | number
}

export interface FormValueType extends Partial<TableListItem> {
    title: string,
    sub_title: string,
    cover_img: string,
    content: string,
    type: string
}

export interface ArtUpdateProps extends Partial<FormValueType> {
    className?: string,
    data: TableListItem,
    history: object
}

const formWrapper = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
}

const ArtType: ArtType[] = [
    {
        label: 'richtext',
        value: 1
    },
    {
        label: 'markdown',
        value: 2
    }
]

const rules = {
    title: [{ required: true, message: '标题必填' }],
    sub_title: [{ required: true, message: '描述必填' }],
    type: [{ required: true, message: '文章类型必填' }],
    content: [{ required: true, message: '文章内容必填' }],
    cover_img: [{ required: true, message: '必须上传封面图' }]
}

const uploadProps = {
    name: 'file',
    action: 'https://api.wuh.site/upload/image'
}

const ArtUpdate: React.FC<ArtUpdateProps> = ({
    className,
    history
}) => {
    const [form] = Form.useForm()
    const formRef = useRef<ReactNode>(null)
    const [uploadFileList, setUploadFileList] = useState([])
    const [isShowLoading, setLoading] = useState<boolean>(false)
    const [editorType, setEditorType] = useState(1)
    const { location: { query } } = history
    const { validateFields, resetFields, setFieldsValue, getFieldValue } = form

    const fetch = async () => {
        if (!query.id) return
        const response = await queryArticle({_id: query.id})
        const { data: [info] } = response
        const formValue = {
            title: info.title,
            sub_title: info.sub_title,
            type: info.type,
            content: info.content,
            cover_img: info.cover_img
        }
        const itemValue = {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: info.cover_img
        }
        setUploadFileList([itemValue])
        setEditorType(info.type)
        setTimeout(() => {
            setFieldsValue(formValue)
        }, 200)
    }
    useEffect(() => {
        fetch()
        return () => {
            handleCancel()
        }
    }, [query])

    const handleUploadChange = (file: any): void => {
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

    const handleUploadRemove = (file: object) => {
        const tempList = uploadFileList.filter(v => v?.uid!==file?.uid)
        setUploadFileList(tempList)
    }

    const handleSubmit = async (): void => {
        const data = await validateFields()
        if (!data) return
        setLoading(true)
        const coverImgUrl = uploadFileList[uploadFileList.length-1].thumbUrl
        const res = !query.id ? await postArticle({ ...data, cover_img: coverImgUrl })
                                : await updateArticle({ ...data, cover_img: coverImgUrl, id: query.id })
        if (res.code === 20000) {
            message.success(res.msg)
            setTimeout(() => {
                handleCancel()
                setUploadFileList([])
            }, 500);
        } else {
            message.error(res.msg)
        }
        setLoading(false)
    }

    const handleCancel = () => {
        resetFields()
    }

    const handleTypeChange = (e) => {
        setEditorType(e)
    }

    const normalFile = (e: any) => {
        if (Array.isArray(e)) {
            return 
        }
        return e && e.fileList
    }

    return (<React.Fragment>
        <PageHeaderWrapper className={classnames(className)}>
            <Form {...formWrapper} form={form} ref={formRef} >
                <Form.Item label='标题' name='title' rules={rules.title}>
                    <Input placeholder='请编辑标题' />
                </Form.Item>
                <Form.Item label='描述' name='sub_title' rules={rules.sub_title}>
                    <Input placeholder='请编辑描述' />
                </Form.Item>
                <Form.Item  label='文章类型' name='type' rules={rules.type}>
                    <Select onChange={handleTypeChange}>
                        {
                            ArtType.map(v => (<Option key={v.value} value={v.value} >{v.label}</Option>))
                        }
                    </Select>
                </Form.Item>
                <Form.Item 
                    label='封面图' 
                    name='cover_img' 
                    rules={rules.cover_img} 
                    getValueFromEvent={normalFile}
                    valuePropName='file'>
                        <Upload 
                            {...uploadProps} 
                            fileList={uploadFileList}  
                            onChange={ handleUploadChange }
                            onRemove={ handleUploadRemove }  
                            listType='picture-card' >
                                <UploadOutlined style={{fontSize: '30px'}} />
                        </Upload>
                </Form.Item>
                {/* <Form.Item label='内容' name='content' rules={rules.content}>
                    <RichEditor />
                </Form.Item>
                <Form.Item label='内容'>
                    <MarkdownEditor />
                </Form.Item> */}
                {
                    editorType === 1 ? 
                        (<Form.Item label='内容' name='content' rules={rules.content}>
                            <RichEditor />
                        </Form.Item>) :
                        (<Form.Item label='内容' name='content' rules={rules.content} valuePropName='source'>
                            <MarkdownEditor form={form} />
                        </Form.Item>)
                }
                <Form.Item wrapperCol={{span: 10, offset: 4}}>
                    <Button type='danger' style={{marginRight: '15px'}}>取消</Button>
                    <Button loading={isShowLoading} onClick={handleSubmit} type='primary'>提交</Button>
                </Form.Item>
            </Form>
        </PageHeaderWrapper>
    </React.Fragment>)
}

export default ArtUpdate