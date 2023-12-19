import axios from 'axios';
import useAuthState from './state/auth/authState';

const Server_URL = import.meta.env.VITE_BACKEND;
const token = () => useAuthState.getState().accessToken;

axios.defaults.baseURL = Server_URL;

const registerAcc = async (data: any) => {
  return axios
    .post('/auth/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      const { access_token } = res.data;
      return access_token;
    });
};

const loginAcc = async (data: any) => {
  return axios
    .post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      const { access_token } = res.data;
      return access_token;
    });
};

const forgetPassword = async (data: any) => {
  return axios
    .patch('/auth/change-pass', data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const getLogged = async () => {
  return axios
    .get('/user/me', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      return res.data;
    });
};

const placeList = async () => {
  return axios
    .get('stat/place-all', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      return res.data;
    });
};

const userList = async () => {
  return axios
    .get('stat/user-all', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      return res.data;
    });
};

export {
  registerAcc,
  loginAcc,
  forgetPassword,
  getLogged,
  placeList,
  userList,
};
