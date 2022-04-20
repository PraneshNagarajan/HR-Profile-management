import firebase from 'firebase/app';
import  'firebase/firebase-firestore';
import 'firebase/firebase-auth'
import 'firebase/firebase-storage'
    
    //------------------------- Primary -----------------------------------------
    //const firebaseConfig = {
    //   apiKey: "AIzaSyC59TbqRygXA3YldZNKYQnwlg7WGhBzQFc",
    //   authDomain: "hr-profile-management.firebaseapp.com",
    //   projectId: "hr-profile-management",
    //   storageBucket: "hr-profile-management.appspot.com",
    //   messagingSenderId: "802962471714",
    //   appId: "1:802962471714:web:e951c6651287785f97037b",
    //   measurementId: "G-QE1GSFSEZV"
    // }
    
    //--------------------     DEV    -------------------------------------------

    const firebaseConfig = {
      apiKey: "AIzaSyAwyN849ZwaT0MNOz3FTRTXgdvx03tYB-o",
      authDomain: "hr-profile-mangement-dev.firebaseapp.com",
      projectId: "hr-profile-mangement-dev",
      storageBucket: "hr-profile-mangement-dev.appspot.com",
      messagingSenderId: "504041984185",
      appId: "1:504041984185:web:4567b08a2ff89a255a8b68",
      measurementId: "G-DC1FCD8X7B"
    };



    //------------------------------  NP -----------------------------------------
    // const firebaseConfig = {
    //   apiKey: "AIzaSyCNgqI21HFXxFeHZl95KgcEhqdJd9472L4",
    //   authDomain: "hr-profile-management-np.firebaseapp.com",
    //   projectId: "hr-profile-management-np",
    //   storageBucket: "hr-profile-management-np.appspot.com",
    //   messagingSenderId: "739294019947",
    //   appId: "1:739294019947:web:11a05abaea0879792acc2e",
    //   measurementId: "G-V6JMKXCE19"
    // };
    
const app =  firebase.initializeApp(firebaseConfig)


export const firestore = app.firestore();
export const fireAuth = app.auth();
export const fireStorage = app.storage();

