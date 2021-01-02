import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Helmet } from 'react-helmet';
import {
    useHistory
} from 'react-router-dom';

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

export default function PasswordReset(props) {
    const classes = useStyles();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  

  
    return (
        <Container component="main" maxWidth="xs">
            <Helmet>
                <title> Sign In</title>
            </Helmet>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Reset Password
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
                        label="New Password"
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
                    >
                        {   
                            isLoading ? 'Resetting Password..' : 'Reset Password'
                        }
                    </Button>
                </form>
            </div>
        </Container>
    );
}