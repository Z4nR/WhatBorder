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
      const { accessToken } = res.data;
      return accessToken;
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
      const { accessToken } = res.data;
      return accessToken;
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
      const { data } = res.data;
      return data;
    });
};

const placeList = async () => {
  return axios
    .get('place', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const placeDetail = async (id: any) => {
  return axios
    .get(`place/${id}/detail`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
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
      const { data } = res.data;
      return data;
    });
};

export {
  registerAcc,
  loginAcc,
  forgetPassword,
  getLogged,
  placeList,
  placeDetail,
  userList,
};
