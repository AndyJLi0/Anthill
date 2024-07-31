import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Dashboard from './Dashboard';
import TeachersPage from './TeachersPage';

const Home = () => {
    const [user, loading, error] = useAuthState(auth);
    const [isTeacher, setIsTeacher] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDocRef = doc(db, 'users', user.email);
                try {
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setIsTeacher(userData.isTeacher);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setInitialLoading(false);
                }
            } else if (!loading && !user) {
                navigate('/login');
            }
        };

        fetchUserData();
    }, [user, loading, navigate]);

    if (loading || initialLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (user) {
        return isTeacher ? <TeachersPage user={user} /> : <Dashboard user={user} />;
    }

    return null;
};

export { Home };