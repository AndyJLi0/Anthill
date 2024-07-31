import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../FirebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import { Container, TextField, Button, Typography, CircularProgress, Paper, Grid, Checkbox, FormGroup, FormControlLabel, Tooltip, IconButton, Divider, Stack } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useEmail } from './EmailContext';

const Login = () => {
    const [user] = useAuthState(auth);
    const { email, setEmail } = useEmail();
    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;

    const [inputEmail, setInputEmail] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [key, setKey] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [infoMsg, setInfoMsg] = useState('');
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState('');
    const privacyMessage = 'We will collect and store your email and a cohort key to make an account specific to you. This will allow you to keep track of your progress as you work through the problem set. If you do not wish for us to store your email we will not be able to create an account for you and the app will not work as intended.';

    const handleSignInWithEmailLink = async () => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = localStorage.getItem('email') || window.prompt('Please provide your email');
            if (!email) return;

            setInitialLoading(true);
            try {
                const result = await signInWithEmailLink(auth, email, window.location.href);
                localStorage.removeItem('email');
                setEmail(email);
                createUserDocument(email);
                navigate('/');
            } catch (err) {
                setInitialError(err.message);
                navigate('/login');
            } finally {
                setInitialLoading(false);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            await sendSignInLinkToEmail(auth, inputEmail, {
                url: 'http://localhost:3000/login',
                handleCodeInApp: true,
            });
            localStorage.setItem('email', inputEmail);
            localStorage.setItem('isTeacher', isTeacher);
            localStorage.setItem('key', key);
            setInfoMsg('We have sent you an email with a link to sign in. You may safely close this window.');
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const renderContent = () => {
        if (initialLoading) return <CircularProgress />;
        if (initialError) return <Typography color="error">{initialError}</Typography>;
        if (user) return <Typography>Please wait...</Typography>;

        return (
            <Paper elevation={3} style={{ padding: 24, maxWidth: 500, margin: 'auto' }}>
                <Typography variant="h5" gutterBottom>Sign in to Your Account</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="email@domain.com"
                        type="email"
                        variant="outlined"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Teacher's Email"
                        type="text"
                        variant="outlined"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        disabled={isTeacher}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isTeacher}
                                onChange={(e) => setIsTeacher(e.target.checked)}
                                name="isTeacher"
                            />
                        }
                        label="Are you a Teacher?"
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
                    {loginError && <Typography color="error">{loginError}</Typography>}
                    {infoMsg && <Typography color="primary">{infoMsg}</Typography>}
                </form>
                <Typography variant="h6" align="center">or</Typography>
                    <Typography variant="h5" gutterBottom>Sign up with a Cohort Key</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="email@domain.com"
                            type="email"
                            variant="outlined"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Cohort Key (Optional)"
                            variant="outlined"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loginLoading}
                            style={{ margin: '16px 0' }}
                        >
                            {loginLoading ? <CircularProgress size={24} /> : 'Sign up'}
                        </Button>
                        {loginError && <Typography color="error">{loginError}</Typography>}
                        {infoMsg && <Typography color="primary">{infoMsg}</Typography>}
                    </form>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="By clicking here you agree to our Privacy Policy" />
                    </FormGroup>
                    <Stack alignItems="center" direction="row" gap={2}>
                        <Info/>
                        <Typography variant="body1">{privacyMessage}</Typography>
                    </Stack>
                </Paper>
        );
    };

    const createUserDocument = async (email) => {
        try {
            const userDocRef = doc(db, 'users', email);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                const isTeacher = localStorage.getItem('isTeacher') === 'true';
                const key = localStorage.getItem('key') || '0';
                await setDoc(userDocRef, {
                    key: key,
                    isTeacher: isTeacher
                });
                console.log('User document created');
                localStorage.removeItem('isTeacher');
                localStorage.removeItem('key');
            } else {
                console.log('User document already exists.');
            }
        } catch (e) {
            console.error('Error creating user document: ', e);
        }
    };

    useEffect(() => {
        handleSignInWithEmailLink();
    }, [user, navigate, search, setEmail]);

    return (
        <Container>
            <Grid container justifyContent="center" style={{ height: '100vh', alignItems: 'center' }}>
                {renderContent()}
            </Grid>
        </Container>
    );
};

export { Login };
