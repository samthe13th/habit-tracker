<template>
  <div class="custom-modal delete-modal">
    <h2>Delete</h2>
    <h3>{{ message }}</h3>
    <div style="display: flex">
      <button class="action-button" @click="$emit(output, true)">Yes</button>
      <button class="action-button" @click="$emit(output, false)">No</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'

  export default {
    name: 'ConfirmationDialog',
    props: [
      'message',
      'output'
    ],
  }
</script>

<style>
  .delete-modal .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 10px;
    width: calc(100% - 60px);
    border-radius: 5px;
    margin-bottom: 30px;
  }
</style>
