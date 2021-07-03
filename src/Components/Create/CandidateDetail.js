import React, { useState, useEffect } from "react";

import { Modal } from "react-bootstrap";
import Network from "../../Service/Network";

import { domainServer } from "../../utils/config";

const api = new Network();

function CandidateDetail(props) {
  useEffect(() => {
    console.log(props);
  });
  return (
    <Modal size="lg" show={props.show} onHide={props.onHide} centered>
      <Modal.Header className="header-candidate-job">
        <Modal.Title>{props.can.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="card-body card-body-update">
            <div className="form-group">
              <label>Họ và tên:</label>
              <input
                type="text"
                name="name"
                required
                disabled
                value={props.can.name}
                className="form-control"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Ngày sinh:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.date_of_birth}
                />
              </div>
              <div className="col-lg-6">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.phone}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-lg-6">
                <label>Email:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.email}
                />
              </div>
              <div className="col-lg-6">
                <label>Giới tính:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.sex?"Nam":"Nữ"}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Trường:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.school}
                />
              </div>
              <div className="col-lg-6">
                <label>Khoa:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.faculty}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-lg-6">
                <label>Năm tốt nghiệp:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.graduation_year}
                />
              </div>
              <div className="col-lg-6">
                <label>Điểm trung bình hệ 4:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.score}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Kỹ năng khác:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.another_skill}
                />
              </div>
              <div className="col-lg-6">
                <label>Ngôn ngữ:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.language}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Kinh nghiệm:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.experience}
                />
              </div>
              <div className="col-lg-6">
                <label>Link Profile:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.profiles}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Vị trí:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.Position? props.can.Position.name:""}
                />
              </div>
              <div className="col-lg-6">
                <label>Công việc:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.Job?props.can.Job.title:""}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Thời gian làm việc:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.Type? props.can.Type.name:""}
                />
              </div>
              <div className="col-lg-6">
                <label>Địa điểm:</label>
                <input
                  type="text"
                  name="clientName"
                  disabled
                  className="form-control"
                  value={props.can.Place?props.can.Place.name:""}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-lg-6">
                <label>Khoá học:</label>
                <input
                  type="text"
                  name="location"
                  disabled
                  required
                  className="form-control"
                  value={props.can.Course? props.can.Course.title:""}
                />
              </div>
              <div className="col-lg-6">
                <label>File đính kèm:</label>
                <div className="input-group">
                  <input
                    disabled
                    type="text"
                    name="cv"
                    className="form-control"
                    value={props.can.file}
                  />
                  <a
                    // href={`data:application/pdf;base64,${this.state.base64Drive}`}
                    // download={`${
                    //   this.state.base64Drive ? this.state.name : ""
                    // }.pdf`}
                    className="input-group-append"
                  >
                    <span className="input-group-text">
                      <i className="fas fa-cloud-download-alt"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CandidateDetail;
