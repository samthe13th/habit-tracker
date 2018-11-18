<template>
  <div class="hello">
    <div class="nav">
      <button class="tool-button" v-on:click="logout">Logout</button>
    </div>

    <habit-list
      v-if="showWeek"
      @change-week="changeWeek"
      :startDate="startDate"
      :dateArray="dateArray"
      :dailyHabits="habits"/>

    <button class="floating-action-button" v-on:click="newHabit">
      +
    </button>

    <modal name="add-habit-modal" :width="400" :height="400">
      <new-habit @create-habit="createHabit" />
    </modal>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../main'
  import NewHabit from './Habits/NewHabit'
  import HabitList from './Habits/HabitList'

  const date = new Date();

  export default {
    name: 'HabitTracker',
    components: {
      NewHabit,
      HabitList,
    },
    data() {
      return {
        startDate: date,
        dateArray: [date,date,date,date,date,date,date],
        showWeek: true,
      }
    },
    firestore() {
      return {
        habits: db.collection('habits'),
      }
    },
    created() {
      this.startDate = new Date();
      this.startDate.setDate(date.getDate() - date.getDay());
      this.setDateArray(this.startDate);
    },
    methods: {
      changeWeek(_startDate, direction) {
        this.startDate.setMonth(_startDate.getMonth());
        this.startDate.setYear(_startDate.getFullYear());
        if (direction === 'right') {
          this.startDate.setDate(_startDate.getDate() + 7)
        } else {
          this.startDate.setDate(_startDate.getDate() - 7)
        }

        this.startDate = _.clone(this.startDate)
        this.showWeek = false;
        this.setDateArray(this.startDate);
      },
      setDateArray(_startDate) {
        this.inDate = _.clone(_startDate);
        this.inDate.setDate(_startDate.getDate() - 1);
        this.outDate = _.clone(_startDate);
        this.outDate.setDate(_startDate.getDate() + 7);

        _.each( this.dateArray, ( d, i ) => {
          const _date = _.clone( _startDate );
          _date.setDate( _date.getDate() + i );
          this.dateArray.splice( i, 1, _date )
        } );

        setTimeout(() => {
          this.showWeek = true;
        })
      },
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.replace('login');
        })
      },
      newHabit() {
        this.$modal.show('add-habit-modal');
      },
      createHabit(newHabit) {
        this.$modal.hide('add-habit-modal');
        if (newHabit.period === 'daily') {
          const ref = db.collection('DailyHabits').doc();
          const id = ref.id;
          ref.set({ ...newHabit, id, private: false })
        }
      },
    }
  }

</script>
