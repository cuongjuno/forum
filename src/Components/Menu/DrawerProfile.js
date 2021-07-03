import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import moment from "moment";
import Wrapper from "../common/Wrapper.js";
import Network from "../../Service/Network";
import Drawer from "@material-ui/core/Drawer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { defaultAva, domainServer } from "../../utils/config.js";

const api = new Network();

class DrawerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasNextPage: true,
      isNextPageLoading: false,
      notification: [],
      pageSize: 12,
      pageNumber: 1,
      total: 0,
    };
    this.redirectProfile = this.redirectProfile.bind(this);
    
 
    this.scrollCol = null;
    this.scrollRef = React.createRef();
  }
  // Render an item or a loading indicator.
  
  

  
  redirectProfile(id) {
    this.props.onHide();
    if (this.props.hideMenuResponsive) {
      this.props.hideMenuResponsive();
    }
    this.props.history.push(`/profile/${id}`);
  }
  componentDidMount() {
   
  }
 

  
  render() {
    const data = this.props.data;
    const notification = this.props.notification;
    const { hasNextPage, isNextPageLoading } = this.state;
    console.log(notification);
    return (
      <Drawer
        anchor={"left"}
        open={this.props.show}
        onClose={this.props.onHide}
      >
        <div className=" p-10 ">
          <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
            <h3 className="font-weight-bold m-0">User Profile</h3>
            <div
              className="btn btn-xs btn-icon btn-light btn-hover-primary"
              onClick={this.props.onHide}
            >
              <i className="ki ki-close icon-xs text-muted" />
            </div>
          </div>
          <div className="offcanvas-content pr-5 mr-n5 scroll ">
            <div className="d-flex align-items-center mt-5">
              <div className="symbol symbol-100 mr-5">
                <div
                  className="symbol-label symbol-label-cs-profile"
                  style={{
                    backgroundImage: data.linkAvatar
                      ? `url("${domainServer + "/" + data.linkAvatar}")`
                      : `url("${defaultAva}")`,
                  }}
                />
                <i className="symbol-badge bg-success" />
                
              </div>
              <div className="d-flex flex-column">
                <div
                  className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"
                  title="View details"
                  style={{ cursor: "pointer" }}
                >
                  Admin
                </div>
             

                <div className="navi mt-2">
                  
                  <div
                    onClick={this.props.logout}
                    className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5"
                  >
                    Sign Out
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-dashed mt-8 mb-5" />
           
          </div>
        </div>
      </Drawer>
    );
  }
}

export default DrawerProfile;
