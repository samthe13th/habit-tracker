<template>
  <div class="edit-modal">
    <div class="edit-modal__header">{{ list.name }}</div>
    <div class="edit-modal__content" id="edit-modal-content">
      <div class="edit-modal__content-list" v-for="(item, index) in list.items">
        <label class="container">
          {{ item.name }}
          <input
            v-on:click="toggleTodoItem(index, item.name, $event)"
            :value="item.name"
            v-model="item.checked"
            type="checkbox">
          <span class="checkmark todo_checkmark"></span>
        </label>
        <button class="x-button">&#10761</button>
      </div>
      <input
        class="form-input"
        ref="todoName"
        v-model="todoName"
        placeholder="title"
        v-on:keyup.enter="submitItem"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'

  export default {
    props: [
      'id'
    ],
    data() {
      return {
        checkedTodos: [],
        todoName: '',
        content: document.getElementById('edit-modal-content')
      }
    },
    firestore() {
      return {
        list: db.collection('Todos').doc(this.id)
      };
    },
    created() {
      this.$nextTick(() => {
        this.$refs.todoName.focus();
      });
    },
    methods: {
      toggleTodoItem(index, name, e) {
        this.$firestore.list.get().then((snap) => {
          const items = snap.data().items;
          items[index].checked = e.target.checked;
          this.$firestore.list.update({
            items
          })
        })
      },
      submitItem() {
        if (this.todoName !== '') {
          const item = { name: this.todoName, checked: false };
          this.todoName = '';
          this.$firestore.list.get().then((doc) => {
            const items = doc.data().items;
            this.$firestore.list.update({
              items: [...items, item]
            });
          });
          const content = document.getElementById('edit-modal-content');
          content.scrollTop = content.scrollHeight + 20;
        }
      }
    }
  }
</script>

<style scoped>
  .todo_checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: #eee;
    border-radius: 5px;
  }

  .container input:checked~.todo_checkmark {
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
