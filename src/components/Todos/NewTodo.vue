<template>
  <div class="custom-modal new-todo">
    <h3>New Todo</h3>
    <input ref="titleInput" class="text-input " v-model="title" type="text">
    <br>
    <div class="radio-buttons">
      <label class="container">Daily
        <input value="daily" v-model="todoType" type="radio" checked="checked" name="radio">
        <span class="checkmark"></span>
      </label>
      <label class="container">Long-term
        <input value="long-term" v-model="todoType"  type="radio" name="radio">
        <span class="checkmark"></span>
      </label>
    </div>
    <button class="action-button" @click="$emit('new-todo', title, todoType, formattedDate())">Create</button>
  </div>
</template>

<script>
  import Vue from 'vue'

  const date = new Date();

  export default {
    created() {
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      });
    },
    data() {
      return {
        todoType: 'daily',
        date: new Date(),
        title: date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      }
    },
    methods: {
      formattedDate() {
        return  this.date.toLocaleDateString("en-US", this.dateOptions)
      }
    },
  }

</script>

<style>
  .new-todo input {
    text-align: center;
    font-size: 20px;
  }
</style>
