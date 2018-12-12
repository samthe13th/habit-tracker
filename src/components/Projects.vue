<template>
  <div class="module">
    <div class="toolbar">
      <button
        class="action-button"
        v-on:click="openNewProjectModal()">
        New Project
      </button>
    </div>

    <div class="todos-list--wrapper">
      <div v-for="project in projects" class="project-list">

        <div style="margin-left: 20px; color: #2a4865">
          <h2>
            {{ project.name }}
            <span>({{ getPercent(project) }}%)</span>
          </h2>

          <span style="display: flex; align-items: center">
            <button v-on:click="deleteProject(project.id)" class="todo-card__button action-button">Delete Project</button>
            <button class="action-button" v-on:click="openNewTodoModal(project.id)">New Todo</button>
          </span>
        </div>

        <todos :project="project"></todos>

      </div>
    </div>

    <modal name="new-project-modal" :width="400">
      <new-project @new-project="newProject"/>
    </modal>

    <modal name="new-todo-modal" :width="400" @before-open="beforeOpen">
      <new-todo :projectId="currentProjectId" @new-todo="newTodo"/>
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
  import NewProject from './Todos/NewProject'
  import Todos from './Todos/Todos'

  export default {
    name: 'Projects',
    created() {
    },
    data() {
      return {
        selectedTodoType: '',
        selectedTodoId: '',
        selectedTodoDate: '',
        selectedTodoDateRef: null,
        currentProjectId: '',
        projectPercent: '0',
      }
    },
    components: {
      NewTodo,
      TodoCard,
      EditTodo,
      NewProject,
      Todos,
    },
    firestore() {
      return {
        todos: db.collection('Todos'),
        projects: db.collection('Projects'),
      };
    },
    methods: {
      getPercent(project) {
        let percent = 0;
        const todosLength = Object.keys(project.todos).length;

        _.each(project.todos, (todo) => {
          console.log(todo.items, todo.items.length);
          const itemsLength = todo.items.length;
          let checked = 0;

          _.each(todo.items, (item) => {
            console.log(item.checked)
            if (item.checked) {
              checked += 1;
            }
          });

          const todoPercent = (itemsLength > 0) ? checked / itemsLength : 0;
          console.log('todo percent: ', checked, itemsLength, todoPercent);
          percent += todoPercent * (1 / todosLength) * 100;
        });
        return percent === NaN ? 0 : Math.floor(percent);
      },
      checked(list) {
        return list.filter(item => item.checked);
      },
      beforeOpen(event) {
        this.currentProjectId = event.params.projectId;
      },
      openNewProjectModal() {
        this.$modal.show('new-project-modal');
      },
      deleteProject(id) {
        this.$firestore.projects.doc(id).delete();
      },
      newProject(title) {
        this.$modal.hide('new-project-modal');
        const projectRef = this.$firestore.projects.doc();

        db.collection("Projects")
          .doc(projectRef.id)
          .set(
            { name: title,
              id: projectRef.id,
              todos: [],
            });
      },
      openNewTodoModal(projectId) {
        console.log('open  new todo modal');
        this.$modal.show('new-todo-modal', { projectId });
      },
      newTodo(name, projectId, created) {
        const project = this.$firestore.projects.doc(projectId)

        this.$modal.hide(`new-todo-modal`);

        const ref = this.$firestore.todos.doc();
        this.selectedTodoId = ref.id;

         project.get()
          .then( ( doc ) => {
           const todos = {
             ...doc.data().todos,
              [this.selectedTodoId]: {
               name,
               type:    'project',
               created,
               items:   [],
               project: this.currentProjectId,
               id:      this.selectedTodoId,
              }
            };
            project.set( { todos }, { merge: true } )
          });

        setTimeout(() => {
          this.openEditModal(ref.id, created);
        }, 100)
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
    background: #74cce4;
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
