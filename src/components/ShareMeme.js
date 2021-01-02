import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(0),
        maxHeight: '100%'
    },
    paper: {
        marginTop: '10%',
        marginBottom: '10%',
        marginLeft: '30%',
        marginRight: '30%',
        paddingBottom: '8px',
        paddingTop: '5px',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    list: {
        marginTop: theme.spacing(0),
        maxHeight: '85vh',
        overflow: 'auto',
    },
    option: {
        marginTop: theme.spacing(2),
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    input: {
        display: 'none',
    },
}));

export default function CreateMeme(props) {
    const classes = useStyles();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [meme, setMeme] = useState({});
    const [selectedImage, setSelectedImage] = useState(``);
    const [isSaving, setIsSaving] = useState(false);
    const[image, setImage] = useState(null);

    const handleSelectedImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setMeme({
                ...meme,
                url: img
            });
            setImage(img);
            setSelectedImage(URL.createObjectURL(img));
        }
    }

    const handleSave = async () => {
        const token = localStorage.getItem(`token-${props.user.email}`);
        
        const formData = new FormData();
        formData.append('image', meme.url);
        formData.append('content', meme.content);

        const baseUrl = `http://localhost:3010/api/v1`;
        const option = {
            method: 'post',
            url: `${baseUrl}/memes`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data'
                
            },
            data: formData
        };

        try {
            setIsSaving(true);
            const response = await axios(option);
            if (response.data) {
                setIsSaving(false);
                props.onClose(meme);
            }
        } catch(error) {
            setIsSaving(false);
            console.log('error during creating meme: ', error);
            props.onClose(meme);
        }
    };
    
    return (
        <Dialog 
            onClose = {() => props.onClose(meme)} 
            open = {props.open} 
            fullScreen={fullScreen}
        >
        
            <Grid 
                container
                direction='col'
                spacing={1}
                style={{
                    marginTop: '10px',
                    marginBottom: '5px',
                }}
            >
                <Grid item xs={12} style={{textAlign: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Share your meme
                    </Typography>
                </Grid>
                <Grid
                    item 
                    xs={12} 
                    style={{
                        marginLeft: '10%',
                        marginRight: '10%'
                    }}
                >
                    <TextField 
                        id="outlined-basic"  
                        variant="outlined"
                        size='small'
                        placeholder='Write short description...(max 100 characters)'
                        fullWidth
                        onChange={(e) => {
                            if (e.target.value.length > 100) {
                                alert('Please follow the constraint');
                            } else {
                                setMeme({
                                    ...meme,
                                    content: e.target.value
                                });
                            }
                        }}
                    />
                </Grid>
                <Grid   
                    item
                    xs={12}
                    style={{padding: 'auto'}}
                >
                    { selectedImage
                        ? <img 
                            src={selectedImage}  
                            height='300'
                            style={{ 
                                display: 'block', 
                                marginLeft: 'auto', 
                                marginRight: 'auto',
                                width: '80%'
                            }}
                        >  
                        </img>
                        : ''
                    }
                </Grid>
                <Grid   
                    item
                    xs={12}
                >
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="img-upload"
                        multiple
                        type="file"
                        onChange = { handleSelectedImage }
                    />
                    <label htmlFor="img-upload">
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            component="span"
                            style={{
                                marginTop: '10px',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '30%',
                                textAlign: 'center',
                                textTransform: 'none'
                            }}
                        >
                            Choose image
                        </Button>
                    
                    </label>
                </Grid>
                <Grid item xs={12} container style={{marginTop: '20px', textAlign: 'center'}}>
                    <Grid item xs={6}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            style={{textTransform: 'none'}}
                            onClick={handleSave}
                        >
                            { isSaving ? 'Creating...' : 'Create'}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            style={{
                                textTransform: 'none'
                            }}
                            onClick={() => props.onClose(meme)}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
}

