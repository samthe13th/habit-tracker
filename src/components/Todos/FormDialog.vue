<template>
  <div class="edit-modal custom-modal">

    <h3>{{ title }}</h3>
    <template v-if="formInputs" v-for="input in formInputs">
      {{ input.label }}

      <!-- TEXT INPUT -->
      <input
        v-if="input.type === 'text-input'"
        v-bind:class="input.class"
        v-model="formOutput.params[input.name]"
        maxlength="60">

      <!-- COLOR -->
      <div
        v-if="input.type === 'color'"
        style="display: flex; flex-direction: row; flex-wrap: wrap; width: 240px; margin-bottom: 30px">
        <span
          v-for="color in colors"
          v-on:click="selectSwatch(color, input.name)"
          v-bind:style="{ background: color }"
          v-bind:class="[ formOutput.params[input.name] === color ? 'color-swatch--selected' : '', 'color-swatch' ]" >
        </span>
      </div>

      <!-- DROPDOWN -->
      <v-menu offset-y v-if="input.type === 'dropdown'">
        <v-btn
          style="outline: none; margin-bottom: 20px"
          slot="activator"
          color="primary"
          dark
        >
          {{ output.params.selectedItem.title }}
        </v-btn>
        <v-list style="left: 0">
          <v-list-tile
            v-for="(item, index) in input.options"
            :key="index"
            @click="selectDropdownItem(item)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>

    <button class="action-button" @click="$emit(formOutput.name, formOutput.params)">Update</button>

  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'

  export default {
    name: 'FormDialog',
    props: [
      'title',
      'inputs',
      'output',
    ],
    data() {
      return {
        formInputs: this.inputs,
        formOutput: this.output,
        dropdownItem: { title: 'none' },
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
      selectSwatch(color, input) {
        if (color !== this.formOutput.params[input]) {
          this.formOutput.params[input] = color;
        }
      },
      selectDropdownItem(item) {
        this.output.params.selectedItem = item;
      }
    }
  }
</script>

<style>
  .edit-modal .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 10px;
    width: calc(100% - 60px);
    border-radius: 5px;
    margin-bottom: 30px;
  }

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
</style>
