import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { Database } from '../firebase'; // Asumsi Firebase sudah dikonfigurasi
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css'; // Pastikan CSS diimpor

const Home = () => {
    const [user, setUser] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Mengambil data dari Firebase
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

    // Fungsi untuk menambah jumlah
    const handleAddJumlah = (userId) => {
        // Ambil data terbaru dari Firebase untuk user yang dipilih
        const userRef = ref(Database, `user/${userId}`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentJumlah = snapshot.val().Jumlah || 0; // Dapatkan Jumlah terbaru
                    const newJumlah = currentJumlah + 1; // Tambah 1 ke jumlah saat ini

                    // Update jumlah di Firebase
                    update(userRef, { Jumlah: newJumlah })
                        .then(() => {
                            console.log('Jumlah berhasil ditambahkan');
                            setUser((prevUsers) =>
                                prevUsers.map((user) =>
                                    user.id === userId ? { ...user, Jumlah: newJumlah } : user
                                )
                            );
                            navigate('/logout'); // Redirect to the Logout page
                        })
                        .catch((error) => {
                            console.error('Error updating data: ', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error getting current jumlah: ', error);
            });
    };

    // Fungsi untuk membatalkan penambahan jumlah
    const handleCancelAddJumlah = () => {
        console.log('Penambahan jumlah dibatalkan');
    };

    return (
        <div className="home-container">
            <h2>Data Pengguna</h2>

            {/* Menampilkan data pengguna */}
            <div className="user-list">
                {user.length > 0 ? (
                    user.map((user) => (
                        <div key={user.id} className="user-card">
                            {/* Menampilkan foto pengguna */}
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={`${user.Nama}'s avatar`}
                                    className="user-image"
                                />
                            ) : (
                                <p>No Image Available</p>
                            )}

                            {/* Nama dan Jumlah di bawah gambar */}
                            <div className="user-info">
                                <h3>{user.Nama}</h3>
                                <p>{user.Keterangan}</p>
                            </div>

                            {/* Button untuk menambah jumlah */}
                            <div className="button-container">
                                <button className="add-button" onClick={() => handleAddJumlah(user.id)}>Yes</button>
                                <button className="cancel-button" onClick={handleCancelAddJumlah}>No</button>
                            </div>
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
