import moment from 'moment'
export const artTableColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: 'sub-title',
        dataIndex: 'sub_title',
        key: 'sub_title'
    },
    // {
    //     title: 'Author',
    //     dataIndex: 'author',
    //     key: 'author'
    // },
    // {
    //     title: 'types',
    //     dataIndex: 'types',
    //     key: 'types'
    // },
    {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
            const { type } = record
            const emnu = { 1: 'richtext', 2: 'markdown' }
        return (<span>{emnu[type]}</span>)
        }
    },
    {
        title: 'update_at',
        dataIndex: 'update_at',
        key: 'update_at',
        render: (text, record) => {
            return (<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
    }
]

export const artUpdateForms = [
    {
        label: '标题',
        type: 'normal',
        wrapper: {
            wrapperCol: {
                md: {span: 8}
            }
        },
        props: {
            name: 'title'
        },
        rules: [
            {
                required: true,
                message: '请编辑标题'
            }
        ]
    },
    {
        label: '描述',
        type: 'normal',
        wrapper: {
            wrapperCol: {
                md: {span: 8}
            }
        },
        props: {
            name: 'sub_title'
        },
        rules: [
            {
                required: true,
                message: '请编辑描述'
            }
        ]
    },
    {
        label: '类型',
        type: 'select',
        wrapper: {
            wrapperCol: {
                md: { span: 8 }
            }
        },
        props: {
            name: 'type'
        },
        rules: [
            {
                required: true,
                message: '请选择类型'
            }
        ]
    },
    {
        label: '内容',
        type: 'editor',
        props: {
            name: 'content'
        },
        rules: [
            {
                required: true,
                message: '请编辑文章内容'
            }
        ]
    }
]

export default {
    artTableColumns,
    artUpdateForms
}