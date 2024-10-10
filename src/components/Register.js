import React, { useState } from 'react';
import { ref as dbRef, push } from 'firebase/database';
import { Database } from '../firebase'; // Assuming Firebase is configured
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Register.css';

const Register = () => {
    const [nama, setNama] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    // Handle form submission for registration
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nama || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        // Reference to the 'Login' node in Firebase Realtime Database
        const loginRef = dbRef(Database, 'Login');

        // Add new user data to the database with default role 'user'
        push(loginRef, {
            Nama: nama,
            Password: password,
            Role: 'user' // Default role is 'user'
        })
        .then(() => {
            setSuccessMessage('Registration successful! Redirecting to login...');
            setErrorMessage('');

            // Delay for 2 seconds before navigating to login page
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 2000);
        })
        .catch((error) => {
            console.error("Error saving user to the database:", error);
            setErrorMessage("Error registering. Please try again.");
        });
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
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
                <button type="submit">Register</button>
            </form>

            {/* Display success or error messages */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Register;
