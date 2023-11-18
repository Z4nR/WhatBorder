import axios from 'axios';

const Server_URL = import.meta.env.VITE_BACKEND;

axios.defaults.baseURL = Server_URL;

const loginAcc = async (data: any) => {
  return axios
    .post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (res.status !== 202) {
        const { message } = res.data;
        return message;
      }
      const { access_token } = res.data;
      return access_token;
    });
};

export { loginAcc };
