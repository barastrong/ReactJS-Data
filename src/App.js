import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';  
import Add from './components/Add';    
import Nambah from './components/Nambah'; 
import Delete from './components/Delete';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import Logout from './components/Logout';

const App = () => {
    return (
        <Router>
            <div>

                {/* Route Definitions */}
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/nambah" element={<Nambah />} />
                    <Route path="/delete" element={<Delete />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/login" />} /> 
                    <Route path="/logout" element={<Logout />} /> 
                </Routes>
            </div>
        </Router>
    );
};

export default App;
