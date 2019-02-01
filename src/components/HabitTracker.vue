<template>
  <div>

    <div style="display: flex; max-width: 650px; margin: auto">
      <div style="font-size: 28px; color: white; text-align: left; margin-left: 15px; margin-bottom: 5px; margin-top: 20px">Habits</div>
      <button v-on:click="newHabit" class="add-button">+</button>
    </div>

    <habit-list
      v-if="showWeek"
      @change-week="changeWeek"
      :startDate="startDate"
      :dateArray="dateArray"
      :dailyHabits="habits"/>

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
          this.showWeek = false;
          const ref = db.collection('DailyHabits').doc();
          const id = ref.id;
          ref.set({ ...newHabit, id, private: false }).then(() => {
            this.showWeek = true;
          })
        }
      },
    }
  }

</script>

<style scoped>
  .add-button {
    background: none;
    font-size: 24px;
    line-height: 30px;
    border: solid 2px white;
    height: 34px;
    width: 34px;
    border-radius: 100%;
    margin-top: 20px;
    margin-left: 10px;
    margin-bottom: 5px;
  }

  .add-button:hover {
    background: #42b983;
  }
</style>
