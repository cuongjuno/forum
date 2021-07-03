import React, { useState, useEffect } from "react";
import { defaultCreate } from "../../utils/config.js";
import { Input, Label } from "reactstrap";
import Network from "../../Service/Network";
import Select from "react-select";
import ImageUploader from "react-images-upload";
import { domainServer } from "../../utils/config";
import makeAnimated from "react-select/animated";
const api = new Network();

function Job(props) {
  const [initData, setInitData] = useState({
    listPlace: [],
    listPosition: [],
    listType: [],
    listRights: [],
    listEx: [],
  });
  const [image, setImage] = useState(defaultCreate);
  const [file, setFile] = useState(null);
  const [listPost, setListPost] = useState({
    title: "",
    place: { label: "Địa điểm", value: "default", isDisabled: true },
    type: {
      label: "Hình thức đào tạo",
      value: "default",
      isDisabled: true,
    },
    experience: {
      label: "Kinh nghiệm",
      value: "default",
      isDisabled: true,
    },
    position: { label: "Vị trí", value: "default", isDisabled: true },
    rights: [],
    amount: "1",
    deadline: "",
    salary_range: "",
  });
  const animatedComponents = makeAnimated();
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: "red",
    }),
  };
  const handleInput = (e, action) => {
    setListPost((preState) => {
      return {
        ...preState,
        [action.name]: {
          value: e.value,
          label: e.label,
        },
      };
    });
  };
  const handleInput2 = (e) => {
    const { name, value } = e.target;
    setListPost((preState) => {
      return {
        ...preState,
        [name]: value,
      };
    });
  };
  const handleInputRights = (e) => {
    setListPost((preState) => {
      return {
        ...preState,
        rights: e
          ? e.map((i) => {
              return { label: i.label, value: i.value };
            })
          : "",
      };
    });
  };
  const getInitData = async () => {
    try {
      const response = await api.get("/api/init-job");
      let data = response.data;
      if (response) {
        setInitData({
          listPlace: data.listPlace.map((e, i) => {
            return {
              value: e.id,
              label: e.name,
              location: e.Locations,
            };
          }),
          listPosition: data.listPosition.map((e, i) => {
            return {
              value: e.id,
              label: e.name,
            };
          }),
          listType: data.listType.map((e, i) => {
            return {
              value: e.id,
              label: e.name,
            };
          }),
          listRights: data.listRight.map((e, i) => {
            return {
              value: e.id,
              label: e.content,
            };
          }),
          listEx: [
            { label: "Kinh nghiệm", isDisabled: true },
            { label: "Dưới 1 năm", value: "Dưới 1 năm" },
            { label: "2 năm", value: "2 năm" },
            { label: "3 năm", value: "3 năm" },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getInitData();
    if (props.dataEditJob) {
      setListPost(props.dataEditJob);
      setImage(domainServer + props.dataEditJob.image);
    }
  }, [props.dataEditJob]);
  useEffect(() => {
    console.log("abc");
    console.log(props.dataEditJob);
    getInitData();
  }, []);
  useEffect(() => {
    props.setMiniDataJob((preState) => {
      return {
        ...preState,
        title: listPost.title,
        id_type: listPost.type.value,
        experience: listPost.experience.label,
        id_position: listPost.position.value,
        salary_range: listPost.salary_range,
        amount: listPost.amount,
        deadline: listPost.deadline,
        image: image,
        id_place: listPost.place.value,
        list_right: listPost.rights.map((e) => e.value).toString(),
        file: file,
      };
    });
  }, [listPost, image]);
  const onDrop = (picture) => {
    var file = picture[picture.length - 1];
    if (file) {
      setFile(file);
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setImage(reader.result);
      };
    }
  };
  return (
    <div className="col-sm-4 form-group row content-left">
      <div className="symbol symbol-100 mr-5 col-12 d-flex justify-content-center">
        <div
          className="symbol-label symbol-label-cs-profile form-group"
          style={{
            backgroundImage: `url("${image}")`,
            position: "relative",
          }}
        >
          <div
            className="avatar-edit--profile"
            style={{
              right: "10px",
            }}
          >
            <label className="label_cs_up_ava" htmlFor="imageUpload">
              <i className="flaticon2-pen">
                <ImageUploader
                  className="imageUpload"
                  withIcon={false}
                  withLabel={false}
                  onChange={onDrop}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />
              </i>
            </label>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="form-group">
          <Input
            onChange={handleInput2}
            name="title"
            type="text"
            value={listPost.title}
            placeholder="Tiêu đề"
            className={` ${
              props.empty && listPost.title.length == 0 ? "error-empty" : ""
            }`}
          ></Input>
        </div>
      </div>
      <div className="col-12">
        <Select
          styles={
            props.empty && listPost.place.value == "default" ? customStyles : ""
          }
          onChange={handleInput}
          className="form-group"
          options={initData.listPlace}
          name="place"
          value={listPost.place}
        />
      </div>
      <div className="col-12">
        <Select
          styles={
            props.empty && listPost.type.value == "default" ? customStyles : ""
          }
          onChange={handleInput}
          name="type"
          className="form-group"
          options={initData.listType}
          value={listPost.type}
        />
      </div>
      <div className="col-12">
        <Select
          className="form-group"
          styles={
            props.empty && listPost.experience.value == "default"
              ? customStyles
              : ""
          }
          options={initData.listEx}
          onChange={handleInput}
          name="experience"
          value={listPost.experience}
        />
      </div>
      <div className="col-12">
        <Select
          styles={
            props.empty && listPost.position.value == "default"
              ? customStyles
              : ""
          }
          className="form-group"
          options={initData.listPosition}
          onChange={handleInput}
          name="position"
          value={listPost.position}
        />
      </div>
      <div className="col-12">
        <Select
          styles={
            props.empty && listPost.rights.length == 0 ? customStyles : ""
          }
          className="form-group"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={initData.listRights}
          onChange={handleInputRights}
          placeholder="Quyền lợi"
          value={listPost.rights}
        />
      </div>
      <div className="col-12 form-group">
        <Input
          onChange={handleInput2}
          type="number"
          value={listPost.amount}
          name="amount"
          placeholder="Số lượng tuyển"
          className={` ${
            props.empty && (listPost.amount == "" || listPost.amount == null)
              ? "error-empty"
              : ""
          }`}
        />
      </div>
      <div className="col-12 form-group">
        <Input
          onChange={handleInput2}
          value={listPost.deadline}
          name="deadline"
          placeholder="Hạn ứng tuyển"
          className={` ${
            props.empty && listPost.deadline.length == 0 ? "error-empty" : ""
          }`}
        />
      </div>
      <div className="col-12">
        <Input
          onChange={handleInput2}
          value={listPost.salary_range}
          name="salary_range"
          placeholder="Mức lương(VNĐ)"
          className={` ${
            props.empty && listPost.salary_range.length == 0
              ? "error-empty"
              : ""
          }`}
        />
      </div>
    </div>
  );
}

export default Job;
