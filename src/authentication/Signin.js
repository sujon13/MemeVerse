import React, { useState } from 'react';
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
import {
    Link,
    useHistory
} from 'react-router-dom';

import { hasInternetConnection } from './../util';

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

export default function SignIn(props) {
    const classes = useStyles();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});
    const [data, setData] = useState({});

    const saveSigninDataToLocalStorage = data => {
        localStorage.setItem(`token-${data?.profile?.email}`, data?.accessToken);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!hasInternetConnection(true))return;
        setError('');
        
        const baseUrl = `http://localhost:3010/api/v1`;
        const option = {
            method: 'post',
            url: `${baseUrl}/users/signin`,
            data: {
                email: email,
                password: password
            }
        };

        setPassword('');
        setIsLoading(true);
        try {
            const response = await axios(option);
            if (response.data) {
                console.log(`signin: `, response.data);
                setData(response.data);
                setIsLoading(false);
                saveSigninDataToLocalStorage(response.data);
                history.push('/home', response.data);
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data);
            }
            setIsLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Helmet>
                <title> Sign In</title>
            </Helmet>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar} src='ICON'/>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} autoComplete='off'>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    { error && 
                        <Grid item xs={12}>
                            <div style={{color: 'red'}}>{error}</div>
                        </Grid>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        style={{textTransform: 'none'}}
                        onClick={handleSubmit}
                    >
                        {   
                            isLoading ? 'Singing In..' : 'Sign In'
                        }
                    </Button>
                    <Grid container>
                        <Grid item style={{margin: 'auto'}}>
                            <Link to="/signup" variant="body2">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}