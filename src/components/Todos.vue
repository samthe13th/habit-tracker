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
      <template v-for="date in dates">
        <h5 v-if="date" >{{ date[".key"] }}</h5>
        <div class="todos-list">
          <todo-card
            v-for="list in date.todos"
            :id="list.id"
            :name="list.name"
            :items="list.items.length"
            :checked="checked(list.items)"
            @edit-todo="openEditModal(list.id, date['.key'], date)"
            @delete-todo="deleteTodo(list.id, list.created)"
          ></todo-card>
        </div>
      </template>
    </div>

    <modal name="new-todo-modal" :width="400" :height="'100%'">
      <new-todo @new-todo="newTodo"/>
    </modal>

    <modal name="edit-todo-modal" :adaptive="true" :height="'90%'" :draggable="true" @before-close="beforeEditClose">
      <edit-todo v-if="selectedTodoDate && selectedTodoId" :date="selectedTodoDate" :id="selectedTodoId"></edit-todo>
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
      selectedTodoDate: '',
      selectedTodoDateRef: null,
    }
  },
  components: {
    NewTodo,
    TodoCard,
    EditTodo,
  },
  firestore() {
    return {
      todos: db.collection('Todos'),
      dates: db.collection('Date'),
    };
  },
  methods: {
    checked(list) {
      return list.filter(item => item.checked);
    },
    beforeEditClose() {
      console.log("close!");
    },
    openEditModal(id, date, ref) {
      this.selectedTodoId = id;
      this.selectedTodoDate = date;
      this.selectedTodoDateRef = ref;
      this.$modal.show('edit-todo-modal');
    },
    deleteTodo(id, created) {
      const ref = db.collection('Date').doc(created);
      let todos;
      ref.get().then((doc) => {
        todos = doc.data().todos;
        ref.update({
          todos: _.omit(todos, id)
        })
      });
    },
    openTodoModal() {
      this.$modal.show('new-todo-modal');
    },
    newTodo(name, type, created) {
      this.$modal.hide('new-todo-modal');
      const ref = this.$firestore.todos.doc();
      this.selectedTodoId = ref.id;

      db.collection('Date')
        .doc(created)
        .set(
          { todos: {
              [ref.id]: {
                name,
                type,
                created,
                items: [],
                id: this.selectedTodoId
              }
            }
          }, { merge: true });

      setTimeout(() => {
        this.openEditModal(ref.id, created);
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
    align-items: flex-start;
    flex-direction: column;
    height: 100vh;
    padding: 20px 10px;
  }

  .todos-list {
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
  }

  .todos-list--wrapper h5 {
      margin: 20px;
  }
</style>
