import React, { ReactNode } from 'react'
import { Modal } from 'antd'

export interface CreateFormProps {
    children: ReactNode,
    visible: boolean,
    onCancel: () => void,
    onOk: () => void
}

const CreateForm: React.FC<CreateFormProps> = ({
    visible,
    onCancel,
    children
}) => {
    return (<Modal
        title='选择封面图'
        visible={visible}
        onCancel={onCancel}
        footer={null}>
        {children}
    </Modal>)
}

export default CreateForm