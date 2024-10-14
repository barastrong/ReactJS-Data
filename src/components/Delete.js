import React, { useState, useEffect } from 'react';
import { get, ref, remove } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Delete.css';

const Delete = () => {
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userRef = ref(Database, 'user');
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
                    setUser(userArray);
                } else {
                    console.log('No Data EXISTS');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleDelete = () => {
        const selectedUserData = user.find((u) => u.Nama === selectedUser);

        if (selectedUserData) {
            const userRef = ref(Database, `user/${selectedUserData.id}`);
            remove(userRef)
                .then(() => {
                    console.log('Data berhasil dihapus');
                    setUser(user.filter((u) => u.id !== selectedUserData.id));
                    setSelectedUser('');
                    navigate('/home');
                })
                .catch((error) => {
                    console.error('Error deleting data: ', error);
                });
        } else {
            console.error('Pengguna tidak ditemukan');
        }
    };

    return (
        <div>
            <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
                <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
                <Link to="/add" style={{ marginRight: '10px' }}>Add Data</Link>
                <Link to="/nambah" style={{ marginRight: '10px' }}>Nambah Data</Link>
                <Link to="/delete" style={{ marginRight: '10px' }}>Delete Data</Link>
                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                <Link to="/admin" style={{ marginRight: '10px' }}>Admin Table</Link>
            </nav>
            <h2>Hapus Pengguna</h2>
            <div>
                <label>Pilih Nama Pengguna:</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                    <option value="">-- Pilih Pengguna --</option>
                    {user.map((user) => (
                        <option key={user.id} value={user.Nama}>
                            {user.Nama}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleDelete} disabled={!selectedUser}>
                Hapus Pengguna
            </button>

            <h2>Data Pengguna</h2>
            <div>
                {user.length > 0 ? (
                    user.map((user) => (
                        <div key={user.id}>
                            <h3>{user.Nama}</h3>
                            <p>Jumlah: {user.Jumlah}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading users...</p>
                )}
            </div>
        </div>
    );
};

export default Delete;
