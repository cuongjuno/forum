import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { Link } from "react-router-dom";
import Network from "../../Service/Network";
import moment from "moment";
import CustomToast from "../common/CustomToast";
import { toast } from "react-toastify";
import Pagination from "rc-pagination";
import CandidateDetail from "./CandidateDetail";
const api = new Network();
const domainFetchTech = "https://fetch.tech";

function ListCandidate(props) {
  const [open, setOpen] = useState(false);
  const [mess, setMess] = useState("this is message");
  const [mystate, setMystate] = useState(["id", true]);
  const [listCandidate, setListCandidate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalRow: 0,
  });
  const [can, setCan] = useState({});
  const [isShow, setIsShow] = useState(false);
  const submitDestroy = async (id, is_show) => {
    try {
      const res = await api.patch("/api/job", {
        id: id,
        is_show: !is_show,
      });
      await fetchData();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const showModal = (can) => {
    setCan(can);
    setIsShow(true);
  };
  const fetchData = async () => {
    try {
      const response = await api.get(`/api/candidate-admin`);
      if (response) {
        // setListCourse(response.data.listCourse);
        // setIsLoading(false);
        // setState((preState) => ({
        //   ...preState,
        //   totalRow: response.data.count,
        // }));
        // console.log(response.data);
        console.log(response.data);
        setListCandidate((state) => response.data.listCandidate);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("err while fetch list blog", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [state.pageNumber]);
  const handlePagination = (page) => {
    setState((preState) => ({
      ...preState,
      pageNumber: page,
    }));
  };
  let handleClose = () => {
    setOpen(false);
  };
  let handleCloseAndSubmit = () => {
    submitDestroy(mystate[0], mystate[1]);
    setOpen(false);
  };
  let handleOpen = () => {
    if (mystate[1] === true) {
      setMess("Are you sure to hide this post!!!");
    } else if (mystate[1] === false) {
      setMess("Are you sure to display this post!!!");
    }
    setOpen(true);
  };
  return (
    <>
      <CandidateDetail show={isShow} onHide={() => setIsShow(false)} can={can}/>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mess}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseAndSubmit} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${props.className_wrap_broad}`}
      >
        {isLoading ? <Fbloader /> : null}
        <div className="content d-flex flex-column flex-column-fluid">
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-dark">
                        Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <div className="text-dark">List Candidate</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">List Candidate</h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2"></div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row p-0 pb-5"></div>

                  <div
                    className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                    id="kt_datatable"
                    style={{ position: "static", zoom: 1 }}
                  >
                    <table
                      className="datatable-table"
                      style={{ display: "block" }}
                    >
                      <thead className="datatable-head">
                        <tr
                          className="datatable-row"
                          style={{
                            left: "0px",
                            textAlign: "center",
                          }}
                        >
                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort"
                            style={{ width: "15%" }}
                          >
                            <span style={{ width: "" }}>Name</span>
                          </th>

                          <th
                            data-field="ShipDate"
                            className="datatable-cell datatable-cell-sort hide_mb"
                            style={{ width: "15%" }}
                          >
                            <span style={{ width: "" }}>Phone</span>
                          </th>

                          <th
                            data-field="Type"
                            data-autohide-disabled="false"
                            className="datatable-cell datatable-cell-sort hide_mb"
                            style={{ width: "15%" }}
                          >
                            <span style={{ width: "" }}>Email</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="datatable-body" style={{}}>
                        {listCandidate.map((can, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr
                                data-row={1}
                                className="datatable-row datatable-row-even"
                                style={{
                                  left: "0px",
                                  textAlign: "center",
                                  alignItems: "center",
                                }}
                              >
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                  style={{
                                    width: "15%",
                                  }}
                                >
                                  <span
                                    onClick={() => showModal(can)}
                                    className="text-hover-primary"
                                    style={{
                                      width: "",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {can.name}
                                  </span>
                                </td>
                                {/* expecting open */}
                                <td
                                  data-field="ShipDate"
                                  // aria-label="9/3/2017"
                                  className="datatable-cell hide_mb"
                                  style={{
                                    width: "15%",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "",
                                    }}
                                  >
                                    {can.phone}
                                  </span>
                                </td>

                                {/* tuition name */}
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                  style={{
                                    width: "15%",
                                  }}
                                >
                                  <span
                                    //   onClick={() => openCourse(blog)}
                                    className="text-hover-primary"
                                    style={{
                                      width: "",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {can.email}
                                  </span>
                                </td>
                                {/* location name */}
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="datatable-pager datatable-paging-loaded fl_end">
                      <Pagination
                        defaultPageSize={state.pageSize}
                        current={state.pageNumber}
                        hideOnSinglePage={true}
                        showTitle={false}
                        onChange={handlePagination}
                        total={state.totalRow}
                        showLessItems={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
    history: ownProps.history,
  };
};

export default connect(mapStateToProps)(ListCandidate);
