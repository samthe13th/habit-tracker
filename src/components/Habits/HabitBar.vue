<template>
  <div style="width: 310px; background: white; padding: 20px; margin: 10px; flex-shrink: 0; position: relative">
    <div class="habit-title">{{title}}</div>
    <!-- buttons -->
    <div class="habit-buttons">

      <!-- privacy -->
      <button class="privacy-btn" v-on:click="togglePrivacy(habit.id)">
        e
      </button>

      <!-- delete -->
      <button class="delete-btn" v-on:click="openDeleteDialog(habit.title)">
        x
      </button>

    </div>
    <p style="text-align: left; font-size: 18px">Best streak: 0</p>
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
    <div style="flex: 1; display: flex; justify-content: space-between">
      <div v-for="day in days" class="day">{{day}}</div>
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
        days: ['m', 't', 'w', 'th', 'f', 's', 'su']
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

  .habit-buttons {
    position: absolute;
    top: 0;
    right: 0;
  }

  .habit-buttons button {
    font-size: 24px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: transparent;
    color: lightgrey;
  }

  .habit-buttons button:hover {
    color: #0099CC;
  }

  .cell {
    width: 30px;
    display: flex;
    flex-direction: column;
  }

  .cell-private {
    background: #0099CC;
  }

  .habit-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    padding: 2px 8px;
    margin: 0 -8px;
    height: 34px;
  }

  .habit-title {
    color: black;
    text-align: left;
    font-size: 22px;
  }

  .day {
    z-index: 100;
    width: 30px;
    font-size: 16px;
  }
</style>
