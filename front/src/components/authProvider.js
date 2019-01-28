import { AUTH_LOGIN, AUTH_LOGOUT } from "react-admin";
import axios from "axios";
const apiDomain = process.env.REACT_APP_API_DOMAIN;

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const body = {
      username: params.username,
      password: params.password
    };
    const request = `${apiDomain}/auth/signin`;
    axios
      .post(request, body)
      .then(res => {
        console.log(res.headers);
        
        localStorage.setItem("token", res.headers["x-access-token"]);
      })
      .catch();
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("token");
    return Promise.resolve();
  }
};
