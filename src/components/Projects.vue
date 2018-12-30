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
      <div v-for="project in projects" class="project-list project-card">

        <div style="margin-left: 20px; color: #2a4865">
          <h2>{{ project.name }} <!--<span>({{ getPercent(project) }}%)</span>--></h2>

          <span class="project-buttons-group">
            <button class="menu-button" v-on:click="openNewTodoModal(project.id)">New Todo</button>
            <button class="menu-button" v-on:click="openNewGroupModal(project.id)">New Group</button>
            <button v-on:click="openEditProjectModal(project.id, project.name)" class="todo-card__button menu-button">Edit Project</button>
            <button v-on:click="deleteProject(project.id)" class="todo-card__button menu-button">Delete Project</button>
          </span>
        </div>

        <todos :project="project"></todos>
      </div>
    </div>

    <modal name="new-project-modal" :width="400">
      <new-project @new-project="newProject"/>
    </modal>

    <modal name="edit-project-modal" :width="400" :height="'auto'" :adaptive="true" @before-open="beforeOpen">
      <form-dialog
        title="Edit Project"
        :inputs="[{ type: 'text-input', class: 'text-input',label: 'Name', name: 'projectName' }]"
        :output="{
          name: 'edit-project',
          params: {
            projectId: currentProjectId,
            projectName: currentProjectName
          }
        }"
        @edit-project="editProject"/>
    </modal>

    <modal name="new-todo-modal" :adaptive="true" :width="400" @before-open="beforeOpen">
      <new-todo :projectId="currentProjectId" @new-todo="newTodo"/>
    </modal>

    <modal name="new-group-modal" :adaptive="true" :height="400" :width="400" @before-open="beforeOpen">
      <new-group :projectId="currentProjectId" @new-group="newGroup"/>
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
  import NewGroup from './Todos/NewGroup'
  import Todos from './Todos/Todos'
  import FormDialog from './Todos/FormDialog'

  export default {
    name: 'Projects',
    data() {
      return {
        selectedTodoType: '',
        selectedTodoId: '',
        selectedTodoDate: '',
        selectedTodoDateRef: null,
        currentProjectId: '',
        currentProjectName: '',
        projectPercent: '0',
      }
    },
    components: {
      NewTodo,
      TodoCard,
      EditTodo,
      NewProject,
      Todos,
      NewGroup,
      FormDialog,
    },
    firestore() {
      return {
        todos: db.collection('Todos'),
        projects: db.collection('Projects'),
        groups: db.collection('Groups'),
      };
    },
    methods: {
      getPercent(project) {
        let percent = 0;
        const todosLength = Object.keys(project.todos).length;

        _.each(project.todos, (todo) => {
          const itemsLength = todo.items.length;
          let checked = 0;

          _.each(todo.items, (item) => {
            if (item.checked) {
              checked += 1;
            }
          });

          const todoPercent = (itemsLength > 0) ? checked / itemsLength : 0;
          percent += todoPercent * (1 / todosLength) * 100;
        });
        return percent === NaN ? 0 : Math.floor(percent);
      },
      checked(list) {
        return list.filter(item => item.checked);
      },
      beforeOpen(event) {
        console.log('before open: ', event.params)
        const params = event.params;
        if (params.projectId) {
          this.currentProjectId = event.params.projectId;
        }
        if (params.projectName) {
          this.currentProjectName = event.params.projectName;
        }
      },
      openNewProjectModal() {
        this.$modal.show('new-project-modal');
      },
      openNewGroupModal(projectId) {
        this.$modal.show('new-group-modal', { projectId });
      },
      openNewTodoModal(projectId) {
        this.$modal.show('new-todo-modal', { projectId });
      },
      deleteProject(id) {
        this.$firestore.projects.doc(id).delete();
      },
      openEditProjectModal(projectId, projectName) {
        console.log('open edit...', projectId)
        this.$modal.show('edit-project-modal', { projectId, projectName });
      },
      newProject(title) {
        this.$modal.hide('new-project-modal');
        const projectRef = this.$firestore.projects.doc();
        const defaultGroup = this.$firestore.groups.doc().id;

        db.collection("Projects")
          .doc(projectRef.id)
          .set(
            { name: title,
              id: projectRef.id,
              defaultGroup,
              groups: {
                [defaultGroup]: {
                  id: defaultGroup,
                  name: '_no-group',
                  color: '#ffffff',
                  todos: [],
                }
              },
            });
      },
      editProject(params) {
        console.log('EDIT: ', {params})
        const project = this.$firestore.projects.doc(params.projectId);
        console.log("PROJECT: ", project)
        project.set({
          name: params.projectName
        }, { merge: true });
        this.$modal.hide('edit-project-modal');
      },
      newGroup(projectId, name, color) {
        console.log("new group: ", projectId, name, color);
        this.$modal.hide('new-group-modal');

        const project = this.$firestore.projects.doc(projectId);
        const groupId = this.$firestore.groups.doc().id;

        project.get().then((doc) => {
          project.set({
            groups: {
              ...doc.data().groups,
              [groupId]: {
                id: groupId,
                name,
                color,
                todos: [],
              }
            }
          }, { merge: true })
        })
      },
      newTodo(name, projectId, groupId, created) {
        const project = this.$firestore.projects.doc(projectId);

        this.$modal.hide(`new-todo-modal`);

        const ref = this.$firestore.todos.doc();

        this.selectedTodoId = ref.id;

         project.get()
          .then( (doc) => {
            project.set({
              todos: {
                ...doc.data().todos,
                [ref.id]: {
                  name,
                  id: ref.id,
                  group: groupId,
                  items: [],
                  created,
                  type: 'project',
                }
              },
              groups: {
                ...doc.data().groups,
                [groupId]: {
                  ...doc.data().groups[ groupId ],
                  todos: [
                    ...doc.data().groups[ groupId ].todos,
                    ref.id
                  ]
                }
              }
            }, { merge: true });
          });

        setTimeout(() => {
         // this.openEditModal(ref.id, created);
        }, 100)
      },
    }
  }
</script>

<style scoped>

  .project-buttons-group {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .project-buttons-group button {
    margin-right: 20px;
  }

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
    background: #7599c4;
    height: 60px;
    display: flex;
    flex-shrink: 0;
    padding-left: 30px;
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
    padding: 20px;
    overflow: scroll;
  }

  .project-card {
    background: rgb(227, 236, 246);
    margin: 10px auto;
    padding: 30px 10px;
    border-radius: 10px;
    width: 100%;
    max-width: 1100px;
  }

  .todos-list--wrapper h5 {
    margin: 20px;
  }
</style>
