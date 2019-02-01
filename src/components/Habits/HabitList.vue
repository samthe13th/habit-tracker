<template>

  <div class="week">

    <div style="position: relative; margin: 5px; display: flex; flex-wrap: wrap; justify-content: center">
      <habit-bar
        @delete-habit="openDeleteDialog"
        v-for="habit in habits"
        class="habit-bar-wrapper"
        :date="dateObj"
        :dateArray="dateArray"
        :title="habit.title"
        :id="habit.id">
      </habit-bar>
      <div v-if="habits.length % 2 === 1"class="placeholder-card"></div>
    </div>

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
        dateObj: date,
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
      openDeleteDialog(id) {
        this.habitToDelete = id;
        this.$modal.show('delete-habit-modal');
      },
      deleteHabit(followThrough) {
        if (followThrough) {
          this.$firestore.habits.doc( this.habitToDelete )
            .get()
            .then( ( doc ) => {
              this.deleteLog( this.habitToDelete );
            })
          this.$modal.hide( 'delete-habit-modal' );
        }
      },
      deleteLog(id) {
        const log = db.collection(`DailyHabits/${id}/log`);
        log.get().then((snapshot) => {
          const batch = db.batch();

          snapshot.forEach((doc) => {
            batch.delete(doc.ref);
          })
          batch.commit();
        }).then(() => {
          this.$firestore.habits.doc(id).delete();
        })
      },
      togglePrivacy(id) {
        const habitDoc = this.$firestore.habits.doc(id);
       habitDoc.get().then((snap) => {
         console.log('privacy: ', snap.data().id)
         if (!snap.data().private) {
           habitDoc.update({
             private: true
           })
         } else {
           habitDoc.update({
             private: false
           })
         }
       })
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
    max-width: 670px;
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

  .placeholder-card {
    flex-shrink: 0;
    width: 310px;
    height: 174px;
    margin: 10px;
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
