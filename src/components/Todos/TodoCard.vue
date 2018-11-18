<template>
  <div @click="$emit('edit-todo')" class="todo-card">
    <h3>{{ todo.name }}</h3>
    <h5>{{ checked.length }} / {{ items }}</h5>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { db } from '../../main';

  export default {
    name: 'TodoCard',
    props: [
      'id',
      'name',
      'items',
      'checked'
    ],
    firestore() {
      return {
        todo: db.collection('Todos').doc(this.id)
      }
    },
  }
</script>

<style scoped>
  .todo-card {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    background: white;
    margin: 20px;
    padding: 5px;
    cursor: pointer;

    h3 {
      padding: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>
