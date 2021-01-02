import * as firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyD4lg9dpBz_WSHy44qtU53CTWRwiHI219s",
  authDomain: "library-app-271e4.firebaseapp.com",
  projectId: "library-app-271e4",
  storageBucket: "library-app-271e4.appspot.com",
  messagingSenderId: "196037341761",
  appId: "1:196037341761:web:d0f781d997a8f186e7ccc0"
};
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();