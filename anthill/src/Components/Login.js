import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../FirebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import { Container, TextField, Button, Typography, CircularProgress, Paper, Box, Grid } from '@mui/material';

const Login = () => {
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;

    const [email, setEmail] = useState('');

    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [infoMsg, setInfoMsg] = useState('');

    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState('');

    useEffect(() => {
        if (user) {
            // user is already signed in
            navigate('/');
        } else {
            // user is not signed in but the link is valid
            if (isSignInWithEmailLink(auth, window.location.href)) {
                // now in case user clicks the email link on a different device, we will ask for email confirmation
                let email = localStorage.getItem('email');
                if (!email) {
                    email = window.prompt('Please provide your email');
                }
                // after that we will complete the login process
                setInitialLoading(true);
                signInWithEmailLink(auth, email, window.location.href)
                    .then((result) => {
                        // we can get the user from result.user but no need in this case
                        console.log(result.user);
                        localStorage.removeItem('email');
                        setInitialLoading(false);
                        setInitialError('');
                        navigate('/');
                    }).catch((err) => {
                        setInitialLoading(false);
                        setInitialError(err.message);
                        navigate('/login');
                    })
            } else {
                console.log('enter email and sign in');
            }
        }
    }, [user, search, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginLoading(true);
        sendSignInLinkToEmail(auth, email, {
            // this is the URL that we will redirect back to after clicking on the link in mailbox
            url: 'http://localhost:3000/login',
            handleCodeInApp: true,
        }).then(() => {
            localStorage.setItem('email', email);
            setLoginLoading(false);
            setLoginError('');
            setInfoMsg('We have sent you an email with a link to sign in');
        }).catch(err => {
            setLoginLoading(false);
            setLoginError(err.message);
        })
    }

    const renderContent = () => {
        // loading
        if (initialLoading) {
            return <CircularProgress />;
        }
        // error
        if (initialError !== '') {
            return <Typography color="error">{initialError}</Typography>;
        }
        // logged in but redirecting to home
        if (user) {
            return <Typography>Please wait...</Typography>;
        }
        // first time users
        return (
            <Paper elevation={3} style={{ padding: 24, maxWidth: 500, margin: 'auto' }}>
                <Typography variant="h5" gutterBottom>Sign in to Your Account</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loginLoading}
                        style={{ margin: '16px 0' }}
                    >
                        {loginLoading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                    {loginError !== '' && <Typography color="error">{loginError}</Typography>}
                    {infoMsg !== '' && <Typography color="primary">{infoMsg}</Typography>}
                </form>
            </Paper>
        );
    };

    return (
        <Container>
            <Grid container justifyContent="center" style={{ height: '100vh', alignItems: 'center' }}>
                {renderContent()}
            </Grid>
        </Container>
    );
}

export { Login };