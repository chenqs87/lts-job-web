//auth.js
import axios from "axios";

const auth = {
  user: {
    authenticated: false
  },
  checkAuth() {
    if (this.user.authenticated) {
      return true;
    } else {
      this.refreshAuth();
      return this.user.authenticated;
    }
  },
  refreshAuth() {
    let _token = sessionStorage.getItem("access-token");
    if (_token) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },

  cleanAuth() {
    this.user.authenticated = false;
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("role");
  },

  login(username, password) {
    return axios
      .post("/console/auth/login", {
        username: username,
        password: password
      })
      .then(res => res.data);
  },
  setAuth(data) {
    sessionStorage.setItem("access-token", data.token);
    sessionStorage.setItem("userName", data.userName);
    sessionStorage.setItem("role", data.role);
    this.refreshAuth();
  },
  getToken() {
    return sessionStorage.getItem("access-token");
  },
  getRole() {
    return sessionStorage.getItem("role");
  }
};

export default auth;
