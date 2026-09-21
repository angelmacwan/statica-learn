import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBsJdTB2vMl984SFxH8HexFWdNKXDqPUXU',
  authDomain: 'learning-staticalabs.firebaseapp.com',
  projectId: 'learning-staticalabs',
  storageBucket: 'learning-staticalabs.firebasestorage.app',
  messagingSenderId: '411557774187',
  appId: '1:411557774187:web:86a267dfb3bd1253f4422e',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
