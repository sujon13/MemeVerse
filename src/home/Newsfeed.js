import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import axios from 'axios';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';
import {
    Link,
    useHistory
} from 'react-router-dom';

import { hasInternetConnection } from '../util';
import NavigationBar from '../components/NavigationBar';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        //backgroundColor: 'red',
        width: theme.spacing(10),
        height: theme.spacing(10),
        margin: 'auto',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Newsfeed(props) {
    const classes = useStyles();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});
    const [isSignedIn, setIsSignedIn] = useState(false);

    const userSignedIn = async (token) => {
        const baseUrl = `http://localhost:3010/api/v1`;
        const option = {
            method: 'get',
            url: `${baseUrl}/auth`,
            headers: {
                Authorization: 'Bearer ' + token
            }
        };

        try {
            const response = await axios(option);
            if (response.status === 200) {
                setIsSignedIn(true);
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data);
            }
        }
    }

    useEffect(() => {
        const data = history.location.state;
        const user = data?.profile;
        const token = data?.accessToken;
        console.log(`user info: `, user);
        userSignedIn(token);
        setUser(user);
    }, []);

    if(isEmpty(user) || user === undefined) {
        return(
            <div>
                <Helmet>
                    <title> Meme</title>
                </Helmet>
                <NavigationBar isSignedIn = {isSignedIn} user = {user}/>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title> Home</title>
            </Helmet>
            <NavigationBar isSignedIn = {isSignedIn} user = {user}/>
            HAHA
        </div>
    );
}