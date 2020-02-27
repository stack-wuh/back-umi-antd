export const userForm = {
    name: {
        rules: [{ required: true, message: '请编辑姓名' }],
        props: {
            label: '真实姓名'
        }
    },
    username: {
        rules: [{ required: true, message: '请编辑用户名' }],
        props: {
            label: '用户名'
        }
    },
    password: {
        rules: [{ required: true, message: '请编辑密码' },
            { min: 6, message: '密码最少6位数'}],
        props: {
            label: '密码',
            type: 'password'
        }
    },
    email: {
        rules: [{ required: true, message: '请编辑邮箱' }, 
            { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '邮箱格式不正确' }],
        props: {
            label: '邮箱'
        }
    }
}