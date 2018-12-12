<template>
  <div class="custom-modal new-todo">
    <h3>New Project</h3>
    <input placeholder="Project Name" class="text-input " v-model="projectTitle" type="text" maxlength="60">
    <br>
    <button v-if="projectTitle !== ''" class="action-button" @click="$emit('new-project', projectTitle)">Create</button>
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
  .new-todo input {
    font-size: 20px;
  }
</style>
