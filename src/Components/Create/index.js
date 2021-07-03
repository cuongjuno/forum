import React, { useState, useEffect } from "react";
import Select from "react-select";
import Course from "./Course";
import Job from "./Job";
import { connect } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import Network from "../../Service/Network";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import RawTool from "@editorjs/raw";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import "./post.css";
import axios from "axios";
import { Input } from "reactstrap";
import { domainServer } from "../../utils/config";
// import { withTheme } from '@material-ui/core';
const api = new Network();
let editor = null;

function Create(props) {
  const params = useParams();
  const history = useHistory();
  const [styleHeader, setStyleHeader] = useState("card-header");
  const [isDisableSave, setIsDisableSave] = useState(false);
  const [typeOfCreate, setTypeOfCreate] = useState("job");
  const [miniDataCourse, setMiniDataCourse] = useState({
    title: "",
    tuition_number: "",
    expect_opening: "",
    study_time: "",
    id_location: "",
    id_type: "",
    id_technology: "",
    deadline: "",
    file: null,
  });
  const [miniDataJob, setMiniDataJob] = useState({
    title: "",
    salary_range: "",
    experience: "",
    amount: "1",
    deadline: "",
    list_right: "",
    id_type: "",
    id_place: "",
    id_position: "",
    file: null,
  });
  const options = [
    { value: "job", label: "Tin tuyển dụng" },
    { value: "course", label: "Tin tuyển sinh" },
    { value: "news", label: "Tin tức & sự kiện" },
  ];
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "#1bc5bd" : "white",
    }),
    control: (provided) => ({
      ...provided,
    }),
  };
  const [empty, setEmpty] = useState(false);
  const handleScroll = () => {
    let lengthScroll = window.pageYOffset;
    if (lengthScroll > 220) {
      setStyleHeader("card-header style-header-job");
    } else {
      setStyleHeader("card-header");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  // useEffect(() => {
  //   if (params.type == 'course') setTypeOfCreate('course');
  // }, []);
  useEffect(() => {
    setEmpty(false);
    if (editor) {editor.destroy();}
    editor = new EditorJS({
      holder: "editor-js",
      placeholder: "Let`s write an awesome story!",
      tools: {
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching
          },
        },
        raw: RawTool,
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            field: "file",
            endpoints: {
              byFile: `${domainServer}/api/editor/${typeOfCreate}-image`, // Your backend file uploader endpoint
              byUrl: `${domainServer}/api/editor/${typeOfCreate}-image-url`, // Your endpoint that provides uploading by Url
            },
          },
        },
      },
    });
  }, [typeOfCreate]);
  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (typeOfCreate == "course" ? miniDataCourse.file : miniDataJob.file) {
        var formData = new FormData();
        formData.append(
          "file",
          typeOfCreate == "course" ? miniDataCourse.file : miniDataJob.file
        );
        const request_header = api.getHeaderUpload();
        const request_server = api.domain;
        const config = {
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        };
        config.headers = request_header.headers;
        axios
          .post(request_server + `/api/${typeOfCreate}-image`, formData, config)
          .then((res) => {
            if (res) {
              console.log(res.data.data.nameFile);
              resolve(res.data.data.nameFile);
            }
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        resolve("/images/default-image");
      }
    });
  };
  const onSave = async () => {
    console.log("da vao day", typeOfCreate)
    if (typeOfCreate == "news") {
      const outputData = editor ? await editor.save() : "";
      const postDataa = {
        title: outputData.blocks[0].data.text,
        content: {
          block: outputData.blocks,
        },
        is_show: true,
      };
      try {
        const res = await api.post("/api/news", postDataa);
        console.log(res);
        history.push(`/list-${typeOfCreate}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (
        Object.values(
          typeOfCreate == "course"
            ? miniDataCourse
            : typeOfCreate == "job"
            ? miniDataJob
            : ""
        ).findIndex((e) => e == "" ) < 0
      ) {
        setEmpty(false);
        const outputData = editor ? await editor.save() : "";
        let postDataa = {};
        console.log("da vao day")
        if (typeOfCreate == "course") {
          postDataa = {
            title: miniDataCourse.title,
            deadline: miniDataCourse.deadline,
            tuition_number: miniDataCourse.tuition_number,
            expect_opening: miniDataCourse.expect_opening,
            study_time: miniDataCourse.study_time,
            id_location: miniDataCourse.id_location,
            id_type: miniDataCourse.id_type,
            id_technology: miniDataCourse.id_technology,
            content: { block: outputData.blocks },
            is_show: true,
          };
        } else if (typeOfCreate == "job") {
          console.log(miniDataJob);
          postDataa = {
            title: miniDataJob.title,
            salary_range: miniDataJob.salary_range,
            experience: miniDataJob.experience,
            amount: miniDataJob.amount,
            deadline: miniDataJob.deadline,
            list_right: miniDataJob.list_right,
            id_type: miniDataJob.id_type,
            id_place: miniDataJob.id_place,
            id_position: miniDataJob.id_position,
            content: { block: outputData.blocks },
            is_show: true,
          };
        }
        console.log(postDataa);
        const nameFile = await uploadImage();
        postDataa.imageTitle = nameFile;
        try {
          const res = await api.post(`/api/${typeOfCreate}`, postDataa);
          console.log(res);
          history.push(`/list-${typeOfCreate}`);
        } catch (error) {
          console.log(error);
          setEmpty(true);
        }
      } else setEmpty(true);
    }
  };
  return (
    <div
      className={`d-flex flex-column flex-row-fluid wrapper ${props.className_wrap_broad}`}
    >
      <div className="content d-flex flex-column flex-column-fluid p-0">
        {/* <ToastContainer /> */}
        <div
          className="subheader py-3 py-lg-8 subheader-transparent"
          id="kt_subheader"
        >
          <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
            <div className="d-flex align-items-center mr-1">
              <div className="d-flex align-items-baseline flex-wrap mr-5">
                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                  <li className="breadcrumb-item">
                    <NavLink to="/" className="text-muted">
                      Fetch admin
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item">
                    <NavLink to="/list-blog" className="text-muted">
                      Blog
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-muted" style={{ cursor: "pointer" }}>
                      Create Blog
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column-fluid">
          <div className="container">
            <div
              className="card card-custom card-sticky"
              id="kt_page_sticky_card"
              style={{ minHeight: "100vh" }}
            >
              <div className={styleHeader}>
                <div className="card-title">
                  <Select
                    onChange={(e) => setTypeOfCreate(e.value)}
                    options={options}
                    name="typeOfCreate"
                    defaultValue={options[0]}
                    styles={customStyles}
                  />
                </div>
                <div className="card-toolbar">
                  <span
                    onClick={() => history.goBack()}
                    className="btn btn-light-primary font-weight-bolder mr-2"
                  >
                    Back
                  </span>
                  <div className="btn-group">
                    <button
                      
                      type="button"
                      onClick={onSave}
                      className={
                        false
                          ? "btn btn-primary font-weight-bolder style-btn-kitin spinner spinner-white spinner-right"
                          : "btn btn-primary font-weight-bolder style-btn-kitin "
                      }
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div style={{ padding: "0 30px" }}>
                  <div className="my-5 row">
                    {typeOfCreate == "course" && (
                      <Course
                        setMiniDataCourse={setMiniDataCourse}
                        empty={empty}
                      />
                    )}
                    {typeOfCreate == "job" && (
                      <Job setMiniDataJob={setMiniDataJob} empty={empty} />
                    )}
                    <div
                      id="editor-js"
                      style={{ zIndex: "0" }}
                      className={`${
                        typeOfCreate == "news"
                          ? "col-md-12"
                          : "col-md-8 offset-md-4"
                      } `}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

export default connect(mapStateToProps)(Create);
