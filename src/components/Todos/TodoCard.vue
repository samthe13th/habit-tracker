<template>
  <div @click="$emit('edit-todo')" class="todo-card">
    <div class="todo-card__group-mark" v-bind:style="groupColor"></div>
    <div class="todo-card__title">{{ name }}</div>
    <h5 class="todo-card__summary">{{ checked.length }} / {{ items }}</h5>
<!--    <div @mouseout="mouseOut" class="todo-card__overlay">
      <button @click="$emit('edit-todo')" class="todo-card__button action-button">Open</button>
      <button @click="$emit('delete-todo')" class="todo-card__button action-button">Delete</button>
    </div>-->
  </div>
</template>

<script>
  import Vue from 'vue';
  import { db } from '../../main';

  export default {
    name: 'TodoCard',
    props: [
      'project',
      'id',
      'name',
      'items',
      'checked',
      'color',
    ],
    data() {
      return {
        overCard: false,
      }
    },
    computed: {
      groupColor: function() {
        return {
          borderColor: this.color,
        }
      }
    },
    methods: {
      mouseOver() {
        this.overCard = true;
      },
      mouseOut() {
        this.overCard = false;
      },
    }
  }
</script>

<style scoped>

  .todo-card__group-mark {
    height: 100%;
    width: 5px;
    border-left-width: 6px;
    border-left-style: solid;
    position: absolute;
    left: 0;
    top: 0;
  }

  .todo-card__overlay {
    display: flex;
    padding: 30px;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    background: none;
    width: 200px;
    height: 200px;
    border-radius: inherit;
  }

  .todo-card__overlay:hover {
     display: flex;
     background: rgba(0,0,0,0.5)
  }

  .todo-card__button {
    display: none;
  }

  .todo-card__overlay:hover .todo-card__button {
    display: block;
  }

  .todo-card__delete {
    position: absolute;
  }

  .todo-card__summary {
    font-size: 26px;
    margin: 0;
  }

  .todo-card {
    position: relative;
    display: flex;
    border-radius: 8px;
    background: white;
    margin-bottom: 10px;
    cursor: pointer;
    width: 100%;
    align-items: center;
    overflow: hidden;
    padding: 10px 20px;
  }

  .todo-card__title {
    flex: 1;
    padding: 0;
    font-size: 24px;
  }
</style>
