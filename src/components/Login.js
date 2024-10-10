import React, { useState } from 'react';
import { get, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { Database } from '../firebase'; // Assuming Firebase is configured
import './Login.css';

const Login = () => {
    const [nama, setNama] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle form submission for login
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if nama and password are filled
        if (!nama || !password) {
            setErrorMessage("Please enter both Nama and Password.");
            return;
        }

        // Reference to the 'Login' node in Firebase Realtime Database
        const loginRef = ref(Database, 'Login');
        get(loginRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    // Find the user based on the entered Nama
                    const foundUser = Object.values(users).find((user) => user.Nama === nama);
                    if (foundUser && foundUser.Password === password) {
                        // Successful login, check the role
                        if (foundUser.Role === 'admin') {
                            // Navigate to admin page
                            navigate('/');
                        } else if (foundUser.Role === 'user') {
                            // Navigate to user page
                            navigate('/nambah');
                        } else {
                            setErrorMessage("Invalid role.");
                        }
                    } else {
                        setErrorMessage("Incorrect Nama or Password.");
                    }
                } else {
                    setErrorMessage("No user data found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching login data:", error);
                setErrorMessage("Error during login.");
            });
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nama:
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Login;
