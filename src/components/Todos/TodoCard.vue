<template>
  <div @mouseover="mouseOver" class="todo-card">
    <div class="todo-card__group-mark" v-bind:style="groupColor"></div>
    <div class="todo-card__title">{{ name }}</div>
    <h5 class="todo-card__summary" style="margin-bottom: 30px">{{ checked.length }} / {{ items }}</h5>
    <div @mouseout="mouseOut" class="todo-card__overlay">
      <button @click="$emit('edit-todo')" class="todo-card__button action-button">Open</button>
      <button @click="$emit('delete-todo')" class="todo-card__button action-button">Delete</button>
    </div>
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
          borderLeft: `solid 20px ${this.color}`,
          borderTop: `solid 20px ${this.color}`,
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
    border-radius: 10px 0;
    border-bottom: solid 20px transparent;
    border-right: solid 20px transparent;
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
    font-size: 38px;
  }

  .todo-card {
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    border-radius: 8px;
    background: white;
    margin: 20px;
    padding: 15px;
    cursor: pointer;
    overflow: hidden;
  }

  .todo-card__title {
    flex: 1;
    padding: 0;
    font-size: 24px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
