import React, { useState, useEffect } from 'react';
import Course from './Course';
import Job from './Job';
import { connect } from 'react-redux';
import { NavLink, useHistory, withRouter } from 'react-router-dom';
import Network from '../../Service/Network';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import RawTool from '@editorjs/raw';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import './post.css';
import axios from 'axios';
import { domainServer } from '../../utils/config';
import { useParams } from 'react-router-dom';
const api = new Network();
let editor = null;
function EditCourse(props) {
    const history = useHistory();
    const params = useParams();
    const [styleHeader, setStyleHeader] = useState('card-header');
    const [isDisableSave, setIsDisableSave] = useState(false);
    const [typeOfCreate, setTypeOfCreate] = useState('');
    const [miniDataCourse, setMiniDataCourse] = useState({
        title: '',
        tuition_number: '',
        expect_opening: '',
        study_time: '',
        id_location: '',
        id_type: '',
        id_technology: '',
        deadline: '',
        file: null,
    });
    const [miniDataJob, setMiniDataJob] = useState({
        title: '',
        salary_range: '',
        experience: '',
        amount: '',
        deadline: '',
        list_right: '',
        id_type: '',
        id_place: '',
        id_position: '',
        file: null,
    });
    const [dataEditJob, setDataEditJob] = useState({
        title: '',
        place: { label: '', value: '' },
        type: {
            label: '',
            value: '',
        },
        experience: {
            label: '',
            value: '',
        },
        position: { label: '', value: '' },
        rights: [],
        amount: '',
        deadline: '',
        salary_range: '',
        image: '',
    });
    const [dataEditCourse, setDataEditCourse] = useState({
        title: '',
        place: {
            value: '',
            label: '',
        },
        tech: { value: '', label: '' },
        type: { value: '', label: '' },
        location: { value: '', label: '' },
        expect_opening: '',
        study_time: '',
        tuition_number: '',
        image: '',
        deadline: '',
    });
    const [empty, setEmpty] = useState(false);
    const handleScroll = () => {
        let lengthScroll = window.pageYOffset;
        if (lengthScroll > 220) {
            setStyleHeader('card-header style-header-job');
        } else {
            setStyleHeader('card-header');
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return function cleanup() {
            window.removeEventListener('scroll', handleScroll);
        };
    });
    const fetchData = async () => {
        let blocksData = [];
        if (params.type == 'news') {
            try {
                const res = await api.get(`/api/news/${params.id}`);
                blocksData = res.data.content.block;
            } catch (error) {}
        } else if (params.type == 'course') {
            try {
                const res = await api.get(`/api/course/${params.id}`);
                if (res) {
                    blocksData = res.data.course.content.block;
                    setDataEditCourse({
                        title: res.data.course.title,
                        place: {
                            label: res.data.course.Location.Place.name,
                            value: res.data.course.Location.Place.id,
                            location: '',
                        },
                        tech: {
                            label: res.data.course.Technology.name,
                            value: res.data.course.Technology.id,
                        },
                        type: {
                            label: res.data.course.Type.name,
                            value: res.data.course.Type.id,
                        },
                        location: {
                            label: res.data.course.Location.name,
                            value: res.data.course.Location.id,
                        },
                        expect_opening: res.data.course.expect_opening,
                        study_time: res.data.course.study_time,
                        tuition_number: res.data.course.tuition_number,
                        deadline: res.data.course.deadline,
                        image: res.data.course.imageTitle,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else if (params.type == 'job') {
            try {
                const res = await api.get(`/api/job/${params.id}`);
                if (res) {
                    // console.log(res.data.aJob);
                    blocksData = res.data.aJob.content.block;
                    setDataEditJob({
                        title: res.data.aJob.title,
                        place: {
                            label: res.data.aJob.Place.name,
                            value: res.data.aJob.Place.id,
                        },
                        type: {
                            label: res.data.aJob.Type.name,
                            value: res.data.aJob.Type.id,
                        },
                        experience: {
                            label: res.data.aJob.experience,
                            value: res.data.aJob.experience,
                        },
                        position: {
                            label: res.data.aJob.Position.name,
                            value: res.data.aJob.Position.id,
                        },
                        rights: res.data.aJob.Rights.map((e, i) => {
                            return {
                                value: e.id,
                                label: e.content,
                            };
                        }),
                        amount: res.data.aJob.amount,
                        deadline: res.data.aJob.deadline,
                        salary_range: res.data.aJob.salary_range,
                        image: res.data.aJob.imageTitle,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        // if (editor) editor.destroy();
        editor = new EditorJS({
            data: {
                blocks: blocksData,
            },
            holder: 'editor-js',
            placeholder: 'Let`s write an awesome story!',
            tools: {
                linkTool: {
                    class: LinkTool,
                    config: {
                        endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching
                    },
                },
                raw: RawTool,
                header: {
                    class: Header,
                    inlineToolbar: ['link'],
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                image: {
                    class: ImageTool,
                    config: {
                        field: 'file',
                        endpoints: {
                            byFile: `${domainServer}/api/editor/course-image`, // Your backend file uploader endpoint
                            byUrl: `${domainServer}/api/editor/course-image-url`, // Your endpoint that provides uploading by Url
                        },
                    },
                },
            },
        });
    };

    useEffect(() => {}, []);
    useEffect(() => {
        setTypeOfCreate(params.type);
    }, []);
    useEffect(() => {
        fetchData();
    }, []);
    const uploadImage = () => {
        return new Promise((resolve, reject) => {
            if (
                typeOfCreate == 'course'
                    ? miniDataCourse.file
                    : miniDataJob.file
            ) {
                var formData = new FormData();
                formData.append(
                    'file',
                    typeOfCreate == 'course'
                        ? miniDataCourse.file
                        : miniDataJob.file
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
                    .post(
                        request_server + `/api/${typeOfCreate}-image`,
                        formData,
                        config
                    )
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
                resolve('/default-image');
            }
        });
    };
    const onSave = async () => {
        if (typeOfCreate == 'news') {
            const outputData = editor ? await editor.save() : '';
            const postDataa = {
                id: params.id,
                title: outputData.blocks[0].data.text,
                content: {
                    block: outputData.blocks,
                },
                is_show: true,
            };
            try {
                const res = await api.patch('/api/news', postDataa);
                console.log(res);
                history.push(`/list-${typeOfCreate}`);
            } catch (error) {
                console.log(error);
            }
        } else {
            if (
                Object.values(
                    typeOfCreate == 'course'
                        ? miniDataCourse
                        : typeOfCreate == 'job'
                        ? miniDataJob
                        : ''
                ).findIndex((e) => e == '' || e==null) < 0
            ) {
                setEmpty(false);
                const outputData = editor ? await editor.save() : '';
                let postDataa = {};

                if (typeOfCreate == 'course')
                    postDataa = {
                        id: params.id,
                        title: miniDataCourse.title,
                        tuition_number: miniDataCourse.tuition_number,
                        expect_opening: miniDataCourse.expect_opening,
                        study_time: miniDataCourse.study_time,
                        id_location: miniDataCourse.id_location,
                        id_type: miniDataCourse.id_type,
                        id_technology: miniDataCourse.id_technology,
                        content: { block: outputData.blocks },
                        deadline: miniDataCourse.deadline,
                        is_show: true,
                    };
                else if (typeOfCreate == 'job')
                    postDataa = {
                        id: params.id,
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
                console.log('vao dayyy');
                console.log(postDataa);
                const nameFile = await uploadImage();
                postDataa.imageTitle = nameFile;
                try {
                    const res = await api.patch(
                        `/api/${typeOfCreate}`,
                        postDataa
                    );
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
            <div className='content d-flex flex-column flex-column-fluid p-0'>
                <div
                    className='subheader py-3 py-lg-8 subheader-transparent'
                    id='kt_subheader'
                >
                    <div className='container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap'>
                        <div className='d-flex align-items-center mr-1'>
                            <div className='d-flex align-items-baseline flex-wrap mr-5'>
                                <ul className='breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0'>
                                    <li className='breadcrumb-item'>
                                        <NavLink to='/' className='text-muted'>
                                            Fetch admin
                                        </NavLink>
                                    </li>
                                    <li className='breadcrumb-item'>
                                        <NavLink
                                            to='/list-blog'
                                            className='text-muted'
                                        >
                                            Blog
                                        </NavLink>
                                    </li>
                                    <li className='breadcrumb-item'>
                                        <span
                                            className='text-muted'
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Create Post
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex flex-column-fluid'>
                    <div className='container'>
                        <div
                            className='card card-custom card-sticky'
                            id='kt_page_sticky_card'
                            style={{ minHeight: '100vh' }}
                        >
                            <div className={styleHeader}>
                                <div className='card-title'>Tin tuyển sinh</div>
                                <div className='card-toolbar'>
                                    <span
                                        onClick={() => history.goBack()}
                                        className='btn btn-light-primary font-weight-bolder mr-2'
                                    >
                                        Back
                                    </span>
                                    <div className='btn-group'>
                                        <button
                                            disabled={isDisableSave}
                                            type='button'
                                            onClick={onSave}
                                            className={
                                                // this.state.isLoading
                                                false
                                                    ? 'btn btn-primary font-weight-bolder style-btn-kitin spinner spinner-white spinner-right'
                                                    : 'btn btn-primary font-weight-bolder style-btn-kitin '
                                            }
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='card-body'>
                                <div style={{ padding: '0 30px' }}>
                                    <div className='my-5 row'>
                                        {typeOfCreate == 'course' && (
                                            <Course
                                                setMiniDataCourse={
                                                    setMiniDataCourse
                                                }
                                                empty={empty}
                                                dataEditCourse={dataEditCourse}
                                            />
                                        )}
                                        {typeOfCreate == 'job' && (
                                            <Job
                                                setMiniDataJob={setMiniDataJob}
                                                empty={empty}
                                                dataEditJob={dataEditJob}
                                            />
                                        )}
                                        <div
                                            id='editor-js'
                                            className={`${
                                                typeOfCreate == 'news'
                                                    ? 'col-md-12'
                                                    : 'col-md-8 offset-md-4'
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

export default connect(mapStateToProps)(withRouter(EditCourse));
