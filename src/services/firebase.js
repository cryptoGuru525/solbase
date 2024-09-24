import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDehSyGQrPXNuTgqmPFn8d3DUhNDpykHgQ",
  authDomain: "blockmap-7be2d.firebaseapp.com",
  projectId: "blockmap-7be2d",
  storageBucket: "blockmap-7be2d.appspot.com",
  messagingSenderId: "985548555511",
  appId: "1:985548555511:web:88615ee107267954797ff2",
  measurementId: "G-GG0BRD6BCS"
};

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const storedb = getFirestore(app);
