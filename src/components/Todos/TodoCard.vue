<template>
  <div @click="$emit('edit-todo')" class="todo-card">
    <div v-bind:style="{ borderLeftWidth: width(checked.length/items), borderColor: color }" class="todo-card__group-mark"></div>
    <div class="todo-card__title">{{ name }}</div>
    <h5 class="todo-card__summary">{{ checked.length }} / {{ items }}</h5>
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
        barWidth: '100px'
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
      width(n) {
        return `${n * 500}px`;
      }
    }
  }
</script>

<style scoped>

  .todo-card__group-mark {
    height: 100%;
    width: 5px;
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-radius: 8px;
    background: #ffffff;
    margin-bottom: 10px;
    cursor: pointer;
    width: 500px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    padding: 10px 20px;
    border: solid #009bd1 1px;
  }

  .todo-card__title {
    flex: 1;
    padding: 0;
    font-size: 24px;
  }
</style>
