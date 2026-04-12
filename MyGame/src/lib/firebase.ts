import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDV9WvrBsLTiFAUxe50nm8_KFfMaTLXF78",
    authDomain: "bananaquiz-a5359.firebaseapp.com",
    projectId: "bananaquiz-a5359",
    storageBucket: "bananaquiz-a5359.firebasestorage.app",
    messagingSenderId: "785069807868",
    appId: "1:785069807868:web:73d4a1c579ff79a949df79",
    measurementId: "G-FDS8XDGEW4"
};

// Prevent re-initializing on hot-reload in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
