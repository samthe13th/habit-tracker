<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function() {
    return {
      showModal: false
    }
  },
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .text-input {
    margin: 5px 0;
    width: 250px;
    padding: 8px;
    border: solid 1px lightgrey;
    font-size: 14px;
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
  }
</style>
