<template>
  <div class="custom-modal">
    <h3>Delete Habit</h3>
    <h5>Warning! This action cannot be undone. Are you sure you want to delete this habit?</h5>
    <button class="action-button" @click="$emit('delete-habit', true)">Yes</button>
    <button class="action-button" @click="$emit('delete-habit', false)">No</button>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: [
    ],
    data() {
      return {
      }
    },
  }

</script>

<style>
  .custom-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    height: 100%;
  }

  .custom-modal h3 {
    align-self: center;
    text-align: center;
  }

  .container {
    position: relative;
    padding-left: 25px;
    padding-right: 20px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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

  .container:hover input~.checkmark {
    background-color: #ccc;
  }
  /* When the radio button is checked, add a blue background */

  .container input:checked~.checkmark {
    background-color: #2196F3;
  }
  /* Create the indicator (the dot/circle - hidden when not checked) */

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  /* Show the indicator (dot/circle) when checked */

  .container input:checked~.checkmark:after {
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
