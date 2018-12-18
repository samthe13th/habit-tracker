<template>
  <div class="custom-modal">

    <h3>New Group</h3>
    <input placeholder="Name" ref="titleInput" class="text-input" v-model="name" maxlength="60">

    <h5>Color</h5>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 240px; margin-bottom: 30px">
      <template v-for="color in colors">
        <span
          v-on:click="selectSwatch(color)"
          v-bind:style="{ background: color }"
          v-bind:class="[ selectedSwatch === color ? 'color-swatch--selected' : '', 'color-swatch' ]" >
        </span>
      </template>
    </div>

    <button :disabled="name === ''" class="action-button" @click="$emit('new-group', projectId, name, selectedSwatch)">Create</button>
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
        selectedSwatch: '#ffca6e',
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
      selectSwatch(color) {
        if (color !== this.selectedSwatch) {
          this.selectedSwatch = color;
        }
      }
    },
  }

</script>

<style>

  .color-swatch--selected:after {
    color: white;
    content: "\2713";
    font-size: 23px;
    position: absolute;
    top: 0;
    width: 30px;
    text-align: center;
    height: 30px;
  }

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
    cursor: pointer;
    position: relative;
  }

  .color-swatch:hover {
    opacity: 0.6;
  }

  .custom-modal h5 {
    font-size: 18px;
  }
</style>
