<template>
  <div class="module">
    <div class="toolbar">
      <button
        class="action-button"
        v-on:click="openTodoModal()">
        New
      </button>
    </div>

    <div class="todos-list--wrapper">
      <div class="todos-list">
        <todo-card
          v-for="list in todos"
          :id="list.id"
          :name="list.name"
          :items="list.items.length"
          :checked="checked(list.items)"
          @edit-todo="openEditModal(list.id)"
        ></todo-card>
      </div>
    </div>

    <modal name="new-todo-modal" :width="400" :height="350">
      <new-todo @new-todo="newTodo"/>
    </modal>

    <modal name="edit-todo-modal" :height="600" @before-close="beforeEditClose">
      <edit-todo :id="selectedTodoId"></edit-todo>
    </modal>
  </div>
</template>


<script>
import firebase from 'firebase'
import * as _ from 'lodash'
import { db } from '../main'
import NewTodo from './Todos/NewTodo'
import TodoCard from './Todos/TodoCard'
import EditTodo from './Todos/EditTodo'

export default {
  name: 'Todos',
  data() {
    return {
      selectedTodoId: '',
    }
  },
  components: {
    NewTodo,
    TodoCard,
    EditTodo,
  },
  firestore() {
    return {
      todos: db.collection('Todos')
    };
  },
  methods: {
    checked(list) {
      return list.filter(item => item.checked);
    },
    beforeEditClose() {
      console.log("close!")
    },
    openEditModal(id) {
      this.selectedTodoId = id;
      this.$modal.show('edit-todo-modal');
    },
    openTodoModal() {
      this.$modal.show('new-todo-modal');
    },
    newTodo(name, type, created) {
      this.$modal.hide('new-todo-modal');
      const ref = this.$firestore.todos.doc();
      this.selectedTodoId = ref.id;
      ref.set({ name, type, created, items: [], id: this.selectedTodoId });
      setTimeout(() => {
        this.openEditModal(ref.id);
      }, 100)
    },
    createHabit(newHabit) {
      this.$modal.hide('add-habit-modal');
      if (newHabit.period === 'daily') {
        const ref = db.collection('DailyHabits').doc();
        const id = ref.id;
        ref.set({ ...newHabit, id, private: false });

      }
    },
  }
}
</script>

<style scoped>
  .module {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .toolbar {
    background: #7599c4;
    height: 60px;
    display: flex;
    flex-shrink: 0;
    padding-left: 20px;
  }

  .toolbar .action-button {
    background: white;
    color: black;
  }

  .todos-list--wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    align-items: center;
  }

  .todos-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: scroll;
    padding: 20px 10px;
  }
</style>
