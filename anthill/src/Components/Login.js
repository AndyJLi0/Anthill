import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../FirebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
export const Login = () => {

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
            console.log('User is logged in');
            navigate('/');
        } else {
            // user is not signed in

            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('email');
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }

                setInitialLoading(true);
                signInWithEmailLink(auth, email, window.location.href)
                    .then((result) => {
                        window.localStorage.removeItem('email');
                        setInitialLoading(false);
                        setInitialError('');
                        navigate('/');
                    })
                    .catch((error) => {
                        setInitialLoading(false);
                        setInitialError(error.message);
                        navigate('/login');
                    });
            }
        }
    }, [user, search, navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            await sendSignInLinkToEmail(auth, email, {
                url: 'http://localhost:3000',  // Ensure this URL is authorized in your Firebase Console
                handleCodeInApp: true,
            });
            window.localStorage.setItem('email', email);
            setLoginLoading(false);
            setLoginError('');
            setInfoMsg('Email sent. Please check your email.');
            console.log('Email sent successfully');
        } catch (error) {
            setLoginLoading(false);
            setLoginError(error.message);
            console.error('Error sending email link:', error);
        }
    };

    return (
        <div>
            {initialLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {initialError !== '' ? (
                        <div>{initialError}</div>
                    ) : (
                        <>
                            {user ? (
                                <div> you will be redirected shortly...</div>
                            ) : (
                                <form onSubmit={handleLogin}>
                                    <label>Email</label>

                                    <input type={"email"} required placeholder="Enter Email"
                                        value={email || ''} onChange={(e) => setEmail(e.target.value)} />

                                    <button type="submit">
                                        {loginLoading ? (
                                            <span>Logging you in </span>
                                        ) : (
                                            <span>Login</span>
                                        )}
                                    </button>

                                    {loginError && <div>{loginError}</div>}
                                    {infoMsg && <div>{infoMsg}</div>}


                                </form>
                            )}
                        </>
                    )}
                </>

            )}

        </div>
    )
}