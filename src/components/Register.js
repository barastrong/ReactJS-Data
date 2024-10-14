import React, { useState } from 'react';
import { ref as dbRef, push } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [nisn, setNisn] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nisn || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const nisnNumber = Number(nisn);

        if (isNaN(nisnNumber)) {
            setErrorMessage("NISN must be a valid number.");
            return;
        }

        const loginRef = dbRef(Database, 'Login');

        push(loginRef, {
            Nisn: nisnNumber,
            Password: password,
            Role: 'user'
        })
        .then(() => {
            setSuccessMessage('Registration successful! Redirecting to login...');
            setErrorMessage('');

            setTimeout(() => {
                navigate('/login');
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
                    NISN:
                    <input
                        type="text"
                        value={nisn}
                        onChange={(e) => setNisn(e.target.value)}
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

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Register;
