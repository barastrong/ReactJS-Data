import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { Database } from '../firebase'; // Asumsi Firebase sudah dikonfigurasi
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css'; // Pastikan CSS diimpor

const Home = () => {
    const [user, setUser] = useState([]); 
    const [selectedUserName, setSelectedUserName] = useState(''); // State for selected user's name
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
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
    const handleAddJumlah = (userId, userName) => {
        // Ambil data terbaru dari Firebase untuk user yang dipilih
        const userRef = ref(Database, `user/${userId}`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentJumlah = snapshot.val().Jumlah ?? 0; // If Jumlah doesn't exist, treat as 0
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

                            // Set selected user's name and show modal
                            setSelectedUserName(userName);
                            setShowModal(true);

                            // Optionally, you can navigate after a delay or after modal is closed
                            setTimeout(() => {
                                setShowModal(false); // Hide modal after a few seconds
                                navigate('/logout'); // Redirect to the Logout page
                            }, 2000); // 2 seconds delay
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

                            {/* Nama dan Keterangan di bawah gambar */}
                            <div className="user-info">
                                <h3>{user.Nama}</h3>
                                <p>{user.Keterangan}</p>
                            </div>

                            {/* Button untuk menambah jumlah */}
                            <div className="button-container">
                                <button
                                    className="add-button"
                                    onClick={() => handleAddJumlah(user.id, user.Nama)}
                                >
                                    Yes
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={handleCancelAddJumlah}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading users...</p>
                )}
            </div>

            {/* Modal pop-up when user selects "Yes" */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Terima Kasih!</h3>
                        <p>Terima kasih telah memilih {selectedUserName}.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
