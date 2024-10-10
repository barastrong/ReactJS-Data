import React, { useEffect, useState } from 'react';
import { ref, update } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Logout.css'; // CSS for the loading spinner

const Logout = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate logout process
        const userRef = ref(Database, 'user'); // Reference to the user data in Firebase

        // You might want to find the logged-in user and update their isLoggedIn status
        // Here, we'll just simulate the logout process
        const logOutUser = async () => {
            try {
                // Update the user's status (e.g., isLoggedIn to false)
                // Adjust according to your logic
                // await update(userRef, { isLoggedIn: false }); // Uncomment this if you have a specific user to log out
                await new Promise((resolve) => setTimeout(resolve, 2100)); // Simulate a network request
                navigate('/login'); // Redirect to the login page after logout
            } catch (error) {
                console.error('Error during logout:', error);
            } finally {
                setLoading(false); // Stop loading after process completes
            }
        };

        logOutUser();
    }, [navigate]);

    return (
        <div className="logout-container">
            {loading ? (
                <div className="loading-spinner">
                    <p>Logging out...</p>
                    <div className="spinner"></div>
                </div>
            ) : (
                <p>You have been logged out.</p>
            )}
        </div>
    );
};

export default Logout;
