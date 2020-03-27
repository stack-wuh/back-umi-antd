import React from 'react'
import { Modal } from 'antd'

const SendToWx = ({ isVisible, children, onCancel, onOk }) => {
    return (<Modal
        footer={null}
        title='选择封面图'
        visible={isVisible}
        onCancel={() => onCancel()}
        onOk={() => onOk()}>
        {children}
    </Modal>)
}

SendToWx.defaultProps = {
    isVisible: false,
    onCancel: () => {},
    onOK: () => {}
}
export default SendToWx