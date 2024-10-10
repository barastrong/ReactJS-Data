// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCx9ggAmQcu08RDIhj1JSx7TcUiPgBWKGg",
  authDomain: "coba-aa967.firebaseapp.com",
  databaseURL: "https://coba-aa967-default-rtdb.firebaseio.com/",
  projectId: "coba-aa967",
  storageBucket: "coba-aa967.appspot.com",
  messagingSenderId: "828594757002",
  appId: "1:828594757002:web:35df463a09dcd4d398fc73",
  measurementId: "G-5KG8N7D3NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Storage
const Database = getDatabase(app);
const storage = getStorage(app);

// Export the initialized services for use in other files
export { Database, storage };
