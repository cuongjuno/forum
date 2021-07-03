import React from "react";
import Create from "./Components/Create";
import EditCourse from "./Components/Create/EditCourse";
import ListCourse from './Components/Create/ListCourse'
import ListJob from './Components/Create/ListJob'
import ListNews from "./Components/Create/ListNews";
import ListCandidate from "./Components/Create/Listcandidate";

const routes = [
    {
        path: '/',
        exact: true,
        main: (props) => <Create {...props} />,
    },
    {
        path: '/post',
        exact: true,
        main: (props) => <Create {...props} />,
    },
    {
        path: '/post/:type',
        main: (props) => <Create {...props} />,
    },
    {
        path: '/list-course',
        exact: true,
        main: (props) => <ListCourse {...props} />,
    },
    {
        path: '/list-job',
        exact: true,
        main: (props) => <ListJob {...props} />,
    },
    {
        path: '/list-news',
        exact: true,
        main: (props) => <ListNews {...props} />,
    },
    {
        path: '/edit/:type/:id',
        main: (props) => <EditCourse {...props} />,
    },
    {
        path: '/list-candidate',
        exact: true,
        main: (props) => <ListCandidate {...props} />,
    },
];

export default routes;
