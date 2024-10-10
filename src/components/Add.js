import React, { useState } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database';
import { Database, storage } from '../firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Add.css';

const UploadForm = () => {
    const [nama, setNama] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    // Handle file input for image
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!nama || !jumlah || !image) {
            setMessage("Please fill in all fields and select an image.");
            return;
        }

        // Step 1: Upload image to Firebase Storage
        const imageRef = storageRef(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        // Monitor upload progress
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Get task progress by percentage
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error during image upload:", error);
                setMessage("Error uploading the image.");
            },
            () => {
                // Step 2: Get image URL once upload is complete
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((imageUrl) => {
                        // Step 3: Save Nama, Jumlah, and Image URL to Firebase Realtime Database
                        const userRef = dbRef(Database, 'user');
                        return push(userRef, {
                            Nama: nama,
                            Jumlah: jumlah,
                            imageUrl: imageUrl
                        });
                    })
                    .then(() => {
                        setMessage('Data uploaded successfully!');
                        setNama('');
                        setJumlah('');
                        setImage(null);
                        setProgress(0);
                        navigate('/home'); // Redirect to homepage after successful upload
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
                    Jumlah:
                    <input 
                        type="number" 
                        value={jumlah} 
                        onChange={(e) => setJumlah(e.target.value)} 
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
                <button type="submit">Submit</button>
            </form>

            {/* Display upload progress */}
            {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}

            {/* Display message */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadForm;
