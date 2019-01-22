import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_CHECK,
  AUTH_ERROR
} from "react-admin";
import axios from "axios";

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const body = {
      username: params.username,
      password: params.password
    };
    const request = "http://localhost:5000/auth/signin";
    axios
      .post(request, body)
      .then(res => {
        localStorage.setItem("token", res.headers["x-access-token"]);
      })
      .catch();
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    // ...
  }
  if (type === AUTH_CHECK) {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  }
};
