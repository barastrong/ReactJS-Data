import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';  // Correct path to Home component
import Add from './components/Add';    // Correct path to Add component
import Nambah from './components/Nambah'; // Correct path to Nambah component
import Delete from './components/Delete'

const App = () => {
    return (
        <Router>
            <div>
                {/* Navigation Links */}
                <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
                    <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                    <Link to="/add" style={{ marginRight: '10px' }}>Add Data</Link>
                    <Link to="/nambah" style={{ marginRight: '10px' }}>Nambah Data</Link>
                    <Link to="/delete" style={{ marginRight: '10px' }}>Delete Data</Link>
                </nav>

                {/* Route Definitions */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/nambah" element={<Nambah />} />
                    <Route path="/Delete" element={<Delete />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
