import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    // starting state is [null, true, undefined]
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();

    return (
        <div className="box">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {user ? (
                        <div>
                            <h2>Welcome {user.email}</h2>
                            <button onClick={() => auth.signOut()}>LOGOUT</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('./login')}>LOGIN</button>
                    )}
                </>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
}