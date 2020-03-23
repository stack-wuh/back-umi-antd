import React from 'react'
import { Modal } from 'antd'

const CreateForm = props => {
    const { isDialogVisible, onCancel } = props
    return <Modal
        title='新建Banner'
        visible={isDialogVisible}
        footer={null}
        onCancel={() => onCancel()}>
        {props.children}
    </Modal>
}

export default CreateForm