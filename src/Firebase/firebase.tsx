// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const isLocal = false;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8MMIzz8E2A3fBdgC0eAYexZPRb_YseO0",
  authDomain: "icebreaker-73b4e.firebaseapp.com",
  databaseURL: "https://icebreaker-73b4e-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "icebreaker-73b4e",
  storageBucket: "icebreaker-73b4e.appspot.com",
  messagingSenderId: "1033922742327",
  appId: "1:1033922742327:web:ee32681c147de7f06717b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

if (isLocal) {
  // Point to the Firestore emulator running locally
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  // Point to the Auth emulator running locally
  connectAuthEmulator(auth, 'http://localhost:9099/');
  // Point to the Realtime Database emulator running locally
  connectDatabaseEmulator(database, 'localhost', 9000);
}

export { app, database, firestore, auth };