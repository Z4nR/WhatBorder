import axios from 'axios';
import useAuthState from './state/authState';

const Server_URL = import.meta.env.VITE_BACKEND;
const token = () => useAuthState.getState().accessToken;

axios.defaults.baseURL = Server_URL;

const registerAcc = async (data: any) => {
  return axios
    .post('/v1/auth/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      return res.data;
    });
};

const loginAcc = async (data: any) => {
  return axios
    .post('/v1/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      return res.data;
    });
};

const forgetPassword = async (data: any) => {
  return axios
    .patch('/v1/auth/change-pass', data, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const getLogged = async () => {
  return axios
    .get('/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const profileUser = async () => {
  return axios
    .get('/v1/user/profile', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const editProfileUser = async (data: any) => {
  return axios
    .patch('/v1/user/update', data, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const addNewPlace = async (data: any) => {
  return axios
    .post('/v1/place', data, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const placeList = async () => {
  return axios
    .get('/v1/place', {
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
    .get(`/v1/place/${id}/detail`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const placeStatistic = async () => {
  return axios
    .get(`/v1/place/statistic`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const placeDelete = async (id: any) => {
  return axios
    .delete(`/v1/place/${id}/remove`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const userList = async () => {
  return axios
    .get('/v1/user', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const userResume = async (id: any) => {
  return axios
    .get(`/v1/user/${id}/resume`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const userDetail = async (id: any) => {
  return axios
    .get(`/v1/user/${id}/detail`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const adminUserList = async () => {
  return axios
    .get('/v1/admin', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const compareList = async (id: any) => {
  return axios
    .get(`/v1/place/${id}/compare-list`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const buildingFilter = async () => {
  return axios
    .get(`/v1/place/building-filter`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const myList = async () => {
  return axios
    .get(`/v1/place/my-list`, {
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
  profileUser,
  editProfileUser,
  addNewPlace,
  placeList,
  placeDetail,
  placeStatistic,
  placeDelete,
  userList,
  userResume,
  userDetail,
  adminUserList,
  compareList,
  buildingFilter,
  myList,
};
