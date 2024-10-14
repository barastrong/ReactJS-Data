import React, { useState } from 'react';
import { ref as dbRef, get, update } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [nisn, setNisn] = useState(''); // nisn input
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        // Mencegah apabila terjadi relog form
        e.preventDefault();
        setErrorMessage('');

        const loginRef = dbRef(Database, 'Login');

        get(loginRef).then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();

                // Mengambil data dari firebase dengan database bernama "users"
                console.log("Users from Firebase:", users);

                // Menjadikan nisn menjadi integer karena dalam database yang tersimpan merupakan integer
                const inputNisn = String(nisn);

                // Mencari user yang sama dengan nomer input yang di form
                const user = Object.values(users).find(
                    (u) => String(u.Nisn) === inputNisn && u.Password === password
                );

                if (user) {
                    console.log("User found:", user);

                    // Update untuk isLoggedin 
                    const userKey = Object.keys(users).find(key => String(users[key].Nisn) === inputNisn);
                    const userRef = dbRef(Database, `Login/${userKey}`);

                    update(userRef, { isLoggedIn: true }).then(() => {
                        // Mengarahkan user seusai dengan Role mereka
                        if (user.Role === 'admin') {
                            navigate('/home');
                        } else {
                            navigate('/nambah');
                        }
                    }).catch((error) => {
                        setErrorMessage('Failed to update login status. Please try again.');
                        console.error('Update error:', error);
                    });
                } else {
                    console.log("No matching user found.");
                    setErrorMessage('Invalid NISN or password.');
                }
            } else {
                setErrorMessage('No users found in the database.');
            }
        }).catch((error) => {
            setErrorMessage('Error occurred during login. Please try again.');
            console.error('Error during login:', error);
        });
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    NISN:
                    <input 
                        type="text"  
                        value={nisn} 
                        onChange={(e) => setNisn(e.target.value)} 
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
