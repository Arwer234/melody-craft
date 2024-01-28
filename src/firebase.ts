import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCTGtfPKcwu6Cd48QQtKdCfpP6PUJQKRNo',
  authDomain: 'melody-craft.firebaseapp.com',
  projectId: 'melody-craft',
  storageBucket: 'melody-craft.appspot.com',
  messagingSenderId: '562877252667',
  appId: '1:562877252667:web:876c1ee6d6c1005b04081e',
  measurementId: 'G-ZM3QWKY6D8',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
