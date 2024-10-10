import React, { useState, useEffect } from 'react';
import { get, ref, remove } from 'firebase/database';
import { Database } from '../firebase'; // Pastikan Firebase sudah dikonfigurasi
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Delete.css';

const Home = () => {
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(''); // State untuk menyimpan nama user yang dipilih
    const navigate = useNavigate(); // Initialize navigate

    // Mengambil data dari Firebase saat komponen pertama kali di-render
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

    // Fungsi untuk menghapus data pengguna
    const handleDelete = () => {
        const selectedUserData = user.find((u) => u.Nama === selectedUser);

        if (selectedUserData) {
            const userRef = ref(Database, `user/${selectedUserData.id}`);
            remove(userRef)
                .then(() => {
                    console.log('Data berhasil dihapus');
                    // Menghapus user dari state lokal
                    setUser(user.filter((u) => u.id !== selectedUserData.id));
                    setSelectedUser(''); // Reset pilihan
                    navigate('/home'); // Redirect to homepage after deletion
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
            {/* Menampilkan data pengguna */}
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

export default Home;
