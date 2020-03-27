import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { UploadOutlined } from '@ant-design/icons'
import { Form, Input, Button, Select, Upload } from 'antd'
import { artUpdateForms } from '../map'
import RichEditor from '@/components/richeditor'
import Markdown from '@/components/Markdown'
import { connect } from 'dva'
import { articleDetail } from '@/services/article'
const FormItem = Form.Item
const Option = Select.Option

const formWrapper = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18}
    }
}

const buttonItemWrapper = {
    labelCol : {
        md: { span:4 }
    },
    wrapperCol: {
        md: { span: 6, offset: 9 }
    }
}

function ArtUpdate ({ _, location, dispatch }) {
    const { query: { id } } = location
    const uploadRef = useRef(null)
    const [info, setInfoValue] = useState([])
    const [ isShowUpload, setShowUpload ] = useState(true)
    const [form] = Form.useForm()
    const { resetFields, setFieldsValue, getFieldValue } = form
    const [_form, setContext] = useState({ type: 1, content: '' })
    const initialValues = { type: 1 }

    const uploadProps = {
        action: 'https://api.wuh.site/upload/image',
        name: 'file',
        onChange: ({file, fileList}) => {
            if(file && file.response) {
                const { urlPath } = file.response.data
                setFieldsValue({ cover_img: urlPath })
            }
        }
    }

    useEffect(() => {
        if (!id) return
        async function fetch () {
            const res = await articleDetail({id})
            if (res) {
                const { info: _info } = res
                const { title, type, content, sub_title, cover_img } = _info[0]
                setInfoValue(_info)
                setFieldsValue({ title, type, content, sub_title, cover_img })
                setContext({ type })
                cover_img && setShowUpload(false)
            }
        }
        fetch()
        return () => {
            setInfoValue([])
        }
    }, [id])

    const handleEditorChange = val => {
        const data = JSON.parse(JSON.stringify(info[0]))
        setContext({ type: val, content: data.content })
    }

    /**
     * 按条件渲染编辑器
     * @params type 1: 富文本编辑器, 2: markdown编辑器
     */
    const renderEditorType = () => {
        if (_form.type === 1) {
            return  <RichEditor value={_form.content} />
        // eslint-disable-next-line no-else-return
        } else if (_form.type === 2) {
            return <Markdown value={_form.content} />
        }
    }

    const renderItem = () => {
        return artUpdateForms.map((item, index) => {
            return (<FormItem key={index} label={item.label} {...item.props} {...item.wrapper} rules={item.rules}>
                {
                    item.type === 'normal' ? (<Input />) : 
                    item.type === 'select' ? (<Select onChange={handleEditorChange} >
                        <Option value={1} >richtext</Option>
                        <Option value={2} >markdown</Option>
                    </Select>) : renderEditorType()
                }
            </FormItem>)
        })
    }

    const handleSubmit = async () => {
        const valid = await form.validateFields()
        if (valid) {
           const _type = id ? 'art_list/updateBy' : 'art_list/createBy'
           const _payload = { ...valid, id }
           if (!id) delete _payload.id
           dispatch({type: _type, payload: _payload})
           setTimeout(() => {
               setContext(initialValues)
               resetFields()
           }, 500)
        }
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    return (<PageHeaderWrapper>
        <Form
            initialValues={initialValues}
            {...formWrapper}
            form={form}>
            <FormItem name='cover_img' label='封面图' rules={[{ required: false }]} >
                {
                    (getFieldValue('cover_img') && !isShowUpload) ? <div>
                        <img src={getFieldValue('cover_img')} alt='cover_img' style={{width: 'auto', maxWidth: '100%'}} />
                        <Button onClick={() => setShowUpload(true)}>更换封面图</Button>
                    </div>: 
                    ( <Upload ref={uploadRef} {...uploadProps} listType='picture-card' valuePropName='fileList'>
                        <UploadOutlined style={{fontSize: '30px'}} />
                    </Upload>)
                }
               
            </FormItem>
            { renderItem() }
             <FormItem {...buttonItemWrapper}>
                 <Button type='primary' block onClick={handleSubmit}>提交</Button>
             </FormItem>
        </Form>
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ art_list, loading }) => ({ _: art_list })
export default connect(mapStateToProps)(ArtUpdate)
