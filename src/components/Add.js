import React, { useState } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database';
import { Database, storage } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Add.css';

const UploadForm = () => {
    const [nama, setNama] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false); // Untuk Loading Spinner
    const navigate = useNavigate(); // Mengarahkan setelah di upload

    // Handle untuk input Gambar
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Handle untuk Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setIsUploading(true); // Memulai loading untuk proggres yang sudah di upload

        if (!nama || !keterangan || !image) {
            setMessage("Please fill in all fields and select an image.");
            return;
        }

        // Step 1: Mengupload image ke Firebase Store
        const imageRef = storageRef(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        // Memonitoring agar upload success
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Mendapatkan presentase data yang sudah di upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error during image upload:", error);
                setMessage("Error uploading the image.");
            },
            () => {
                // Step 2: Mengambil URL Gambar setelah confirm succesfull
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((imageUrl) => {
                        // Step 3: Menyimpan Nama, Keterangan, and Image URL to Firebase Realtime Database
                        const userRef = dbRef(Database, 'user');
                        return push(userRef, {
                            Nama: nama,
                            Jumlah:0,
                            Keterangan: keterangan,
                            imageUrl: imageUrl
                        });
                    })
                    .then(() => {
                        setMessage('Data uploaded successfully!');
                        setNama('');
                        setKeterangan(''); // Mengosongkan input 'Keterangan'
                        setImage(null);
                        setProgress(0);
                        setIsUploading(false); // Menghentikan Loading setelah Uploading
                        navigate('/home');
                    })
                    .catch((error) => {
                        console.error("Error saving data to the database:", error);
                        setMessage("Error saving data to the database.");
                    });
            }
        );
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
            <h1>Upload Data</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nama:
                    <input 
                        type="text" 
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        required 
                    />
                </label>
                <br />
                <label>
                    Keterangan:
                    <input 
                        type="text" 
                        value={keterangan} 
                        onChange={(e) => setKeterangan(e.target.value)} 
                        required 
                    />
                </label>
                <br />
                <label>
                    Upload Image:
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required 
                    />
                </label>
                <br />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Submit'}
                </button>
            </form>

            {/* Display untuk upload proggress */}
            {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadForm;
