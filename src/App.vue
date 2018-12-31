<template>
  <v-app id="app">
    <status-bar></status-bar>
    <div style="display: flex; flex: 1">
      <nav-drawer></nav-drawer>
      <div style="overflow: hidden; width: 100%">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script>
  import Vue from 'vue';
  import VueColor from 'vue-color'
  import dropdown from 'vue-dropdowns';

  const today = new Date();

  export default {
    name:       'App',
    data:       function() {
      return {
        showModal: false,
        today:     today,
        color:     '',
      }
    },
  }

  Vue.component( 'status-bar', {
    template:
      `
  <div class="status-bar">
    <breadcrumb></breadcrumb>
    <button class="menu-button">Logout</button>
  </div>
  `,
    data() {
      return {
        crumbs: [ 'Home', 'Dashboard' ]
      }
    }
  } );

  Vue.component( 'breadcrumb', {
    template:
           `
  <div class="status-text">{{ status }}</div>
  `,
    props: [
      'status'
    ]
  } );

  Vue.component( 'nav-drawer', {
    template:
      `
  <div class="nav-drawer">
    <div class="nav-list">
      <a
        :href="route.link"
        v-for="route in routes"
        class="nav-list--item">
        {{ route.title }}
      </a>
    </div>
    <button class="nav-drawer-button"></button>
  </div>
  `,
    data() {
      return {
        routes: [
          {
            title: 'Dashboard',
            link:  './#/dashboard'
          },
          {
            title: 'Habits',
            link:  './#/habits'
          },
          {
            title: 'Projects',
            link:  './#/projects'
          },
        ]
      }
    }
  } );

</script>

<style>
  .menu-button {
    background: #7599c447;
    color: #314863;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .menu-button:hover,
  .menu-button:focus {
    background: #7599c4;
    color: white;
  }

  .text-input {
    padding: 0 10px;
    border: solid 1px #7599c4;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
  }

  .current-color {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #000;
    cursor: pointer;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: white;
    font-size: 20px;
    margin: 0;
    overflow: scroll;
    width: 350px;
  }

  .nav-list--item {
    width: 100%;
    padding: 15px 30px;
    text-align: start;
    cursor: pointer;
  }

  .nav-list--item:hover {
    background: #4a6b90;
  }

  .nav-drawer {
    background: #314863;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
  }

  .nav-drawer a {
    color: white;
  }

  .nav-drawer-button {
    flex: 1;
    width: 30px;
    color: white;
    background: #314863;
  }

  .status-text {
    flex: 1;
    line-height: 46px;
    text-align: left;
    margin-left: 10px;
    font-size: 18px;
  }

  .status-bar {
    height: 46px;
    width: 100%;
    border-bottom: solid #314863 1px;
    display: flex;
    padding: 6px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  h1 {
    font-size: 3em;
  }

  h2 {
    font-size: 2em;
  }

  h3 {
    font-size: 1.6em;
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .action-button {
    background: #42b983;
    padding: 10px 14px;
    margin: 10px;
    border-radius: 6px;
    font-size: 1em;
  }

  .action-button:disabled {
    background: lightgrey;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .nav {
    display: flex;
    align-items: right;
  }

  .radio-buttons {
    align-self: left;
    margin-bottom: 20px;
  }

  button,
  .tool-button {
    color: white;
    background-color: lightgrey;
    font-weight: bold;
    border: none;
    outline: 0;
    cursor: pointer;
  }

  .tool-button {
    position: absolute;
    right: 0;
  }

  .floating-action-button {
    position: absolute;
    right: 50px;
    bottom: 50px;
    height: 70px;
    width: 70px;
    z-index: 99;
    background: #42b983;
    border-radius: 100%;
    font-size: 2.2em;
  }

  .week th {
    min-width: 100px;
  }

  .check {
    border-radius: 100%;
  }

  .custom-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px;
    height: 100%;
  }

  .custom-modal h3 {
    align-self: center;
    text-align: center;
  }

  .container {
    padding: 0;
    position: relative;
    padding-left: 32px;
    margin: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 18px;
    color: #616060;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex: 1;
  }

  /* Hide the browser's default radio button */

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 50%;
  }

  /* On mouse-over, add a grey background color */

  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the radio button is checked, add a blue background */

  .container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */

  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */

  .container .checkmark:after {
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
</style>
