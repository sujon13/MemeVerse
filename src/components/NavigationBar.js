import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CreateMeme from './ShareMeme';

import {
    useHistory
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
    },
}));

export default function NavigationBar(props) {
    const classes = useStyles();

    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        console.log('user will logged out');
        localStorage.clear();
        history.push('/signin');
    }

    const handleClose = (profile) => {
        console.log('profile', profile);
        setOpen(false);
    };

    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Meme Verse
                </Typography>
                {
                    props.isSignedIn === true
                        ? <React.Fragment>
                            <Avatar 
                                className={classes.orange}
                                onClick = { (e) => setAnchorEl(e.currentTarget) }
                            >
                                {props.user.name[0]}
                            </Avatar>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                            </Menu>
                            <Button 
                                style={{textTransform: 'none', marginLeft: '10px'}}
                                color='inherit'
                                variant='outlined'
                                onClick = {() => setOpen(true)}
                            >
                                Upload
                            </Button>
                            <CreateMeme user={props.user} open={open} onClose={handleClose} />
                            </React.Fragment> 
                        : <React.Fragment>
                            <Button 
                                color='inherit'
                                style={{textTransform: 'none'}}
                                onClick = {() => {
                                    history.push('/signin');
                                }}
                            >
                                Login
                            </Button>
                            <Button 
                                color='inherit'
                                style={{textTransform: 'none'}}
                                onClick = {() => {
                                    history.push('/signup');
                                }}
                            >
                                Signup
                            </Button>
                            </React.Fragment>

                }
            </Toolbar>
        </AppBar>
    );
}