<template>
  <div class="module">

    <div v-if="project">
     <!-- <em style="margin-left: 20px" v-if="project.groups[project.defaultGroup].todos.length === 0">No todos in this project yet!</em>-->
      <div v-if="Object.keys(group.todos).length > 0" v-for="group in project.groups" class="group-card">
        <h5 class="group-header" v-if="group.name !== '_no-group'">{{ group.name }}</h5>
        <div class="todos-list">
          <todo-card
            v-if="group.todos"
            v-for="(todo, index) in group.todos"
            :project="todo.project"
            :id="index"
            :name="todo.name"
            :items="todo.items.length"
            :checked="checked(todo.items)"
            :color="group.color"
            @edit-todo="openEditModal(group.id, index, todo.created)"
            @delete-todo="deleteTodo(group.id, index, project.id)"
          ></todo-card>
        </div>
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

  </div>
</template>


<script>
import firebase from 'firebase'
import * as _ from 'lodash'
import { db } from '../../main'
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
      selectedTodo: {
        id: '',
        groupId: '',
        date: '',
      }
    }
  },
  components: {
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
    openEditModal(groupId, id, date) {
      this.selectedTodo = {
        groupId, id, date
      };
      console.log('open.... ', this.selectedTodo)
      this.selectedTodoId = id;
      this.selectedTodoDate = date;
      this.$modal.show(`${this.project.id}__edit-todo`);
    },
    deleteTodo(groupId, todoId, projectId) {
      const project = this.$firestore.projects.doc(projectId);

      console.log({project})
       project.get().then((doc) => {
        const todos = doc.data().groups[groupId].todos;
         project.set({
           ...project,
           groups: {
             ...doc.data().groups,
             [groupId]: {
               ...doc.data().groups[groupId],
               todos: todos
             }
           }
         }, { merge: true })
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

  .group-card {
    display: flex;
    flex-direction: column;
    width: 100%
  }

  .group-header {
    margin: 10px 20px 0 20px;
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
    margin-top: 15px;
    margin-bottom: 15px;
  }

</style>
