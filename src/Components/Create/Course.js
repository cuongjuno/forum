import React, { useState, useEffect } from 'react';
import { defaultCreate } from '../../utils/config.js';
import { Input } from 'reactstrap';
import Network from '../../Service/Network';
import Select from 'react-select';
import ImageUploader from 'react-images-upload';
import { domainServer } from '../../utils/config';
const api = new Network();

function Course(props) {
    const [initData, setInitData] = useState({
        listPlace: [{ label: 'Địa điểm', value: 'default', isDisabled: true }],
        listTechnology: [{ label: 'Công nghệ', isDisabled: true }],
        listType: [{ label: 'Hình thức đào tạo', isDisabled: true }],
    });
    const [initLoca, setInitLoca] = useState([
        { label: 'Trụ sở', value: 'default', isDisabled: true },
    ]);
    const [stateLoca, setStateLoca] = useState({
        label: 'Trụ sở',
        value: 'default',
        isDisabled: true,
    });
    const [image, setImage] = useState(defaultCreate);
    const [file, setFile] = useState(null);
    const [listPost, setListPost] = useState({
        title: '',
        place: {
            label: 'Địa điểm',
            value: 'default',
            isDisabled: true,
        },
        tech: { label: 'Công nghệ', value: 'default', isDisabled: true },
        type: {
            label: 'Hình thức đào tạo',
            value: 'default',
            isDisabled: true,
        },
        expect_opening: '',
        study_time: '',
        tuition_number: '',
        deadline: '',
    });
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: 'red',
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
    const getInitData = async () => {
        try {
            const response = await api.get('/api/init-course');
            if (response) {
                let data = response.data;
                setInitData({
                    listPlace: data.listPlace.map((e, i) => {
                        return {
                            value: e.id,
                            label: e.name,
                            location: e.Locations,
                        };
                    }),
                    listTechnology: data.listTechnology.map((e, i) => {
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
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getInitData();
        if (props.dataEditCourse) {
            setListPost(props.dataEditCourse);
            setStateLoca(props.dataEditCourse.location);
            setImage(domainServer + props.dataEditCourse.image);
        }
    }, [props.dataEditCourse]);
    useEffect(() => {
        initData.listPlace.forEach((e) => {
            if (e.value === listPost.place.value) {
                if (e.location && e.location.length > 0) {
                    let x = e.location.map((ex, i) => {
                        return {
                            value: ex.id,
                            label: ex.name,
                        };
                    });
                    setInitLoca([
                        {
                            label: 'Trụ sở',
                            isDisabled: true,
                            value: 'default',
                        },
                        ...x,
                    ]);
                } else if (e.value === 'default') {
                    console.log('vao day');
                    setInitLoca([
                        {
                            label: 'Trụ sở',
                            isDisabled: true,
                            value: 'default',
                        },
                    ]);
                } else
                    setInitLoca([
                        {
                            label: 'Trụ sở',
                            isDisabled: true,
                            value: 'default',
                        },
                        { value: e.value, label: e.label },
                    ]);
            }
            // if (!imageEdit && !clickLoca)
            // if(  !props.dataEditCourse || listPost.place.value!==props.dataEditCourse.place.value)
            if (
                !props.dataEditCourse ||
                props.dataEditCourse.place.value !== listPost.place.value
            )
                setStateLoca({
                    label: 'Trụ sở',
                    isDisabled: true,
                    value: 'default',
                });
        });
    }, [initData.listPlace, listPost.place, props.dataEditCourse]);
    useEffect(() => {
        props.setMiniDataCourse((preState) => {
            return {
                ...preState,
                title: listPost.title,
                tuition_number: listPost.tuition_number,
                expect_opening: listPost.expect_opening,
                deadline: listPost.deadline,
                study_time: listPost.study_time,
                id_location: stateLoca.value,
                id_type: listPost.type.value,
                id_technology: listPost.tech.value,
                image: image,
                file: file,
            };
        });
    }, [listPost, image, props, stateLoca.value, file]);
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
        <div className='col-sm-4 form-group row content-left'>
            <div className='symbol symbol-100 mr-5 col-12 d-flex justify-content-center'>
                <div
                    className='symbol-label symbol-label-cs-profile form-group'
                    style={{
                        backgroundImage: `url("${image}")`,
                        position: 'relative',
                    }}
                >
                    <div
                        className='avatar-edit--profile'
                        style={{
                            right: '10px',
                        }}
                    >
                        <label
                            className='label_cs_up_ava'
                            htmlFor='imageUpload'
                        >
                            <i className='flaticon2-pen'>
                                <ImageUploader
                                    className='imageUpload'
                                    withIcon={false}
                                    withLabel={false}
                                    onChange={onDrop}
                                    imgExtension={[
                                        '.jpg',
                                        '.gif',
                                        '.png',
                                        '.gif',
                                    ]}
                                    maxFileSize={5242880}
                                />
                            </i>
                        </label>
                    </div>
                </div>
            </div>
            <div className='col-12'>
                <div className='form-group'>
                    <Input
                        onChange={handleInput2}
                        name='title'
                        type='text'
                        value={listPost.title}
                        placeholder='Tiêu đề'
                        className={` ${
                            props.empty && listPost.title.length === 0
                                ? 'error-empty'
                                : ''
                        }`}
                    ></Input>
                </div>
            </div>
            <div className='col-12'>
                <Select
                    styles={
                        props.empty && listPost.place.value === 'default'
                            ? customStyles
                            : ''
                    }
                    onChange={handleInput}
                    className='form-group'
                    options={initData.listPlace}
                    name='place'
                    value={listPost.place}
                />
            </div>
            <div className='col-12'>
                <Select
                    styles={
                        props.empty && stateLoca.value === 'default'
                            ? customStyles
                            : ''
                    }
                    onChange={(e) =>
                        setStateLoca({ value: e.value, label: e.label })
                    }
                    name='location'
                    className='form-group'
                    options={initLoca}
                    value={stateLoca}
                />
            </div>
            <div className='col-12'>
                <Select
                    styles={
                        props.empty && listPost.type.value === 'default'
                            ? customStyles
                            : ''
                    }
                    onChange={handleInput}
                    name='type'
                    className='form-group'
                    options={initData.listType}
                    value={listPost.type}
                />
            </div>
            <div className='col-12'>
                <Select
                    styles={
                        props.empty && listPost.tech.value === 'default'
                            ? customStyles
                            : ''
                    }
                    onChange={handleInput}
                    name='tech'
                    className='form-group'
                    options={initData.listTechnology}
                    value={listPost.tech}
                />
            </div>
            <div className='col-12'>
                <div className='form-group'>
                    <Input
                        onChange={handleInput2}
                        name='expect_opening'
                        type='text'
                        placeholder='Lịch khai giảng dự kiến'
                        className={` ${
                            props.empty && listPost.expect_opening.length === 0
                                ? 'error-empty'
                                : ''
                        }`}
                        value={listPost.expect_opening}
                    ></Input>
                </div>
            </div>
            <div className='col-12'>
                <div className='form-group'>
                    <Input
                        onChange={handleInput2}
                        name='study_time'
                        type='text'
                        value={listPost.study_time}
                        placeholder='Thời gian học'
                        className={` ${
                            props.empty && listPost.study_time.length === 0
                                ? 'error-empty'
                                : ''
                        }`}
                    ></Input>
                </div>
            </div>
            <div className='col-12 form-group'>
                <Input
                    onChange={handleInput2}
                    value={listPost.tuition_number}
                    name='tuition_number'
                    placeholder='Học phí(VNĐ)'
                    className={` ${
                        props.empty && listPost.tuition_number.length === 0
                            ? 'error-empty'
                            : ''
                    }`}
                />
            </div>
            <div className='col-12'>
                <div className='form-group'>
                    <Input
                        onChange={handleInput2}
                        name='deadline'
                        type='text'
                        value={listPost.deadline}
                        placeholder='Hạn đăng ký'
                        className={` ${
                            props.empty && listPost.deadline.length === 0
                                ? 'error-empty'
                                : ''
                        }`}
                    ></Input>
                </div>
            </div>
        </div>
    );
}

export default Course;
