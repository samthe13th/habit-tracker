<template>
  <div>
    <goal-card></goal-card>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import GoalCard from './Card.vue';

  export default {
    components: { GoalCard },
    name:       'Goals',
  }

</script>

<style scoped>
</style>
