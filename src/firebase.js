import firebase from 'firebase/app';
import  'firebase/firebase-firestore';
import 'firebase/firebase-auth'
    

    const firebaseConfig = {
      apiKey: "AIzaSyC59TbqRygXA3YldZNKYQnwlg7WGhBzQFc",
      authDomain: "hr-profile-management.firebaseapp.com",
      projectId: "hr-profile-management",
      storageBucket: "hr-profile-management.appspot.com",
      messagingSenderId: "802962471714",
      appId: "1:802962471714:web:e951c6651287785f97037b",
      measurementId: "G-QE1GSFSEZV"
    }
    
const app =  firebase.initializeApp(firebaseConfig)


export const firestore = app.firestore();
export const fireAuth = app.auth();

