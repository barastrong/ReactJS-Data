import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { Database } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Nambah = () => {
    const [user, setUser] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [showModal, setShowModal] = useState(false);
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

    const handleAddJumlah = (userId, userName) => {
        const userRef = ref(Database, `user/${userId}`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentJumlah = snapshot.val().Jumlah ?? 0;
                    const newJumlah = currentJumlah + 1;

                    update(userRef, { Jumlah: newJumlah })
                        .then(() => {
                            console.log('Jumlah berhasil ditambahkan');
                            setUser((prevUsers) =>
                                prevUsers.map((user) =>
                                    user.id === userId ? { ...user, Jumlah: newJumlah } : user
                                )
                            );

                            setSelectedUserName(userName);
                            setShowModal(true);

                            setTimeout(() => {
                                setShowModal(false);
                                navigate('/logout');
                            }, 2000);
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

    const handleCancelAddJumlah = () => {
        console.log('Penambahan jumlah dibatalkan');
    };

    return (
        <div className="home-container">
            <h2>Data Pengguna</h2>

            <div className="user-list">
                {user.length > 0 ? (
                    user.map((user) => (
                        <div key={user.id} className="user-card">
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    alt={`${user.Nama}'s avatar`}
                                    className="user-image"
                                />
                            ) : (
                                <p>No Image Available</p>
                            )}
                            <div className="user-info">
                                <h3>{user.Nama}</h3>
                                <p>{user.Keterangan}</p>
                            </div>
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

export default Nambah;
