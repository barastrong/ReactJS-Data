import React, { useState } from 'react';
import { ref as dbRef, get, update } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [nama, setNama] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Reference to the 'Login' node in Firebase
        const loginRef = dbRef(Database, 'Login');

        get(loginRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const user = Object.values(users).find(
                    (u) => u.Nama === nama && u.Password === password
                );

                if (user) {
                    // Successful login: Update isLoggedIn status
                    const userKey = Object.keys(users).find(key => users[key].Nama === nama);
                    const userRef = dbRef(Database, `Login/${userKey}`);

                    update(userRef, { isLoggedIn: true }).then(() => {
                        // Redirect based on role
                        if (user.Role === 'admin') {
                            navigate('/home');
                        } else  {
                            navigate('/nambah');
                        }
                    });
                } else {
                    setErrorMessage('Invalid username or password.');
                }
            } else {
                setErrorMessage('No users found in the database.');
            }
        }).catch((error) => {
            console.error('Error during login:', error);
        });
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Nama:
                    <input 
                        type="text" 
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Login</button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Login;
