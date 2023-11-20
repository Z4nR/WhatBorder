import axios from 'axios';
import useAuthState from './state/auth/authState';

const Server_URL = import.meta.env.VITE_BACKEND;
const token = () => useAuthState.getState().accessToken;

axios.defaults.baseURL = Server_URL;

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

export { loginAcc, getLogged };
