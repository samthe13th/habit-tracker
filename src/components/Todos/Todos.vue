<template>
  <div class="module">

    <div v-if="project" class="todos-list">
      <em style="margin-left: 20px" v-if="project.todos.length === 0">No todos in this project yet!</em>
      <todo-card
        v-if="project.todos"
        v-for="todo in project.todos"
        :project="todo.project"
        :id="todo.id"
        :name="todo.name"
        :items="todo.items.length"
        :checked="checked(todo.items)"
        @edit-todo="openEditModal(todo.id, todo.created)"
        @delete-todo="deleteTodo(todo.id, todo.project)"
      ></todo-card>
    </div>

    <modal :name="`${project.id}__new-todo`" :width="400" @before-open="beforeOpen">
      <new-todo :projectId="project.id" @new-todo="newTodo"/>
    </modal>

    <modal :name="`${project.id}__edit-todo`" :adaptive="true" :height="'90%'" :draggable="true">
      <edit-todo
        v-if="selectedTodoDate && selectedTodoId"
        :title="`${project.name} TODO`"
        :date="selectedTodoDate"
        :projectId="project.id"
        :type="selectedTodoType"
        :id="selectedTodoId">
      </edit-todo>
    </modal>

  </div>
</template>


<script>
import firebase from 'firebase'
import * as _ from 'lodash'
import { db } from '../../main'
import NewTodo from './NewTodo'
import TodoCard from './TodoCard'
import EditTodo from './EditTodo'
import NewProject from './NewProject'

export default {
  name: 'Todos',
  props: [
    "project"
  ],
  data() {
    return {
      selectedTodoType: '',
      selectedTodoId: '',
      selectedTodoDate: '',
      selectedTodoDateRef: null,
    }
  },
  components: {
    NewTodo,
    TodoCard,
    EditTodo,
    NewProject,
  },
  firestore() {
    return {
      todos: db.collection('Todos'),
      projects: db.collection('Projects'),
    };
  },
  methods: {
    checked(list) {
      return list.filter(item => item.checked);
    },
    beforeOpen(event) {
      this.currentProjectId = event.params.projectId;
    },
    openEditModal(id, date) {
      this.selectedTodoId = id;
      this.selectedTodoDate = date;
      this.$modal.show(`${this.project.id}__edit-todo`);
    },
    deleteTodo(todoId, projectId) {
      const project = this.$firestore.projects.doc(projectId)
      project.get().then((doc) => {
        const todos = doc.data().todos;
        project.update({
          todos: _.omit(todos, todoId)
        })
      })
    },
    openNewProjectModal() {
      this.$modal.show('new-project-modal');
    },
    newProject(title) {
      this.$modal.hide('new-project-modal');
      const projectRef = this.$firestore.projects.doc();

      db.collection("Projects")
        .doc(projectRef.id)
        .set(
          { name: title,
            id: projectRef.id,
            todos: {},
          });
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

  .todo-button {
    margin-left: 20px;
  }

  .module {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-list {
    margin-bottom: 30px;
    text-align: start;
  }

  .project-list h5 {
    text-align: left;
  }

  .toolbar {
    background:#fb7979;
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
    overflow: scroll;
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
