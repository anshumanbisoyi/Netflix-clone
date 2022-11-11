import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN7ZDkziuqSiqLwI9hLBKHn2DQ3_SgEK0",
  authDomain: "netflix-clone-9e356.firebaseapp.com",
  projectId: "netflix-clone-9e356",
  storageBucket: "netflix-clone-9e356.appspot.com",
  messagingSenderId: "286998187741",
  appId: "1:286998187741:web:43d996537729f69e7b5534",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
