<template>
  <div class="custom-modal new-todo">

    <h3>New Todo</h3>

    <input placeholder="Title" ref="titleInput" class="text-input " v-model="title" maxlength="60">

    <!--<span v-for="group in project.groups">{{ group.name }}</span>-->

    <button
      :disabled="title === ''"
      class="action-button"
      @click="$emit('new-todo', title, projectId, selectedGroup.id, formattedDate())">
      Create
    </button>

  </div>
</template>

<script>
  import Vue from 'vue'
  import { db } from '../../main'

  const date = new Date();

  export default {
    props: [
      'projectId',
    ],
    firestore() {
      return {
        project: db.collection('Projects').doc(this.projectId),
      };
    },
    created() {
      console.log("PROJECT: ", this.projectId)
      this.$firestore.project.get().then((doc) => {
        console.log(doc.data().defaultGroup);
        this.selectedGroup.id = doc.data().defaultGroup;
      })
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      });
    },
    data() {
      return {
        selectedGroup: {
          id: '',
          name: '!!default',
        },
        todoType: 'project',
        date: new Date(),
        title: '',
        dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      }
    },
    methods: {
      dropdownName(group) {
        return group === '!!default' ? 'group' : group;
      },
      formattedDate() {
        return this.date.toLocaleDateString("en-US", this.dateOptions)
      },
      toggleDropdown(event) {
        console.log(event);
      },
      toggleGroup(id, name) {
        this.selectedGroup = {
          id,
          name,
        }
        console.log('toggle group: ', id)
      }
    },
  }

</script>

<style>
  .group-dropdown {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .menu-dropdown {
    background: white;
    color: black;
  }

  .menu-dropdown:focus,
  .menu-dropdown:hover {
    background: white;
  }

  .new-todo input {
    text-align: start;
    font-size: 20px;
  }

  .new-todo .text-input {
    padding: 0 10px;
    border: solid 1px lightgrey;
    margin: 20px;
    width: calc(100% - 60px);
    border-radius: 5px;
  }
</style>
