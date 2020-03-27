import React, { useState, useEffect, useRef } from 'react'
import ReactQuill, { Toolbar } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.core.css'
import propTypes from 'prop-types'
import styles from './index.less'
import Uploader from './components/upload'

class RichEditor extends React.PureComponent {

    state = {
        isShowDialog: false,
        imgUrl: null,
        position: 0
    }
    modules = {
            toolbar: {
                container: [
                    [{header: [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction
                    ['link', 'image', 'code-block'],
                    [{size: []}, {color: []}, {background: []}, {align: []}]
                ],
                handlers: {
                    'image': () => {
                        const Position = this.quillRef.getEditorSelection()
                        this.setState({ isShowDialog: true, position: Position })
                    }
                }
            }
        }
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'code-block',
        'link', 'image',
        'color', 'size', 'background', 'align',
        'script', 'indent', 'direction'
    ]
    quillRef = null

    handleUploadClose = () => {
        this.setState({isShowDialog: false})
    }

    handleUploadChange = ({file}) => {
        if (file.response) {
            this.setState({ imgUrl: file.response.data.urlPath })
        }
    }

    handleInsert = () => {
        const { imgUrl, position } = this.state
        let quill = this.quillRef.getEditor()
        quill.insertEmbed(position, 'image', imgUrl)
        quill.getSelection(position+1)
        this.setState({ isShowDialog: false })
    }

    render () {
        const { isShowDialog } = this.state
        const { value, onChange } = this.props
        return (<div className={styles.richtext}>
            <ReactQuill
                ref={el => this.quillRef = el}
                modules={this.modules}
                formats={this.formats}
                value={value}
                onChange={onChange}>
            </ReactQuill>
            <Uploader 
                isVisible={isShowDialog}
                onClose={this.handleUploadClose}
                onChange={this.handleUploadChange}
                onOk={() => this.handleInsert()} />
        </div>)
    }
}

RichEditor.propTypes = {
    value: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired
}

RichEditor.defaultProps = {
    value: '',
    onChange: () => {}
}

export default RichEditor