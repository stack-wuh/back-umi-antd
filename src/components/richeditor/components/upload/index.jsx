import React from 'react'
import { Modal, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const CustomUpload = ({ isVisible, onClose, onChange, onOk }) => {
    const uploadProps = {
        name: 'file',
        action: 'https://api.wuh.site/upload/image',
        onChange: (e) => onChange(e)
    }

    return (<Modal
        okText='插入文本'
        visible={isVisible}
        title='上传图片'
        onCancel={() => onClose()}
        onOk={() => onOk()}
        >
        <Upload defaultFileList={[]} {...uploadProps} listType='picture-card'>
            <UploadOutlined style={{fontSize: '30px'}} />
        </Upload>
    </Modal>)
}

CustomUpload.defaultProps={
    isVisible: false,
    onClose: () => {},
    onOk: () => {}
}

export default CustomUpload