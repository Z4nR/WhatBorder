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

const getRoute = async () => {
  return axios
    .get('/v1/auth/me-route', {
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

const deleteAccount = async (data: any) => {
  return axios
    .delete('/v1/user/delete', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      data: data,
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

const editPlace = async (id: any, data: any) => {
  return axios
    .patch(`/v1/place/${id}/update`, data, {
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

const placeStatisticUser = async () => {
  return axios
    .get(`/v1/place/statistic/user`, {
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

const userComparePlaceList = async () => {
  return axios
    .get(`/v1/place/user-only`, {
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

const adminUserActiveStatusList = async () => {
  return axios
    .get('/v1/admin/user-status', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const placeStatisticAdmin = async () => {
  return axios
    .get(`/v1/place/statistic/admin`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const adminPlaceList = async () => {
  return axios
    .get(`/v1/place/admin-control`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const adminNewPlaceType = async (data: any) => {
  return axios
    .post('/v1/admin/building', data, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const adminEditPlaceType = async (id: any, data: any) => {
  return axios
    .put(`/v1/admin/building/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const adminRemovePlaceType = async (id: any) => {
  return axios
    .delete(`/v1/admin/building/${id}`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const adminRemovePlace = async (id: any) => {
  return axios
    .delete(`/v1/admin/${id}/remove/place`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const adminActiveStatusUser = async (id: any) => {
  return axios
    .delete(`/v1/admin/${id}/active-status/user`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

const adminComparePlaceList = async () => {
  return axios
    .get(`/v1/place/all-user`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const superMenuList = async () => {
  return axios
    .get('/v1/super-admin/menu-list', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const superRoleList = async () => {
  return axios
    .get('/v1/super-admin/role-list', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const superUserRoleList = async () => {
  return axios
    .get('/v1/super-admin/user-role', {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { data } = res.data;
      return data;
    });
};

const superRemoveUser = async (id: any) => {
  return axios
    .delete(`/v1/super-admin/${id}/remove/user`, {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    })
    .then((res) => {
      const { message } = res.data;
      return message;
    });
};

export {
  registerAcc,
  loginAcc,
  forgetPassword,
  getLogged,
  getRoute,
  profileUser,
  editProfileUser,
  deleteAccount,
  addNewPlace,
  editPlace,
  placeList,
  placeDetail,
  placeStatisticUser,
  placeDelete,
  userList,
  userResume,
  userDetail,
  compareList,
  buildingFilter,
  userComparePlaceList,
  adminUserList,
  placeStatisticAdmin,
  adminPlaceList,
  adminUserActiveStatusList,
  adminNewPlaceType,
  adminEditPlaceType,
  adminRemovePlaceType,
  adminRemovePlace,
  adminActiveStatusUser,
  adminComparePlaceList,
  superRoleList,
  superMenuList,
  superUserRoleList,
  superRemoveUser,
};
