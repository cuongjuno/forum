import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import {
  addPaddingBroad,
  removePaddingBroad,
  setAvatarUser,
} from "../../redux/actions";
import { connect } from "react-redux";
import AuthService from "../../Service/AuthService.js";
import Network from "../../Service/Network.js";
import { defaultAva, domainServer } from "../../utils/config.js";
import { withRouter } from "react-router-dom";
import Pusher from "pusher-js";
import DrawerProfile from "./DrawerProfile.js";
import { ToastContainer, toast, Flip, Zoom } from "react-toastify";
import moment from "moment";

const auth = new AuthService();
const api = new Network();

class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class_menu_left: "wrap_menu_left",
      class_arr: "fa fa-chevron-right",
      isOpenDrawer: false,
      profile: {},
      countUnreadNoti: 0,
      //noti
      notification: [],
      pageSize: 12,
      pageNumber: 1,
      total: 0,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.uploadAvatarDone = this.uploadAvatarDone.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.markAllNotiRead = this.markAllNotiRead.bind(this);
    this.renderNotiToast = this.renderNotiToast.bind(this);
    this.forwardNoti = this.forwardNoti.bind(this);
    this.drawerProfile = React.createRef();

    //noti
    this.getDataNoti = this.getDataNoti.bind(this);
    this.receiveNewNoti = this.receiveNewNoti.bind(this);
  }

  //notice
  async getDataNoti() {
    try {
      const response = await api.get(
        `/api/admin/notification?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );
      if (response) {
        this.setState((state) => ({
          total: response.data.total,
          hasNextPage:
            [...state.notification, ...response.data.list].length <
            response.data.total,
          notification: [...state.notification, ...response.data.list],
          pageNumber: state.pageNumber + 1,
        }));
      }
    } catch (err) {
      console.log("err while get noti", err);
    }
  }

  receiveNewNoti(newNoti) {
    this.setState((state) => {
      return {
        notification: [newNoti, ...state.notification],
      };
    });
  }

  //end notice

  forwardNoti(type, id) {
    if (type == "assignJob") {
      this.props.history.push(`/job-detail/${id}`);
    } else if (type == "assignCard") {
      this.props.history.push(`/board`);
    } else if (type == "assignTask") {
      this.props.history.push(`/`);
    }
  }
  renderNotiToast(noti) {
    let icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
    console.log(noti.type);
    switch (noti.type) {
      case "assignJob":
        icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
        break;
      case "assignCard":
        icon = <i className="flaticon-bell text-success icon-lg" />;
        break;
      case "assignTask":
        icon = <i className="flaticon-calendar-1 text-success icon-lg" />;
        break;
      case "jobOverTime":
        icon = (
          <i className="flaticon-safe-shield-protection text-danger icon-lg" />
        );
        break;
      default:
        icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
        break;
    }
    return (
      <div
        className="navi-item rounded"
        onClick={this.forwardNoti.bind(this, noti.type, noti.content.id)}
      >
        <div className="navi-link rounded d-flex">
          <div className="symbol symbol-50 mr-3">
            <div className="symbol-label symbol_label_cs">{icon}</div>
          </div>
          <div className="navi-text">
            <div className="text-dark font-weight-bold font-size-lg cus_text_mute">
              {noti.content.message}
            </div>
            <div className="text-muted">{noti.content.title}</div>
            <div className="time_noti text-muted">
              {moment(noti.createdAt).format("hh:mm a DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  uploadAvatarDone(linkAvatar) {
    let currentProfile = this.state.profile;
    currentProfile.linkAvatar = linkAvatar;
    this.setState({
      profile: currentProfile,
    });
  }
  async getProfile() {
    try {
      const responseProfile = await api.get(`/api/profile`);
      if (responseProfile) {
        // this.initSocketIO(responseProfile.data.user.id);
        this.setState(
          {
            profile: responseProfile.data.user,
            countUnreadNoti: responseProfile.data.user.countNotificationNotSeen
              ? responseProfile.data.user.countNotificationNotSeen
              : 0,
          },
          function () {}
        );
        const linkAvatar = responseProfile.data.user.linkAvatar;
        await this.props.setAvatarUser(linkAvatar);
      }
    } catch (error) {
      console.log("err while get profile user: ", error);
    }
  }
  async markAllNotiRead() {
    try {
      const response = await api.patch(`/api/read/all/notification`);
      if (response) {
        const newNotification = this.state.notification.map((noti, index) => {
          return { ...noti, status: true };
        });
        this.setState({
          notification: newNotification,
          countUnreadNoti: 0,
        });
      }
    } catch (error) {
      console.log("err while mark read: ", error);
    }
  }
  async toggleDrawer(open) {
    // mark all noti as read => call api read noti
    if (this.state.countUnreadNoti != 0 && !open) {
      await this.markAllNotiRead();
    } else {
    }
    this.setState({ isOpenDrawer: open });
  }
  toggleMenu() {
    if (this.state.class_menu_left === "wrap_menu_left") {
      this.props.addPadding();
      this.setState({
        class_menu_left: "wrap_menu_left menu_extend",
        class_arr: "fa fa-chevron-left",
      });
    } else {
      this.props.removePadding();
      this.setState({
        class_menu_left: "wrap_menu_left",
        class_arr: "fa fa-chevron-right",
      });
    }
  }
  handleOnClick(e, path) {
    e.preventDefault();
    this.props.hideMenuResponsive();
    this.props.history.push(path);
  }
  logout() {
    auth.logout();
  }
  componentDidMount() {
    // this.getDataNoti();
    // this.getProfile();
  }
  render() {
    const notification = this.state.notification;
    return (
      <div className={`stick_toggle_button ${this.props.classHide}`}>
        <ToastContainer />
        {this.state.isOpenDrawer ? (
          <DrawerProfile
            show={this.state.isOpenDrawer}
            onHide={this.toggleDrawer.bind(this, false)}
            logout={this.logout}
            data={this.state.profile}
            doneUpload={this.uploadAvatarDone.bind(this)}
            history={this.props.history}
            hideMenuResponsive={this.props.hideMenuResponsive}
            notification={notification}
            ref={this.drawerProfile}
            getDataNoti={this.getDataNoti}
            hasNextPage={this.state.hasNextPage}
          />
        ) : null}

        <div className="toggle_button" onClick={this.toggleMenu}>
          <i className={this.state.class_arr} aria-hidden="true"></i>
        </div>
        <div className={this.state.class_menu_left}>
          <div>
            <div
              className="row_icon wrap_avatar_user"
              onClick={this.toggleDrawer.bind(this, true)}
            >
              <div className="position-relative">
                {this.state.profile ? (
                  <img
                    className="ava_img"
                    src={
                      this.state.profile.linkAvatar
                        ? domainServer + "/" + this.state.profile.linkAvatar
                        : defaultAva
                    }
                    alt="ava"
                  />
                ) : (
                  <img className="ava_img" src={defaultAva} alt="ava" />
                )}
                {this.state.countUnreadNoti != 0 ? (
                  <span className="label label-sm  label-danger font-weight-bolder position-absolute noti_count mt-1 mr-1">
                    {this.state.countUnreadNoti}
                  </span>
                ) : null}
              </div>

              <div className="content_menu">Profile</div>
            </div>

            <NavLink
              exact
              activeClassName="selected"
              to="/post"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/post")
                  : () => null
              }
              className={`row_icon ${
                this.props.role === "Bloger" ? "hide_bloger" : ""
              }`}
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="flaticon-add icon-2x hover_icon"></i>
              </div>
              <div className="content_menu">Post</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/list-course"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/list-course")
                  : () => null
              }
              className={`row_icon ${
                this.props.role === "Bloger" ? "hide_bloger" : ""
              }`}
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="flaticon2-open-text-book icon-2x hover_icon"></i>
              </div>
              <div className="content_menu">List Course</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/list-job"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/list-job")
                  : () => null
              }
              className={`row_icon ${
                this.props.role === "Bloger" ? "hide_bloger" : ""
              }`}
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="flaticon-rotate icon-2x hover_icon"></i>
              </div>
              <div className="content_menu">List Job</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/list-news"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/list-news")
                  : () => null
              }
              className={`row_icon ${
                this.props.role === "Bloger" ? "hide_bloger" : ""
              }`}
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fas fa-newspaper icon-2x hover_icon"></i>
              </div>
              <div className="content_menu">List News</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/list-candidate"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/list-candidate")
                  : () => null
              }
              className={`row_icon ${
                this.props.role === "Bloger" ? "hide_bloger" : ""
              }`}
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fas fa-id-card icon-2x hover_icon"></i>
              </div>
              <div className="content_menu">Candidates</div>
            </NavLink>
          </div>
          <div></div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPadding: () => dispatch(addPaddingBroad()),
    removePadding: () => dispatch(removePaddingBroad()),
    setAvatarUser: (linkAvatar) => dispatch(setAvatarUser(linkAvatar)),
  };
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
    history: ownProps.history,
    classHide: ownProps.classHide,
    isMobile: ownProps.isMobile,
    hideMenuResponsive: ownProps.hideMenuResponsive,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MenuLeft)
);
