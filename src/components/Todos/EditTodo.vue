<template>
  <div class="edit-modal" v-if="project.todos && project.todos[id]">
   <div class="edit-modal__header">
      {{ project.todos[id].name }}
<!--     <button @click.prevent.stop="openDropdown($event, { test: 'test'})">test</button>-->
<!--       <b-dropdown class="group-dropdown" toggle-class="menu-dropdown" id="ddown1" :text="project.groups[project.todos[id].group].name">
         <b-dropdown-item
           @click="toggleGroup(group.id)"
           v-for="group in project.groups"
         >
           {{ group.name === '_no-group' ? 'none' : group.name }}
         </b-dropdown-item>
       </b-dropdown>-->
     <button style="margin-left: auto" @click="openEditTodoModal(project.todos[id].name)">edit</button>
    </div>

    <div style="overflow: auto">
      <div
        v-if="project.todos[id].items"
        class="edit-modal__content-list"
        v-for="(item, index) in project.todos[id].items">

        <label class="container">
          {{ item.name }}
          <input
            v-on:click="toggleTodoItem(index, item.name, $event)"
            :value="item.name"
            v-model="item.checked"
            type="checkbox">
          <span class="checkmark todo_checkmark"></span>
        </label>

        <button class="x-button" @click="deleteListItem(index)">&#10761</button>
      </div>
    </div>

    <input
      class="text-input"
      ref="todoName"
      v-model="todoName"
      placeholder="new item"
      v-on:keyup.enter="submitItem"/>

    <modal name="edit-todo-list-modal" :width="400" :height="'auto'" :adaptive="true">
      <form-dialog
        title="Edit Todo"
        :inputs="[
          { type: 'text-input', class: 'text-input', label: 'Name', name: 'name' },
          { type: 'dropdown', class: '', label: 'Group', name: 'groupId', options: groupOptions }
          ]"
        :output="{
          name: 'edit-todo',
          params: {
            name: todoName,
            groupId: groupId,
          }
        }"
        @edit-todo="editTodo"/>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import FormDialog from './FormDialog'
  import dropdown from 'vue-dropdowns';

  export default {
    props:   [
      'id',
      'title',
      'projectId',
      'groupId',
    ],
    components: {
      FormDialog,
      dropdown,
    },
    data() {
      return {
        checkedTodos: [],
        todoName: '',
        content: document.getElementById('edit-modal-content'),
        groupOptions: [
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me 2' }
        ]
      }
    },
    firestore() {
      return {
        project:  db.collection('Projects').doc( this.projectId ),
      };
    },
    methods: {
      methodToRunOnSelect(payload) {
        console.log("select")
      },
      openEditTodoModal(name) {
        this.todoName = name;
        this.$modal.show('edit-todo-list-modal', { name });
      },
      optionClicked (event) {
        window.alert(JSON.stringify(event))
      },
      editTodo(params) {
        this.$modal.hide('edit-todo-list-modal');
        console.log("edit todo: ", params);
        const project = this.$firestore.project;
        console.log({project})
        project.get().then((doc) => {
          console.log({doc})
          const todos = doc.data().todos;
          project.update({
            todos: {
              ...todos,
              [this.id]: {
                ...todos[this.id],
                name: params.name,
              }
            }
          });
        })

      },
      removeItem(list, index) {
        return list.filter((x,i) => {
          return i !== index;
        });
      },
      toggleGroup(id) {
        this.changeGroup(id, this.id);
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
      dropdownName(group) {
        return group === '_no-group' ? 'group' : group;
      },
      deleteListItem( index ) {
        this.$firestore.project.get().then((doc) => {
            const todo  = doc.data().todos[ this.id ];
            const items = this.removeItem( todo.items, index );

            this.$firestore.project.set( {
              todos: {
                [this.id]: {
                  ...todo,
                  items
                }
              }
            }, { merge: true } )
          } )
      },
      toggleTodoItem( index, name, e ) {
        this.$firestore.project.get()
          .then( ( doc ) => {
            const todos = doc.data().todos;
            const todo  = todos[ this.id ];
            const items = _.clone( todo.items );

            items[ index ] = {
              name:    todo.items[ index ].name,
              checked: e.target.checked
            };

            this.$firestore.project.set( {
              todos: {
                ...todos,
                [this.id]: {
                  ...todo,
                  items
                }
              }
            }, { merge: true } )
          } )
      },
      submitItem() {
        if( this.todoName !== '' ) {
          const item    = {
            name:    this.todoName,
            checked: false
          };
          this.todoName = '';

          this.$firestore.project.get()
            .then( (doc) => {
              const todos = doc.data().todos;
              const todo = todos[this.id];

              this.$firestore.project.set( {
                    todos: {
                      ...todos,
                      [this.id]: {
                        ...todo,
                        items: [
                          ...todo.items,
                          item,
                        ]
                      }
                    }
              }, { merge: true } )
            });
        }
      }
    }
  }
</script>

<style scoped>
  .edit-modal .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
    flex-shrink: 0;
  }

  .edit-modal .text-input:focus {
    border-bottom: 2px solid #7599c4;
  }

  .todo_checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: #eee;
    border-radius: 5px;
  }

  .container input:checked ~ .todo_checkmark {
    background-color: #6b99c8;
  }

  .todo_checkmark:after {
    top: 0;
    border-radius: 50%;
    background: none;
    color: white;
    content: "\2713";
    position: absolute;
    display: none;
    font-size: 18px;
  }

  .edit-modal__content-list {
    display: flex;
    align-items: center;
    background: white;
    padding: 0 6px;
  }

  .edit-modal__content-list:first-child {
    border-radius: 6px 6px 0 0;
  }

  .edit-modal__content-list:last-child {
    border-radius: 0 0 6px 6px;
  }

  .edit-modal__content-list.form-input:focus {
    border-bottom: 4px solid #7599c4;
  }

  .x-button {
    background: none;
    color: #c3c2c2;
    border-radius: 5px;
    height: 32px;
    width: 32px;
    background: 0;
    font-size: 18px;
  }

  .x-button:hover {
    background: #f4f2f2;
    color: black
  }
  .x-button:focus {
    outline: none;
  }

  .edit-modal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .edit-modal__header {
    height: 76px;
    background: #7599c4;
    color: white;
    padding-left: 20px;
    line-height: 76px;
    font-size: 20px;
  }

  .edit-modal__content {
    flex: 1;
    overflow: scroll;
    padding: 20px;
    background: #f5f2f2;
  }

  .edit-modal__content input {
    width: 80%;
    margin: 10px 0;
    background: white;
    padding: 0 20px;
  }

  .edit-modal__footer {
    height: 60px;
    border-top: solid;
  }
</style>
