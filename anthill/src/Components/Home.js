import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [user, loading, error] = useAuthState(auth);

    console.log(error);

    const navigate = useNavigate();

    // logs out user
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/');
        }).catch((err) => {
        })
    }
    const renderContent = () => {
        // if user is loading
        if (loading) {
            return <div>Loading...</div>;
        }
        // logged in
        if (user) {
            return (
                <>
                    <button className='btn btn-secondary btn-md' onClick={handleLogout}>
                        LOGOUT
                    </button>
                    <h3>Welcome {user.email}</h3>
                </>
            );
        }
        // not logged in
        return (
            <button className='btn btn-primary btn-md' onClick={() => navigate('/login')}>
                LOGIN
            </button>
        );
    };

    return <div className='box'>{renderContent()}</div>;

}

export { Home };