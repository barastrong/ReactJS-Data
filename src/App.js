import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';  // Correct path to Home component
import Add from './components/Add';    // Correct path to Add component
import Nambah from './components/Nambah'; // Correct path to Nambah component
import Delete from './components/Delete';
import Login from './components/Login';
import Register from './components/Register'; // Correct path to Register component
import Admin from './components/Admin'; // Correct path to Admin component
import Logout from './components/Logout';

const App = () => {
    return (
        <Router>
            <div>
                {/* Navigation Links */}

                {/* Route Definitions */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to Login */}
                    <Route path="/home" element={<Home />} /> {/* Home page route */}
                    <Route path="/add" element={<Add />} />
                    <Route path="/nambah" element={<Nambah />} />
                    <Route path="/delete" element={<Delete />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect any unknown routes to Login */}
                    <Route path="/logout" element={<Logout />} /> {/* Logout route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
