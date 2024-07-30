import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth, db } from '../../../shared/FirebaseConfig.js';
// import { auth } from 'src/FirebaseConfig.js';
// import { auth, db } from '../FirebaseConfig';
import { auth, db } from '../FirebaseConfig';



import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
import { Container, TextField, Button, Typography, CircularProgress, Paper, Grid } from '@mui/material';
import { useEmail } from './EmailContext';

const Login = () => {
    const [user] = useAuthState(auth);
    const { email, setEmail } = useEmail();

    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;

    const [inputEmail, setInputEmail] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [infoMsg, setInfoMsg] = useState('');
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState('');

    useEffect(() => {
        if (user) {
            createUserDocument(user);
            navigate('/');
            return;
        }

        if (isSignInWithEmailLink(auth, window.location.href)) {
            let email = localStorage.getItem('email') || window.prompt('Please provide your email');
            if (!email) return;

            setInitialLoading(true);
            signInWithEmailLink(auth, email, window.location.href)
                .then(result => {
                    localStorage.removeItem('email');
                    setEmail(email); // SET EMAIL HERE
                    createUserDocument(result.user);
                    navigate('/');

                })
                .catch(err => {
                    setInitialError(err.message);
                    navigate('/login');
                })
                .finally(() => setInitialLoading(false));
        }
    }, [user, navigate, search, setEmail]);

    const handleLogin = async (e) => {
        createUserDocument(user);
        e.preventDefault();
        setLoginLoading(true);
        try {
            await sendSignInLinkToEmail(auth, inputEmail, {
                url: 'http://localhost:3000/login',
                handleCodeInApp: true,
            });
            localStorage.setItem('email', inputEmail);
            setInfoMsg('We have sent you an email with a link to sign in');
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
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
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
};

const createUserDocument = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        // create a new document for the user
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          // add other default fields here
        });
        console.log('User document created');
      } else {
        console.log('User document already exists.');
      }
    } catch (e) {
      console.error('Error creating user document: ', e);
    }
  };

export { Login };
