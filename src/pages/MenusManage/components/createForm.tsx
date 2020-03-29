import React, { ReactNode } from 'react'
import { Modal } from 'antd'

export interface CreateFormProps {
    isVisible: boolean,
    onCancel: () => void,
    children: ReactNode
}

const CreateForm: React.FC<CreateFormProps> = ({
    isVisible,
    children,
    onCancel
}) => {
    return (<Modal
        destroyOnClose
        title='编辑菜单'
        visible={isVisible}
        onCancel={onCancel}
        footer={null}>
            {children}
        </Modal>)
}

export default CreateForm