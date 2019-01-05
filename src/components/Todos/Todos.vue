<template>

  <div v-if="project && project.groups && project.todos">

    <div
      v-if="(Object.keys(project.groups).length > 1 || Object.keys(project.todos).length > 0)"
      v-for="group in sortedList(project.groups, 'name')"
      class="group-wrapper"
    >
      <div class="group-header" v-if="group.name !== '!!default'">
        <div class="group-header__swatch" v-bind:style="{ 'background': group.color }"></div>
        <div>{{ group.name }}</div>

        <button
          @click="openGroupEditModal(group.id, group.name, group.color)"
          style="font-size: 16px; margin-left: 10px"
          class="todo-card__button menu-button">
          Edit
        </button>

        <button
          @click="openGroupDeleteModal(group.id)"
          style="font-size: 16px; margin-left: 10px"
          class="todo-card__button menu-button">
          Delete
        </button>

      </div>

      <div class="todos-list">

        <template
          v-if="group.todos.length > 0 && project.todos"
          v-for="(id, index) in group.todos">

          <em style="margin-left: 20px; font-size: 16px"
            v-if="group.todos.length === 0 && group.id !== project.defaultGroup">
            No todos in this group yet!
          </em>

          <div style="display: flex; align-items: center">
            <todo-card
              v-if="project.todos[id]"
              :project="project.todos[id].project"
              :id="index"
              :name="project.todos[id].name"
              :items="items(project.todos[id].items)"
              :checked="checked(project.todos[id].items)"
              :color="project.groups[project.todos[id].group].color"
              @edit-todo="openEditModal(project.todos[id].group, id, project.todos[id].created)"
              @delete-todo="openDeleteTodoModal(project.todos[id].group, id)"
            ></todo-card>

            <button
              @click="openEditTodoListModal(project.todos[id].name, id)"
              style="font-size: 16px; margin-left: 10px; margin-bottom: 10px"
              class="todo-card__button menu-button">
              Edit
            </button>

            <button
              @click="openDeleteTodoModal(project.todos[id].group, id)"
              style="font-size: 16px; margin-left: 10px; margin-bottom: 10px"
              class="todo-card__button menu-button">
              Delete
            </button>

          </div>
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
        :id="selectedTodo.id">
      </edit-todo>
    </modal>

    <modal :name="`${project.id}__edit-group-modal`" :width="400" :height="'auto'">
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
        @edit-group="editGroup" />
    </modal>

    <modal :name="`${project.id}__new-todo-modal`" :width="400" :height="'auto'">
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

    <modal :name="`${project.id}__delete-group-modal`" :width="400" :height="'auto'">
      <confirmation-dialog
        message="Are you sure you want to delete this group? The todos inside will not be deleted."
        output="delete-group"
        @delete-group="deleteGroup"
      ></confirmation-dialog>
    </modal>

    <modal :name="`${project.id}__delete-todo-modal`" :width="400" :height="'auto'">
      <confirmation-dialog
        message="Are you sure you want to delete this todo?"
        output="delete-todo"
        @delete-todo="deleteTodo"
      ></confirmation-dialog>
    </modal>

    <modal
      :name="`${project.id}__edit-todo-list-modal`"
      :width="400"
      :height="'auto'"
      :adaptive="true">

     <form-dialog
        title="Edit Todo"
        :inputs="[
          { type: 'text-input', class: 'text-input', label: 'Name', name: 'todoName' },
          { type: 'dropdown', class: '', label: 'Group', name: 'groupId', options: getGroupOptions(project.groups) }
         ]"
        :output="{
          name: 'edit-todo',
          params: {
            todoId: selectedTodo.id,
            groupId: selectedGroup.id,
            selectedItem: selectedGroup.name,
            todoName: selectedTodo.name,
          }
        }"
        @edit-todo="editTodo"/>

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
    props:      [
      "project"
    ],
    data() {
      return {
        selectedTodo:        {
          id:      '',
          groupId: '',
          date:    '',
        },
        selectedGroup:       {
          id:   '',
          name: ''
        },
        groupOptions: [
          { title: 'a' },
          { title: 'b' },
          { title: 'c' }
          ],
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
        todos:    db.collection( 'Todos' ),
        projects: db.collection( 'Projects' ),
      };
    },
    methods:    {
      getGroupOptions(groups) {
        return _.map(groups, group => ({ title: group.name, value: group.id }));
      },
      items( items ) {
        return items ? items.length : 0;
      },
      checked( list ) {
        return list ? list.filter( item => item.checked ) : 0;
      },
      beforeOpen( event ) {
        this.currentProjectId = event.params.projectId;
      },
      openEditModal( groupId, id, date ) {
        console.log( 'open... ', groupId )
        this.selectedTodo     = {
          groupId,
          id,
          date
        };
        this.selectedTodoId   = id;
        this.selectedTodoDate = date;
        this.$modal.show( `${this.project.id}__edit-todo` );
      },
      openNewTodoModal( groupId ) {
        this.$modal.show( `${this.project.id}__new-todo-modal` );
      },
      newTodo() {
        console.log('test')
      },
      openEditTodoListModal(name, id) {
        this.selectedTodo.id = id;
        this.selectedTodo.name = name;
        this.todoName = name;
        this.$modal.show(`${this.project.id}__edit-todo-list-modal`, { name });
      },
      openGroupEditModal( groupId, groupName, groupColor ) {
        this.selectedGroup =
          {
            id:    groupId,
            name:  groupName,
            color: groupColor
          };
        console.log( "select... ", this.selectedGroup );
        this.$modal.show( `${this.project.id}__edit-group-modal` );
      },
      openGroupDeleteModal( groupId ) {
        console.log( { groupId } );
        this.selectedGroup.id = groupId;
        console.log( 'selectedGroup: ', this.selectedGroup.id )
        this.$modal.show( `${this.project.id}__delete-group-modal` );
      },
      openDeleteTodoModal(groupId, todoId) {
        this.$modal.show(`${this.project.id}__delete-todo-modal`);
        this.selectedTodo.id = todoId;
        this.selectedGroup.id = groupId;
      },
      changeGroup(newGroupId, todoId) {
        console.log('new group: ', newGroupId)
        console.log(this.$firestore.project);
        const project = this.$firestore.project;

        project.get().then((doc) => {
          const projectData = doc.data();
          const currentGroupId = _.clone(doc.data().todos[todoId].group);
          const currentTodos = doc.data().groups[currentGroupId]
            .todos
            .filter(todo => todo !== todoId);

          project.set({
            ...projectData,
            todos: {
              ...projectData.todos,
              [todoId]: {
                ...projectData.todos[todoId],
                group: newGroupId,
              },
            },
            groups: {
              ...projectData.groups,
              [currentGroupId]: {
                ...projectData.groups[currentGroupId],
                todos: currentTodos,
              },
              [newGroupId]: {
                ...projectData.groups[newGroupId],
                todos: [
                  ...projectData.groups[newGroupId].todos,
                  todoId
                ]
              }
            }
          }, { merge: true })
        })
      },
      deleteTodo(confirm) {
        this.$modal.hide(`${this.project.id}__delete-todo-modal`);
        if (confirm === false) return;

        const project = this.$firestore.projects.doc(this.project.id);

        project.get()
          .then( ( doc ) => {
            const groupTodos = _.filter( doc.data().groups[ this.selectedGroup.id ].todos, todo => {
              return todo !== this.selectedTodo.id
            });

            const todos = _.clone(doc.data().todos);
            delete todos[this.selectedTodo.id];

            project.update( {
              ...doc.data(),
              groups: {
                ...doc.data().groups,
                [this.selectedGroup.id]: {
                  ...doc.data().groups[ this.selectedGroup.id ],
                  todos: groupTodos,
                }
              },
              todos,
            })
          })
      },
      deleteGroup(confirm) {
        this.$modal.hide( `${this.project.id}__delete-group-modal` );
        if (confirm === false) return;

        const project = this.$firestore.projects.doc( this.project.id );

        project.get()
          .then( ( doc ) => {
            const groups = _.clone(doc.data().groups);
            const defaultGroup = doc.data().defaultGroup;
            delete groups[this.selectedGroup.id];

            let todos = doc.data().todos;

            _.each(doc.data().groups[this.selectedGroup.id].todos, (id) => {
              groups[defaultGroup].todos.push(id);
              todos[id].group = defaultGroup;
            });

            project.update({
              groups,
              todos,
            })
          });
      },
      editGroup( params ) {
        console.log( { params } )
        const project = this.$firestore.projects.doc( params.projectId );
        this.$modal.hide(`${this.project.id}__edit-group-modal`);

        project.get()
          .then( (doc) => {
            const group = doc.data().groups[ params.groupId ];
            project.set({
              groups: {
                ...project.groups,
                [params.groupId]: {
                  ...group,
                  name:  params.groupName,
                  color: params.groupColor,
                }
              }
            }, {
              merge: true
            });
          });
      },
      editTodo(params) {
        this.$modal.hide(`${this.project.id}__edit-todo-list-modal`);
        const project = this.$firestore.projects.doc(this.project.id);
        const newGroupId = params.selectedItem.value;

        project.get().then((doc) => {
          const todos = doc.data().todos;
          const currentGroupId = _.clone(doc.data().todos[this.selectedTodo.id].group);
          const currentTodos = doc.data().groups[currentGroupId]
            .todos
            .filter(todo => todo !== this.selectedTodo.id);

          console.log('current group id: ', currentGroupId, 'new group id: ', params.selectedItem.value);

          project.update({
            todos: {
              ...todos,
              [this.selectedTodo.id]: {
                ...todos[this.selectedTodo.id],
                name: params.todoName,
                group: newGroupId
              }
            },
            groups: {
              ...doc.data().groups,
              [currentGroupId]: {
                ...doc.data().groups[currentGroupId],
                todos: currentTodos,
              },
              [newGroupId]: {
                ...doc.data().groups[newGroupId],
                todos: [
                  ...doc.data().groups[newGroupId].todos,
                  this.selectedTodo.id
                ]
              }
            }
          });
        })
      },
      openNewProjectModal() {
        this.$modal.show( 'new-project-modal' );
      },
      beforeOpen(event) {
        console.log('BO: ', event.params)
      },
      newProject( title ) {
        this.$modal.hide( 'new-project-modal' );
        const projectRef = this.$firestore.projects.doc();

        db.collection( "Projects" )
          .doc( projectRef.id )
          .set(
            {
              name:  title,
              id:    projectRef.id,
              todos: {},
            } );
      },
      createHabit( newHabit ) {
        this.$modal.hide( 'add-habit-modal' );
        if( newHabit.period === 'daily' ) {
          const ref = db.collection( 'DailyHabits' )
            .doc();
          const id  = ref.id;
          ref.set( {
            ...newHabit,
            id,
            private: false
          } );
        }
      },
      sortedList( list, sortBy ) {
        return _.sortBy( list, item => item[sortBy] );
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
    margin: 10px 20px 10px 20px;
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
    background: #fb7979;
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
    flex-direction: column;
    flex-wrap: wrap;
    overflow: scroll;
    padding: 0 20px;
  }

</style>
