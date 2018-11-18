<template>
  <div>
    <div class="habit-title">{{title}}</div>
    <div class="habit-bar" :class="{ 'cell-private': habit && habit.private }">
      <div v-for="day in dateArray" class="cell">
        <data-point
          :id="id"
          :date="day"
          :prevDate="prevDate(day)"
          :nextDate="nextDate(day)">
        </data-point>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import DataPoint from './DataPoint'

  export default {
    name:    'HabitBar',
    components: {
      DataPoint
    },
    firestore() {
      return {
        habit: db.doc(`DailyHabits/${this.id}`)
      }
    },
    data() {
      return {
        isPublic: true,
        incomingStreak: 0,
      }
    },
    created() {
      const month = `${this.dateArray[0].getFullYear()}_${this.dateArray[0].getMonth()}`;
      db.collection(`DailyHabits/${this.id}/log`)
        .doc(month)
        .set({month: month}, {merge: true})
    },
    props:   [
      'title',
      'id',
      'dateArray',
    ],
    methods: {
      prevDate(_date) {
        const prevDate = _.clone(_date);
        prevDate.setDate(_date.getDate() - 1);
        return prevDate;
      },
      nextDate(_date) {
        const nextDate = _.clone(_date);
        nextDate.setDate(_date.getDate() + 1);
        return nextDate;
      },
      togglePrivacy() {
        this.isPublic = !this.isPublic;
      }
    },
  }

</script>

<style scoped>
  .cell {
    width: 80px;
  }

  .cell-private {
    background: #4531d0;
  }

  .habit-bar {
    display: flex;
    flex-direction: row;
    padding: 10px;
    justify-content: space-evenly;
    position: relative;
    height: 45px;
    overflow:hidden;
  }

  .habit-title {
    line-height: 50px;
    font-size: 20px;
    position: absolute;
    padding-right: 10px;
    left: -2px;
    transform: translateX(-100%);
  }
</style>
