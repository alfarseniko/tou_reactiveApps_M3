import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGH5k2FQqKvFVreg2ugTWqdqq9DM2ghpY",
  authDomain: "bim-dev-masrwe.firebaseapp.com",
  projectId: "bim-dev-masrwe",
  storageBucket: "bim-dev-masrwe.firebasestorage.app",
  messagingSenderId: "301801062903",
  appId: "1:301801062903:web:0495c925a942f0b78deef2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
