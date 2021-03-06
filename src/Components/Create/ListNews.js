import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import Fbloader from '../libs/PageLoader/fbloader.js';
import { Link } from 'react-router-dom';
import Network from '../../Service/Network';
import moment from 'moment';
import CustomToast from '../common/CustomToast';
import { toast } from 'react-toastify';
import Pagination from 'rc-pagination';
const api = new Network();
const domainFetchTech = 'https://fetch.tech';

function ListNews(props) {
    const [open, setOpen] = useState(false);
    const [mess, setMess] = useState('this is message');
    const [mystate, setMystate] = useState(['id', true]);
    const [listNews, setListNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0,
    });

    const submitDestroy = async (id, is_show) => {
        try {
            const res = await api.patch('/api/news', {
                id: id,
                is_show: !is_show,
            });
            await fetchData();
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    const openCourse = async (blog) => {
        window.open(
            `${domainFetchTech}/blog/${blog.slug}-${blog.id}`,
            '_blank'
        );
    };
    const fetchData = async () => {
        try {
            const response = await api.get(`/api/news-admin`);
            if (response) {
                setListNews((state) => response.data.listNews);
            }
        } catch (error) {
            setIsLoading(false);
            console.log('err while fetch list blog', error);
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
            setMess('Are you sure to hide this post!!!');
        } else if (mystate[1] === false) {
            setMess('Are you sure to display this post!!!');
        }
        setOpen(true);
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    {'Confirmation ?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {mess}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCloseAndSubmit}
                        color='primary'
                        autoFocus
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <div
                className={`d-flex flex-column flex-row-fluid wrapper ${props.className_wrap_broad}`}
            >
                {isLoading ? <Fbloader /> : null}
                <div className='content d-flex flex-column flex-column-fluid'>
                    <div
                        className='subheader py-3 py-lg-8 subheader-transparent'
                        id='kt_subheader'
                    >
                        <div className='container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap'>
                            <div className='d-flex align-items-center mr-1'>
                                <div className='d-flex align-items-baseline flex-wrap mr-5'>
                                    <ul className='breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0'>
                                        <li className='breadcrumb-item'>
                                            <Link to='/' className='text-dark'>
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className='breadcrumb-item'>
                                            <div className='text-dark'>
                                                List News
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className='d-flex align-items-center flex-wrap'></div>
                        </div>
                    </div>
                    <div className='d-flex flex-column-fluid'>
                        <div className='container'>
                            <div className='card card-custom'>
                                <div className='card-header flex-wrap border-0 pt-6 pb-0'>
                                    <div className='card-title'>
                                        <h3 className='card-label'>
                                            List News
                                        </h3>
                                    </div>
                                    <div className='card-toolbar'>
                                        <div className='dropdown dropdown-inline mr-2'></div>

                                        <Link
                                            to={'/post'}
                                            className='btn btn-primary font-weight-bolder'
                                        >
                                            <span className='svg-icon svg-icon-md'>
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    xmlnsXlink='http://www.w3.org/1999/xlink'
                                                    width='24px'
                                                    height='24px'
                                                    viewBox='0 0 24 24'
                                                    version='1.1'
                                                >
                                                    <g
                                                        stroke='none'
                                                        strokeWidth={1}
                                                        fill='none'
                                                        fillRule='evenodd'
                                                    >
                                                        <rect
                                                            x={0}
                                                            y={0}
                                                            width={24}
                                                            height={24}
                                                        />
                                                        <circle
                                                            fill='#000000'
                                                            cx={9}
                                                            cy={15}
                                                            r={6}
                                                        />
                                                        <path
                                                            d='M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z'
                                                            fill='#000000'
                                                            opacity='0.3'
                                                        />
                                                    </g>
                                                </svg>
                                            </span>
                                            New Post
                                        </Link>
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <div className='row p-0 pb-5'></div>

                                    <div
                                        className='datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded'
                                        id='kt_datatable'
                                        style={{ position: 'static', zoom: 1 }}
                                    >
                                        <table
                                            className='datatable-table'
                                            style={{ display: 'block' }}
                                        >
                                            <thead className='datatable-head'>
                                                <tr
                                                    className='datatable-row'
                                                    style={{
                                                        left: '0px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <th
                                                        data-field='OrderID'
                                                        className='datatable-cell datatable-cell-sort'
                                                        style={{ width: '15%' }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: '',
                                                            }}
                                                        >
                                                            Title
                                                        </span>
                                                    </th>
                                                    <th
                                                        data-field='OrderID'
                                                        className='datatable-cell datatable-cell-sort'
                                                        style={{ width: '15%' }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: '',
                                                            }}
                                                        >
                                                            Ng??y ????ng
                                                        </span>
                                                    </th>
                                                    <th
                                                        data-field='Type'
                                                        data-autohide-disabled='false'
                                                        className='datatable-cell datatable-cell-sort hide_mb'
                                                        style={{ width: '10%' }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: '',
                                                            }}
                                                        >
                                                            Enable
                                                        </span>
                                                    </th>
                                                    <th
                                                        data-field='Actions'
                                                        data-autohide-disabled='false'
                                                        className='datatable-cell datatable-cell-sort hide_mb'
                                                        style={{ width: '10%' }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: '',
                                                            }}
                                                        >
                                                            Actions
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody
                                                className='datatable-body'
                                                style={{}}
                                            >
                                                {listNews.map(
                                                    (course, index) => {
                                                        return (
                                                            <React.Fragment
                                                                key={index}
                                                            >
                                                                <tr
                                                                    data-row={1}
                                                                    className='datatable-row datatable-row-even'
                                                                    style={{
                                                                        left:
                                                                            '0px',
                                                                        textAlign:
                                                                            'center',
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <td
                                                                        data-field='OrderID'
                                                                        aria-label='63868-257'
                                                                        className='datatable-cell'
                                                                        style={{
                                                                            width:
                                                                                '15%',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            //   onClick={() => openCourse(blog)}
                                                                            className='text-hover-primary'
                                                                            style={{
                                                                                width:
                                                                                    '',
                                                                                cursor:
                                                                                    'pointer',
                                                                            }}
                                                                        >
                                                                            {
                                                                                course.title
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td
                                                                        data-field='OrderID'
                                                                        aria-label='63868-257'
                                                                        className='datatable-cell'
                                                                        style={{
                                                                            width:
                                                                                '15%',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            //   onClick={() => openCourse(blog)}
                                                                            className='text-hover-primary'
                                                                            style={{
                                                                                width:
                                                                                    '',
                                                                                cursor:
                                                                                    'pointer',
                                                                            }}
                                                                        >
                                                                            {moment(
                                                                                course.createdAt
                                                                            ).format(
                                                                                'DD-MM-YYYY'
                                                                            )}
                                                                        </span>
                                                                    </td>

                                                                    <td
                                                                        data-field='Status'
                                                                        aria-label={
                                                                            1
                                                                        }
                                                                        className='datatable-cell hide_mb'
                                                                        style={{
                                                                            width:
                                                                                '10%',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            <span className='switch switch-outline switch-icon switch-primary'>
                                                                                <label
                                                                                    style={{
                                                                                        margin:
                                                                                            '0 auto',
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type='checkbox'
                                                                                        checked={
                                                                                            course.is_show
                                                                                        }
                                                                                        name='isShow'
                                                                                        onChange={() => {
                                                                                            setMystate(
                                                                                                [
                                                                                                    course.id,
                                                                                                    course.is_show,
                                                                                                ]
                                                                                            );
                                                                                            handleOpen();
                                                                                        }}
                                                                                    />
                                                                                    <span></span>
                                                                                </label>
                                                                            </span>
                                                                        </span>
                                                                    </td>

                                                                    <td
                                                                        data-field='Actions'
                                                                        data-autohide-disabled='false'
                                                                        aria-label='null'
                                                                        className='datatable-cell hide_mb'
                                                                        style={{
                                                                            width:
                                                                                '10%',
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                overflow:
                                                                                    'visible',
                                                                                position:
                                                                                    'relative',
                                                                                width:
                                                                                    '',
                                                                            }}
                                                                        >
                                                                            <Link
                                                                                to={`/edit/news/${course.id}`}
                                                                                className='btn btn-sm btn-clean btn-icon mr-2'
                                                                                title='Edit blog'
                                                                            >
                                                                                <span className='svg-icon svg-icon-md'>
                                                                                    <svg
                                                                                        xmlns='http://www.w3.org/2000/svg'
                                                                                        xmlnsXlink='http://www.w3.org/1999/xlink'
                                                                                        width='24px'
                                                                                        height='24px'
                                                                                        viewBox='0 0 24 24'
                                                                                        version='1.1'
                                                                                    >
                                                                                        <g
                                                                                            stroke='none'
                                                                                            strokeWidth={
                                                                                                1
                                                                                            }
                                                                                            fill='none'
                                                                                            fillRule='evenodd'
                                                                                        >
                                                                                            <rect
                                                                                                x={
                                                                                                    0
                                                                                                }
                                                                                                y={
                                                                                                    0
                                                                                                }
                                                                                                width={
                                                                                                    24
                                                                                                }
                                                                                                height={
                                                                                                    24
                                                                                                }
                                                                                            />
                                                                                            <path
                                                                                                d='M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z'
                                                                                                fill='#000000'
                                                                                                fillRule='nonzero'
                                                                                                transform='translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) '
                                                                                            />
                                                                                            <path
                                                                                                d='M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z'
                                                                                                fill='#000000'
                                                                                                fillRule='nonzero'
                                                                                                opacity='0.3'
                                                                                            />
                                                                                        </g>
                                                                                    </svg>
                                                                                </span>{' '}
                                                                            </Link>
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                        <div className='datatable-pager datatable-paging-loaded fl_end'>
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

export default connect(mapStateToProps)(ListNews);
