// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);
