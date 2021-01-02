import React, { useEffect, useState, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import { isEmpty } from 'lodash';
import {
    Link,
    useHistory
} from 'react-router-dom';

import { hasInternetConnection, formatTime } from '../util';

const LIMIT = 5;

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
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

export default function MemeList(props) {
    const classes = useStyles();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [memeList, setMemeList] = useState([]);
    const [userLikedList, setUserLikedList] = useState([]);
    const [enableComment, setEnableComment] = useState(false);
    const [content, setContent] = useState('');

    const loadUserLikedList = async (memeList) => {
        const baseUrl = `http://localhost:3010/api/v1`;
        const token = localStorage.getItem(`token-${props.user.email}`);
        console.log('user', props.user);
        console.log('token', token);

        const option = {
            method: 'get',
            url: `${baseUrl}/memes/like`,
            params: {
                memeIdList: memeList.map((meme) => meme._id),
            },
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };

        try {
            const response = await axios(option);
            if (response.data) {
                console.log(response.data);
                setUserLikedList([...response.data]);
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data);
            }
        }
    }

    const removeDuplicate = (incomingMemeList) => {
        const newMemeList = [];
        for(const incomingMeme of incomingMemeList) {
            let noMatch = true;
            for(const meme of memeList) {
                if (meme._id === incomingMeme._id) {
                    noMatch = false; break;
                }
            }
            if (noMatch)newMemeList.push(incomingMeme);
        }
        return newMemeList;
    }

    const loadMemeList = async () => {
        const baseUrl = `http://localhost:3010/api/v1`;
        const option = {
            method: 'get',
            url: `${baseUrl}/memes`,
            params: {
                page: ( memeList.length / LIMIT ) + 1
            }
        };

        setIsLoading(true);
        localStorage.setItem('noData', 'false');
        try {
            const response = await axios(option);
            if (response.data) {
                setIsLoading(false);
                console.log(response.data);
                if (response.data.length === 0) {
                    localStorage.setItem('noData', 'true');
                } else {
                    const filteredData = removeDuplicate(response.data);
                    if (filteredData.length === 0)localStorage.setItem('noData', 'true');
                    else {
                        setMemeList(
                            memeList.concat(
                                filteredData
                            )
                        );
                    }
                }
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data);
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadMemeList();
    }, []);

    useEffect(() => {
        if (isEmpty(props.user) || props.user === undefined) {
        } else {
            setEnableComment(true);
        }
    });

    useEffect(() => {
        if (memeList.length) {
            loadUserLikedList(memeList);
        }
    }, [memeList]);

    const updateLocalLikedList = (meme) => {
        console.log(meme._id);
        let increment = true;
        for(let i = 0; i < userLikedList.length; i++) {
            if (meme._id == userLikedList[i].memeId) {
                console.log('match found for userLikedList');
                const newValue = userLikedList[i].alreadyLiked ? false : true;
                increment = newValue;
                const copy = [...userLikedList];
                copy[i] = { 
                    ...copy[i], 
                    alreadyLiked: newValue
                };
                setUserLikedList(copy);
                break;
            }
        }
        return increment;

    }

    const updateLocalMemeList = (meme, increment = true) => {
        for(let i = 0; i < memeList.length; i++) {
            if (meme._id == memeList[i]._id) {
                console.log('match found for memeList');
                const newValue = increment === true 
                    ? memeList[i].numOfLikes.valueOf() + 1
                    : memeList[i].numOfLikes.valueOf() - 1;
                const copy = [...memeList];
                copy[i] = {
                    ...copy[i],
                    numOfLikes: newValue
                };
                setMemeList(copy);
                break;  
            }
        }
    }

    const isAlreadyLiked = (memeId) => {
        let alreadyLiked = false;
        for(const like of userLikedList) {
            if (like.memeId == memeId) {
                alreadyLiked = like.alreadyLiked;
                break;
            }
        }
        return alreadyLiked;
    }

    const updateMeme = async (meme, like=true, contnet = '') => {
        const token = localStorage.getItem(`token-${props.user.email}`);
        const option = {
            method: 'patch',
            url: `http://localhost:3010/api/v1/memes/${meme._id}`,
            data: {
                like: like,
                comment: !like,
                content: content
            },
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        };

        try {
            const response = await axios(option);
            if (response.status >= 200 && response.status < 300) {
                console.log('updated user"s info');
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError(error.response.data);
            }
        }
    }

    const handleLike = async (meme) => {
        if (isEmpty(props.user) || props.user === undefined) {
            alert('Please log in first');
            return;
        }
        const increment = updateLocalLikedList(meme);
        updateLocalMemeList(meme, increment);
        updateMeme(meme);
    }

    const updateLocalMemeListForComment = (meme) => {
        for(let i = 0; i < memeList.length; i++) {
            if (meme._id == memeList[i]._id) {
                console.log('match found for memeList');
                const copy = [...memeList];
                copy[i] = {
                    ...copy[i],
                    numOfComments: memeList[i].numOfComments.valueOf() + 1
                };
                setMemeList(copy);
                break;  
            }
        }
    }

    const handleComment = meme => {
        if (isEmpty(props.user) || props.user === undefined) {
            alert('Please log in first');
            return;
        }
    }

    const handleCommentButton = async (meme) => {
        updateLocalMemeListForComment(meme);
        console.log('comment', content);
        updateMeme(meme, false, content); 
        setContent('');
    }

    const handleScroll = (e) => {
        let element = e.target;
        //console.log(element.scrollTop, element.scrollHeight);
    
        if (element.scrollTop >= element.scrollHeight - 500) {
            console.log('scrolled to bottom');
            if (localStorage.getItem('noData') === 'true'){
                console.log('no more data to fetch');
            } else {
                loadMemeList();
            }
        }
    }

    if (isLoading) {
        return (
            <div style={{textAlign: 'center'}}><CircularProgress/></div>
        );
    }

    return (
        <div>
            <Grid 
                id='container'
                container 
                direction="col" 
                spacing={2} 
                style={{ 
                    marginTop: '20px',
                    maxHeight: '85vh',
                    overflow: 'auto',
                }}
                onScroll={handleScroll}   
            >
            
                {
                    memeList.map((meme, index) => 
                        <Grid item xs={12} key={index.toString()}>
                            <Paper 
                                elevation={3}
                                style={{
                                    marginLeft: '20%',
                                    marginRight: '20%',
                                }}
                            >
                                <Grid container direction='col' style={{padding: '10px'}} spacing={1}>                                           
                                    <Grid container item xs={12}>
                                        <Grid item xs={1}>
                                            <Avatar className={classes.small}>
                                                {meme?.owner?.name[0]}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <Typography variant="subtitle2">
                                                {meme?.owner?.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">
                                                {formatTime(meme?.sharedAt)}
                                            </Typography>
                                        </Grid>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="inherit" component="h3">
                                            {meme?.content}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <img 
                                            src={`http://localhost:3010/${meme.url}`}  
                                            height='300'
                                            style={{ 
                                                display: 'block', 
                                                marginTop: '10px',
                                                marginLeft: 'auto', 
                                                marginRight: 'auto',
                                                width: '100%',
                                                border: '1px solid black'
                                            }}
                                        />  
                                    </Grid>
                                    <Grid container item xs={12}>
                                        <Grid container item direction='col' xs={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2">
                                                    {meme.numOfLikes} {meme.numOfLikes === 1 ? 'like' : 'likes'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    variant='contained' 
                                                    color={isAlreadyLiked(meme._id) ? 'primary' : 'default'}
                                                    style={{textTransform: 'none'}}
                                                    onClick={() => handleLike(meme)}
                                                >
                                                    Like
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid container item direction='col' xs={4}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2">
                                                    {meme.numOfComments} {meme.numOfComments === 1 ? 'comment' : 'comments'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    variant='contained' 
                                                    color='default'
                                                    style={{textTransform: 'none'}}
                                                    onClick = {() => handleComment(meme)}
                                                >
                                                    Show Comments
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {
                                        enableComment ?
                                        <Grid item xs={12} container>
                                            <Grid item xs={10}>
                                                <TextField 
                                                    value={content}
                                                    id="comment"  
                                                    variant="outlined"
                                                    size='small'
                                                    placeholder='add your comment here...(max 100 characters)'
                                                    fullWidth
                                                    onChange={(e) => {
                                                        if (e.target.value.length > 100) {
                                                            alert('Please follow the constraint');
                                                        } else {
                                                            setContent(e.target.value);
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Button 
                                                    variant='outlined'
                                                    color='primary'
                                                    style={{textTransform: 'none'}}
                                                    onClick={() => {
                                                        handleCommentButton(meme);
                                                    }}
                                                > 
                                                   Send
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        : ''
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    )
                }
            </Grid>
        </div>
    );
}