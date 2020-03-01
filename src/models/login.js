import { stringify } from 'querystring';
import { router } from 'umi';
import { userLogin, userLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd'
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    currentUser: {}
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully
      if (response.code === 20000) {
        router.replace('/welcome')
        localStorage.setItem('token', JSON.stringify(response.data.token))
      }
      return
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
    },

    *logout(_, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      const response = yield call(userLogout, _.payload)
      if (response.code !== 20000) return message.error('登出失败, 请重试!')
      yield put({ type: 'clearCurrent' })
      localStorage.removeItem('token')
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type, currentUser: payload.data.user };
    },
    clearCurrent(state, {payload}) {
      return {
        ...state,
        currentUser: {}
      }
    }
  },
};
export default Model;
