import firebase from 'firebase'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyDf8mwvDwe9wQ0HzvJbqzp2Gg3QnSJ3P5s",
    authDomain: "habit-tracker-2f73c.firebaseapp.com",
    databaseURL: "https://habit-tracker-2f73c.firebaseio.com",
    projectId: "habit-tracker-2f73c",
    storageBucket: "habit-tracker-2f73c.appspot.com",
    messagingSenderId: "205075857139"
};

const firebaseapp = firebase.initializeApp(config)
const firestore = firebaseapp.firestore()
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


export default firestore;

