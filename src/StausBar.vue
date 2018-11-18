<template>
  <div>Toolbar 2</div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../main'

  export default {
    name: 'StatusBar',
    data: function() {
      return {
        loggedIn: true,
      }
    },
  }
</script>
