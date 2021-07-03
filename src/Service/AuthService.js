import axios from "axios";
import { domainServer } from "../utils/config.js";

var self = null;
export default class AuthService {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.setProfile = this.setProfile.bind(this);

    this.domain = domainServer;

    self = this;
  }

  login(email, password, callback) {
    let setProfile = this.setProfile;
    axios
      .post(`${this.domain}/api/sigin`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response.data.data);
        setProfile(response.data.data.token);

        callback(true);
      })
      .catch(function (error) {
        console.log(error);
        callback(false);
      });
  }
  handleError(error, rejected) {
    if (error.response) {
      if (error.response.status === 401) {
        this.forceLogout();
      } else if (error.response.status === 404) {
        // window.location.href = '/error';
      } else {
        rejected(error);
      }
    } else {
      console.log("ERROR---->", error);
      rejected(error);
    }
  }
  loggedIn() {
    const profile = this.getProfile();
    if (profile) return true;
    return false;
  }

  setProfile(profile) {
    localStorage.setItem("token", profile);
  }
  getProfile() {
    const profile = localStorage.getItem("token");
    return profile ? profile : null;
  }

  logout() {
    localStorage.removeItem("token");
    window.location.replace("/");
  }
  forceLogout() {
    // console.log('LogOut');
    sessionStorage.removeItem("token");
    localStorage.removeItem("tokenTimeStamp");
    localStorage.setItem("forceLogout", "true");
    window.location.replace("/");
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
