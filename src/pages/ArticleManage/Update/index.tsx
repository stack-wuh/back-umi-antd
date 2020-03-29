import React, { useState, useEffect, ReactNode, useRef }  from 'react'
import classnames from 'classnames'
import { Form, Input, Select, Upload, Button, message } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { UploadOutlined } from '@ant-design/icons'
import { TableListItem } from '../List/data.d'
import RichEditor from '@/components/RichEditor'
import { postArticle, queryArticle } from '../List/service'

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
    data: TableListItem
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

const ArtUpdate: React.FC<{}> = ({
    className,
    history
}) => {
    const [form] = Form.useForm()
    const formRef = useRef<ReactNode>(null)
    const [isShowUpload, setUploadState] = useState<{}>(false)
    const [coverImgUrl, setCoverImg] = useState<string>('')
    const [isShowLoading, setLoading] = useState<boolean>(false)
    const { location: { query } } = history
    const { getFieldValue, validateFields, resetFields, setFieldsValue } = form

    const handleToggleUpload = (): void => {
        const coverImg = getFieldValue('cover_img')
        if (coverImg) return setUploadState(true)
        return setUploadState(false)
    }

    useEffect(() => {
        if (formRef.current) {
            handleToggleUpload()
        }
    }, [])

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
        setUploadState(true)
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
        const { file : { response }} = file
        if (response) {
            const { data: { urlPath } } = response
            if (urlPath) {
                handleToggleUpload()
                setCoverImg(urlPath)
                setFieldsValue({cover_img: urlPath})
            }
        }
    }

    const handleSubmit = async (): void => {
        const data = await validateFields()
        if (!data) return
        setLoading(true)
        const res = await postArticle({ ...data, cover_img: coverImgUrl })
        if (res.code === 20000) {
            message.success(res.msg)
            setTimeout(() => {
                handleCancel()
            }, 500);
        } else {
            message.error(res.msg)
        }
        setLoading(false)
    }

    const handleCancel = () => {
        resetFields()
        setUploadState(false)
        setCoverImg(null)
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
                    <Select>
                        {
                            ArtType.map(v => (<Option key={v.value} value={v.value} >{v.label}</Option>))
                        }
                    </Select>
                </Form.Item>
                {
                    !isShowUpload ? (
                        <Form.Item 
                            label='封面图' 
                            name='cover_img' 
                            rules={rules.cover_img} 
                            getValueFromEvent={normalFile}
                            valuePropName='fileList'>
                                <Upload {...uploadProps} onChange={ handleUploadChange } listType='picture-card' >
                                    <UploadOutlined style={{fontSize: '30px'}} />
                                </Upload>
                        </Form.Item>
                    ) : (
                        <Form.Item label='封面图' name='cover_img' rules={rules.cover_img} valuePropName='src'>
                            <img 
                                src={coverImgUrl} 
                                alt="cover_img" 
                                style={{width: '200px', objectFit: 'contain', objectPosition: 'center center'}}/>
                        </Form.Item>
                    )
                }
                <Form.Item label='内容' name='content' rules={rules.content}>
                    <RichEditor />
                </Form.Item>
                <Form.Item wrapperCol={{span: 10, offset: 4}}>
                    <Button type='danger' style={{marginRight: '15px'}}>取消</Button>
                    <Button loading={isShowLoading} onClick={handleSubmit} type='primary'>提交</Button>
                </Form.Item>
            </Form>
        </PageHeaderWrapper>
    </React.Fragment>)
}

export default ArtUpdate