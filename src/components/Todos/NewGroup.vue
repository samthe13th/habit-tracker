<template>
  <div class="custom-modal">

    <h3>New Group</h3>
    <input placeholder="Name" ref="titleInput" class="text-input " v-model="name" maxlength="60">

    <h5>Color</h5>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 240px; margin-bottom: 30px">
      <span v-for="color in colors" class="color-swatch" v-bind:style="{ background: color }"></span>
    </div>

    <button :disabled="name === ''" class="action-button" @click="$emit('new-group', title, projectId, formattedDate())">Create</button>
  </div>
</template>


<script>
  import Vue from 'vue'

  export default {
    name: 'NewGroup',
    props: [
      'projectId',
    ],
    data() {
      return {
        name: '',
        defaultColor: '#ffffff',
        colors: [
          '#ffca6e',
          '#f8f086',
          '#b9f09d',
          '#4cdb9d',
          '#80d4ca',
          '#98dcf5',
          '#72b9fc',
          '#a1a1ec',
          '#dda1ec',
          '#e98aaa',
          '#e47070',
          '#fa9f71',
        ]
      }
    },
    methods: {
      formattedDate() {
        return this.date.toLocaleDateString("en-US", this.dateOptions)
      },
    },
  }

</script>

<style>
  .custom-modal .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
  }
  .color-swatch {
    height: 30px;
    width: 30px;
    margin: 5px;
  }

  .custom-modal h5 {
    font-size: 18px;
  }
</style>
