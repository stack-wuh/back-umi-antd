import React from 'react'
import { Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

export interface UploaderProps {
    isShowDialog: boolean,
    onClose: () => void,
    onChange: () => {},
    onOk: () => void
}

const Uploader: React.FC<UploaderProps> = ({
    isShowDialog,
    onClose,
    onChange,
    onOk
}) => {
    const uploadProps = {
        name: 'file',
        action: 'https://api.wuh.site/upload/image',
        onChange: (e: any) => onChange(e)
    }

    return (<Modal
        okText='插入文本'
        visible={isShowDialog}
        title='上传图片'
        onCancel={() => onClose()}
        onOk={() => onOk()}
        >
            <Upload
                defaultFileList={[]}
                {...uploadProps}
                listType='picture-card'>
                    <UploadOutlined style={{fontSize: '30px'}} />
            </Upload>
        </Modal>)
}

export default Uploader