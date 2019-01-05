// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VModal from 'vue-js-modal'
import VueFirestore from 'vue-firestore'
import Firebase from 'firebase'
import Vuetify from 'vuetify'

require('firebase/firestore');

require('../node_modules/vuetify/dist/vuetify.min.css');

Vue.use(VModal);
Vue.use(VueFirestore);
Vue.use(Vuetify);

Vue.config.productionTip = false;

const config = {
  apiKey: "AIzaSyDf8mwvDwe9wQ0HzvJbqzp2Gg3QnSJ3P5s",
  authDomain: "habit-tracker-2f73c.firebaseapp.com",
  databaseURL: "https://habit-tracker-2f73c.firebaseio.com",
  projectId: "habit-tracker-2f73c",
  storageBucket: "habit-tracker-2f73c.appspot.com",
  messagingSenderId: "205075857139"
};

const firebaseApp = Firebase.initializeApp(config)
export const db = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
