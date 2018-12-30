<template>

  <div v-if="project">
    <div
      v-if="project.groups && (Object.keys(project.groups).length > 1 || Object.keys(project.todos).length > 0)"
      v-for="group in project.groups"
      class="group-wrapper"
    >
      <div class="group-header" v-if="group.name !== '_no-group'">
        <div class="group-header__swatch" v-bind:style="{ 'background': group.color }"></div>
        <div>{{ group.name }}</div>
        <button
          v-on:click="openGroupEditModal(group.id, group.name, group.color)"
          style="font-size: 16px; margin-left: 10px"
          class="todo-card__button menu-button">
          Edit
        </button>
        <button
          v-on:click="openGroupDeleteModal(group.id)"
          style="font-size: 16px; margin-left: 10px"
          class="todo-card__button menu-button">
          Delete
        </button>
      </div>

      <em style="margin-left: 20px; font-size: 16px"
        v-if="group.todos.length === 0 && group.id !== project.defaultGroup">
        No todos in this group yet!
      </em>

      <div class="todos-list">

        <template
          v-if="group.todos && project.todos"
          v-for="(id, index) in group.todos">
          <todo-card
            v-if="project.todos[id]"
            :project="project.todos[id].project"
            :id="index"
            :name="project.todos[id].name"
            :items="items(project.todos[id].items)"
            :checked="checked(project.todos[id].items)"
            :color="project.groups[project.todos[id].group].color"
            @edit-todo="openEditModal(project.todos[id].group, id, project.todos[id].created)"
            @delete-todo="deleteTodo(project.todos[id].group, id, project.id)"
          ></todo-card>
        </template>

      </div>

    </div>

    <modal :name="`${project.id}__edit-todo`" :adaptive="true" :height="'90%'" :draggable="true">
      <edit-todo
        v-if="selectedTodo"
        :title="`${project.name} TODO`"
        :date="selectedTodo.date"
        :projectId="project.id"
        :groupId="selectedTodo.groupId"
        :type="selectedTodoType"
        :id="selectedTodo.id">
      </edit-todo>
    </modal>

    <modal name="edit-group-modal" :width="400" :height="'auto'">
      <form-dialog
        title="Edit Group"
        :inputs="[
          { type: 'text-input', class: 'text-input', label: 'Name', name: 'groupName' },
          { type: 'color', class: '', label: 'Color', name: 'groupColor' }
        ]"
        :output="{
          name: 'edit-group',
          params: {
            projectId: project.id,
            groupId: selectedGroup.id,
            groupName: selectedGroup.name,
            groupColor: selectedGroup.color,
          }
        }"
        @edit-group="editGroup"/>
    </modal>

    <modal name="new-todo-modal" :width="400" :height="'auto'">
      <form-dialog
        title="New Todo"
        :inputs="[
          { type: 'text-input', class: 'text-input', label: 'Name', name: 'todoName' },
        ]"
        :output="{
          name: 'new-todo',
          params: {
            projectId: project.id,
            groupId: selectedGroup.id,
            todoName: '',
          }
        }"
        @new-todo="newTodo"/>
    </modal>

    <modal name="delete-group-modal" :width="400" :height="'auto'">
      <confirmation-dialog
        message="Are you sure you want to delete this group?"
        output="delete-group"
        @delete-group="deleteGroup"
      >
      </confirmation-dialog>
    </modal>

  </div>
</template>


<script>
import firebase from 'firebase'
import * as _ from 'lodash'
import { db } from '../../main'
import TodoCard from './TodoCard'
import EditTodo from './EditTodo'
import NewProject from './NewProject'
import FormDialog from './FormDialog'
import ConfirmationDialog from './ConfirmationDialog'

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
      selectedTodo: {
        id: '',
        groupId: '',
        date: '',
      },
      selectedGroup: {
        id: '',
        name: ''
      }
    }
  },
  components: {
    TodoCard,
    EditTodo,
    NewProject,
    FormDialog,
    ConfirmationDialog,
  },
  firestore() {
    return {
      todos: db.collection('Todos'),
      projects: db.collection('Projects'),
    };
  },
  methods: {
    items(items) {
      return items ? items.length : 0;
    },
    checked(list) {
      return list ? list.filter(item => item.checked): 0;
    },
    beforeOpen(event) {
      this.currentProjectId = event.params.projectId;
    },
    openEditModal(groupId, id, date) {
      console.log('open... ', groupId)
      this.selectedTodo = {
        groupId, id, date
      };
      this.selectedTodoId = id;
      this.selectedTodoDate = date;
      this.$modal.show(`${this.project.id}__edit-todo`);
    },
    openNewTodoModal(groupId) {
      this.$modal.show('new-todo-modal');
    },
    openGroupEditModal(groupId, groupName, groupColor) {
      this.selectedGroup = { id: groupId, name: groupName, color: groupColor };
      console.log("select... ", this.selectedGroup);
      this.$modal.show('edit-group-modal');
    },
    openGroupDeleteModal(groupId) {
      console.log({groupId});
      this.$modal.show('delete-group-modal');
    },
    deleteTodo(groupId, todoId, projectId) {
      const project = this.$firestore.projects.doc(projectId);

       project.get().then((doc) => {
         const projectData = doc.data();
        const todos = _.clone(projectData.groups[groupId].todos);
        delete todos[todoId];
        project.update({
          ...projectData,
          groups: {
            ...projectData.groups,
            [groupId]: {
              ...projectData.groups[groupId],
              todos: todos,
            }
          }
        })
      })
    },
    editGroup(params) {
      console.log({params})
      const project = this.$firestore.projects.doc(params.projectId);
      this.$modal.hide('edit-group-modal');

      project.get().then((doc) => {
        const group = doc.data().groups[params.groupId];
        project.set({
          groups: {
            ...project.groups,
            [params.groupId]: {
              ...group,
              name: params.groupName,
              color: params.groupColor,
            }
          }
        }, { merge: true });
      });
    },
    openNewProjectModal() {
      this.$modal.show('new-project-modal');
    },
    deleteGroup(confirm) {
      console.log('dialog group: ', confirm);
      this.$modal.hide('delete-group-modal');
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
    newTodo(params) {
      console.log('new todo: ', params);
    }
  }
}
</script>

<style scoped>
  .group-wrapper {
    margin-top: 30px;
  }
  .group-card {
    display: flex;
    flex-direction: column;
    width: 100%
  }

  .group-header {
    font-size: 24px;
    display: flex;
    margin: 10px 20px 0 20px;
  }

  .group-header__swatch {
    width: 30px;
    height: 30px;
    border: solid white;
    margin-right: 10px;
    border-radius: 100%;
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
    margin-left: 10px;
  }

</style>
