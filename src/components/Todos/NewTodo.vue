<template>
  <div class="custom-modal new-todo">
    <h3>New Todo</h3>
    <input placeholder="Title" ref="titleInput" class="text-input " v-model="title" maxlength="60">
    <br/>
    <button :disabled="title === ''" class="action-button" @click="$emit('new-todo', title, projectId, formattedDate())">Create</button>
  </div>
</template>

<script>
  import Vue from 'vue'

  const date = new Date();

  export default {
    props: [
      'projectId',
    ],
    created() {
      console.log("PROJECT: ", this.projectId)
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      });
    },
    data() {
      return {
        todoType: 'project',
        date: new Date(),
        title: '',
        dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      }
    },
    methods: {
      formattedDate() {
        return this.date.toLocaleDateString("en-US", this.dateOptions)
      },
    },
  }

</script>

<style>
  .new-todo input {
    text-align: start;
    font-size: 20px;
  }

  .new-todo .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
  }
</style>
