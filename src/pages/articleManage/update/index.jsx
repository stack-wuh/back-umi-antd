import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, Select } from 'antd'
import { artUpdateForms } from '../map'
import RichEditor from '@/components/richeditor'
import Markdown from '@/components/Markdown'
import { connect } from 'dva'
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

function ArtUpdate ({dispatch, location, _}) {
    const { query: { id }} = location
    const [form] = Form.useForm()
    const { resetFields, setFieldsValue, getFieldsValue } = form
    const [context, setContext] = useState('')
    const timerRef = useRef()
    timerRef.current = () => setTimeout(() => {
        const { info: data } = _
        const _form = data.shift()
        const fields = artUpdateForms.map((item, _) => ({field: item.props.name}))
                                        .reduce((acc, curr) => {
                                            acc[curr.field] = (_form&&_form[curr.field]) || undefined
                                            return acc
                                        }, {})
        setFieldsValue(fields)
    }, 100);

    useEffect(() => {
        try {
            if (id) {
                dispatch({ type: 'art_list/detailBy', payload: { id }})
            }
        } catch (err) {
            throw(err)
        }
        return () => {
            clearTimeout(timerRef)
            dispatch({ type: 'art_list/clearInfo'})
        }
    }, [])

    useEffect(() => {
        timerRef.current()
    }, [_.info])

    const handleSubmit = async () => {
        const valid = await form.validateFields()
        if (valid) {
           const _type = id ? 'art_list/updateBy' : 'art_list/createBy'
           const _payload = { ...valid, id }
           if (!id) delete _payload.id
           dispatch({type: _type, payload: _payload})
           setTimeout(() => {
               resetFields()
           }, 500)
        }
    }

    const handleEditorChange = val => {
        const { getFieldValue } = form
        const context = getFieldValue('content')
        setContext(context)
    }

    const handleTypeChange = (val) => {
        let { context: _context } = _.info
    }

    /**
     * 按条件渲染编辑器
     * @params type 1: 富文本编辑器, 2: markdown编辑器
     */
    const renderEditorType = () => {
        const _form = getFieldsValue()
        const { type } = _form
        const isMarkdown = type === 2
        return (isMarkdown ? 
                        <Markdown value={context} onChange={handleEditorChange} /> :
                        <RichEditor value={context} onChange={handleEditorChange} />)
    }

    const renderItem = () => {
        return artUpdateForms.map((item, index) => {
            return (<FormItem key={index} label={item.label} {...item.props} {...item.wrapper} rules={item.rules}>
                {
                    item.type === 'normal' ? (<Input />) : 
                    item.type === 'select' ? (<Select >
                        <Option value={1} >richtext</Option>
                        <Option value={2} >markdown</Option>
                    </Select>) : renderEditorType()
                }
            </FormItem>)
        })
    }

    return (<PageHeaderWrapper>
        <Form
          {...formWrapper}
          form={form}>
            {
                renderItem()
            }
            <FormItem {...buttonItemWrapper}>
                <Button type='primary' block onClick={handleSubmit}>提交</Button>
            </FormItem>
        </Form>
    </PageHeaderWrapper>)
}

const mapStateToProps = ({ art_list, loading }) => ({ _: art_list })
export default connect(mapStateToProps)(ArtUpdate)
