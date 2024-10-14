import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { Database } from '../firebase';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Menampilkan data database yang ada di firebase
        const loginRef = ref(Database, 'Login');
        get(loginRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setUsers(formattedData);
            } else {
                console.log('No users found');
            }
        }).catch((error) => {
            console.error('Error fetching login data:', error);
        });
    }, []);

    return (
        <div className="admin-container">
                        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
                <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/add" style={{ marginRight: '10px' }}>Add Data</Link>
                <Link to="/nambah" style={{ marginRight: '10px' }}>Nambah Data</Link>
                <Link to="/delete" style={{ marginRight: '10px' }}>Delete Data</Link>
                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                <Link to="/admin" style={{ marginRight: '10px' }}>Admin Table</Link>
            </nav>
            <h1>Admin Dashboard</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>NISN</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Login Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.Nisn}</td>
                            <td>{user.Password}</td>
                            <td>{user.Role}</td>
                            <td>{user.isLoggedIn ? 'Logged In' : 'Not Logged In'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
