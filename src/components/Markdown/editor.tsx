import React, { Fragment, ReactNode, useRef, useState, useEffect } from 'react'
import { FullscreenOutlined, FullscreenExitOutlined, ReadOutlined, UploadOutlined } from '@ant-design/icons'
import styles from './editor.less'
import Preview from './template'

export interface ToolbarProps {
    text: string,
    onClick: () => void
}

export interface MarkdownEditorProps {
    toolbar: ToolbarProps[] | ReactNode,
    value: string,
    form?: object,
    id?: string,
    onChange: (value: string) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    toolbar,
    value,
    form,
    id,
    onChange
}) => {
    const wrapRef = useRef()
    const [htmlString, setHtmlString] = useState(value)
    const [isShowPreview, setPreviewState] = useState<boolean>(false)

    const handleFullScreen = () => {
        if (wrapRef && wrapRef.current) {
            if (wrapRef.current.requestFullscreen) {
                wrapRef.current.requestFullscreen()
            } else if (wrapRef.current.mozRequestFullscreen) {
                wrapRef.current.mozRequestFullScreen()
            } else if (wrapRef.current.webkitRequestFullscreen) {
                wrapRef.current.webkitRequestFullsreen()
            } else if (wrapRef.msRequestFullscreen) {
                wrapRef.current.msRequestFullscreen()
            }
        }
    }
    const handleExitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
    const handleUpload = () => {
        
    }

    const handleTogglePreview = () => {
        setPreviewState(!isShowPreview)
    }

    const handleClick = ({ event }) => {
        switch (event) {
            case 'fullscreen': return handleFullScreen()
            case 'exitfullscreen': return handleExitFullScreen()
            case 'preview': return handleTogglePreview()
            case 'upload': return handleUpload()
            default: return {}
        }
    }

    const Toolbar = () => {
        if (Array.isArray(toolbar)) {
            return (<div className={styles.toolbar}>
                {
                    toolbar.map(item => (<span onClick={() => handleClick(item)} className={styles.toolbar__item} key={item.id}>{item.text}</span>))
                }
            </div>)
        }
        return toolbar
    }

    const handleChange = e => {
        const { target: { value } } = e
        setHtmlString(value)
        form&&form.setFieldsValue({ id: value })
        if (onChange) {
            onChange(value)
        }
    }

    useEffect(() => {
        let value = form && form.getFieldValue(id)
        if (value) {
            form.setFieldsValue({ id: value })
            setHtmlString(value)
        }
    })

    return (<Fragment>
        <div ref={wrapRef}>
            <div className={styles.header}>
                <Toolbar<null> />
            </div>
            <div className={styles.outer}>
                <textarea value={htmlString} onChange={handleChange} type="textarea" className={styles.textarea} />
                {
                    isShowPreview &&
                    (<Preview className={styles.preview} source={htmlString} />)
                }
            </div>
        </div>
    </Fragment>)
}

MarkdownEditor.defaultProps = {
    toolbar: [
        {
            id: 'fullscreen',
            text: <FullscreenOutlined />,
            onClick: () => {},
            event: 'fullscreen'
        },
        {
            id: 'exitfullscreen',
            text: <FullscreenExitOutlined />,
            onClick: () => {},
            event: 'exitfullscreen'
        },
        {
            id: 'preview',
            text: <ReadOutlined />,
            onClick: () => {},
            event: 'preview'
        }
    ],
    value: ''
}

export default MarkdownEditor