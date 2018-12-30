<template>
  <div class="custom-modal new-todo">
    <div class="custom-modal new-todo"
    <h3>New Project</h3>
    <input placeholder="Project Name" class="text-input " v-model="projectTitle" maxlength="60">
    <br>
    <button :disabled="projectTitle === ''" class="action-button" @click="$emit('new-project', projectTitle)">Create</button>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'NewProject',
    data() {
      return {
        projectTitle: '',
      }
    },
  }
</script>

<style>
  .new-todo .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
  }
</style>
