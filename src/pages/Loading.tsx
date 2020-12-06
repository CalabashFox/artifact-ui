import React, {ReactElement} from 'react';
import {CircularProgress, Container, makeStyles, Typography} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        minHeight: '100vh'
    },
    title: {
        marginBottom: theme.spacing(5),
    }
}));

export default function Loading(): ReactElement {

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h3" className={classes.title}>
                    Logging in
                </Typography>
                <CircularProgress size={80} thickness={5}/>
            </div>
        </Container>
    );
}