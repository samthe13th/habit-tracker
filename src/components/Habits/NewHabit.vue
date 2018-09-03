<template>
  <div class="custom-modal">
    <h3>New Habit</h3>
    <input v-model="habit.title" class="text-input" type="text" placeholder="Title for habit">
    <h3>Period</h3>
    <div class="radio-buttons">
      <label class="container">Daily
        <input value="daily" v-model="habit.period" type="radio" checked="checked" name="radio">
        <span class="checkmark"></span>
      </label>
      <label class="container">Weekly
        <input value="weekly" v-model="habit.period"  type="radio" name="radio">
        <span class="checkmark"></span>
      </label>
      <label class="container">Monthly
        <input value="monthly" v-model="habit.period"  type="radio" name="radio">
        <span class="checkmark"></span>
      </label>
    </div>
    <br>
    <button class="action-button" @click="$emit('create-habit', habit)">Start Habit</button>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: [
      'habitData',
      'createHabit',
      'data'
    ],
    data() {
      return {
        habit: {
          title: '',
          period: '',
        },
        a: {
          b: 'abc'
        }
      }
    },
  }

</script>

<style scoped>
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