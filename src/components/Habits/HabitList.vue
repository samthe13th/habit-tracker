<template>

  <div class="week">

    <h1>Daily Habits</h1>

    <div class="habit-log-header">

      <div
        class="nav-btn nav-btn--left"
        @click="$emit('change-week', startDate, 'left')">
      </div>

      <div v-for="(day, i) in dateArray" class="cell">

        <div style="height: 20px">
          <div v-if="i === 0">{{ months[ startDate.getMonth() ] }}</div>
          <div v-if="day.getDate() === date && day.getMonth() !== startDate.getMonth()">
            {{ months[ day.getMonth() ] }}
          </div>
        </div>

        <div style="position: relative">
          <div
            v-if="day.getDate() === date && day.getMonth() !== startDate.getMonth()"
            class="current-day-overlay">
          </div>
          <h2>{{ days[i].substring(0,2) }}</h2>
          <div>{{ day.getDate() }}</div>
        </div>

      </div>

      <div
        class="nav-btn nav-btn--right"
        @click="$emit('change-week', startDate, 'right')">
      </div>

    </div>


    <template v-for="habit in habits">
      <div style="position: relative; margin: 5px">

        <!-- habit bar -->
        <habit-bar
          class="habit-bar-wrapper"
          :dateArray="dateArray"
          :title="habit.title"
          :id="habit.id">
        </habit-bar>

        <!-- buttons -->
        <div class="habit-buttons">
          <button class="privacy-btn" v-on:click="togglePrivacy(habit.id)">
            <img src="../../assets/lock-96.png" />
          </button>
          <button class="delete-btn" v-on:click="openDeleteDialog(habit.title)">
            Delete
          </button>
        </div>

      </div>
    </template>

    <modal name="delete-habit-modal" :width="400" :height="400">
      <remove-habit @delete-habit="deleteHabit" />
    </modal>

  </div>

</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import Vue from 'vue'
  import HabitBar from './HabitBar'
  import RemoveHabit from './RemoveHabit'

  const date = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNumber = date.getDay();
  const day = days[dayNumber];
  const sundayMonth = displayedMonths();

  export default {
    name: 'HabitList',
    components: {
      HabitBar,
      RemoveHabit,
    },
    data() {
      return {
        sundayMonth,
        months,
        days,
        date: date.getDate(),
        dayNumber,
        day,
        habitToDelete: '',
      }
    },
    props: [
      'dailyHabits',
      'startDate',
      'dateArray',
    ],
    firestore() {
      return {
        habits: db.collection('DailyHabits'),
      }
    },
    methods: {
      openDeleteDialog(title) {
        this.habitToDelete = title;
        this.$modal.show('delete-habit-modal');
      },
      deleteHabit(followThrough) {
        if (followThrough) {
        this.$firestore.habits
          .where("title", "==", this.habitToDelete)
          .get()
          .then((snap) => {
            var batch = db.batch();

            snap.forEach((doc) => {
             this.deleteLog(doc.data().id);
             batch.delete(doc.ref);
            });

            batch.commit();
          })
        }
        this.$modal.hide('delete-habit-modal');
      },
      deleteLog(id) {
        const log = db.collection(`DailyHabits/${id}/log`);
        log.get().then((snapshot) => {
          const batch = db.batch();

          snapshot.forEach((doc) => {
            batch.delete(doc.ref);
          })
          batch.commit();
        })
      },
      togglePrivacy(id) {
        db.doc(`DailyHabits/${id}`)
      },
    },
  }

  function displayedMonths() {
    const start = new Date();
    start.setDate(date.getDate() - date.getDay())
    return months[start.getMonth()];
  }

</script>

<style scoped>
  td {
    max-width: 50px;
  }

  .cell {
    width: 80px;
  }

  .week {
    width: 700px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }

  .habit-log-header {
    padding: 15px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .habit-bar-wrapper {
    border: solid 1px #2196F3;
    border-radius: 6px;
    position: relative;
  }

  .current-day-overlay {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: solid 2px lightseagreen;
    height: 96px;
    width: 50px;
  }

  .nav-btn {
    cursor: pointer;
    content: '';
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    width: 0;
    height: 0;
    transition: all 170ms ease;
    transform: translateY(150%)
  }

  .nav-btn--left {
    border-right: 17px solid #eee;
    margin-left: -20px;
  }

  .nav-btn--left:hover {
    border-right-color: black;
  }

  .nav-btn--right {
    margin-right: -20px;
    border-left: 17px solid #eee;
  }

  .nav-btn--right:hover {
    border-left-color: black;
  }

  .privacy-btn {
    margin-left: 5px;
    height: 45px;
    top: 0;
    background: none;
    display: flex;
    opacity: 1;
  }

  .delete-btn {
    margin-left: 5px;
    height: 30px;
    border-radius: 8px;
    top: 0;
    background: tomato;
    display: flex;
    opacity: 1;
  }

  .delete-btn:hover {
    background: #c31919;
  }

  .privacy-btn img {
    height: 30px;
  }

  .habit-buttons {
    display: flex;
    position: absolute;
    top: 0;
    left: 100%;
    align-items: center;
  }
</style>
