import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../../../shared/FirebaseConfig.js';
// import { auth } from '../FirebaseConfig.js';
// import { auth } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';



import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';


import Dashboard from './Dashboard';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Dashboard user={user} />;
    }

    return null;
};

export { Home };