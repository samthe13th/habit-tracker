<template>
  <div class="hello">
    <div class="nav">
      <button class="tool-button" v-on:click="logout">Logout</button>
    </div>

    <habit-list
      v-if="showWeek"
      @change-week="changeWeek"
      @log-habit="logHabit"
      :inDate="inDate"
      :outDate="outDate"
      :startDate="startDate"
      :dateArray="dateArray"
      :dailyHabits="dailyHabits"
      :weeklyData="weeklyData"/>

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
        dailyHabits: [],
        weeklyData: [
          {}, {}, {}, {}, {}, {}, {},
        ],
        incomingStreak: 0,
        outgoingStreak: 0,
        startDate: date,
        dateArray: [date,date,date,date,date,date,date],
        inDate: date,
        outDate: date,
        showWeek: true,
      }
    },
    firestore() {
      console.log(db.collection('habits'));
      return {
        habits: db.collection('habits'),
      }
    },
    created() {
      this.startDate = new Date();
      this.startDate.setDate(date.getDate() - date.getDay());
      this.getDailyHabits();
      this.setDateArray(this.startDate);
    },
    methods: {
      loadWeek() {
        this.setWeeklyData(this.dailyHabits, this.startDate)
      },
      changeWeek(_startDate, direction) {
        this.startDate.setMonth(_startDate.getMonth());
        this.startDate.setYear(_startDate.getFullYear());
        if (direction === 'right') {
          this.startDate.setDate(_startDate.getDate() + 7)
        } else {
          this.startDate.setDate(_startDate.getDate() - 7)
        }

        this.startDate = _.clone(this.startDate)

        this.setWeeklyData(this.dailyHabits, this.startDate);
        this.incomingStreak = 100;

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
          this.showWeek= true;
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
      getDailyHabits() {
        db.collection('DailyHabits').get().then(querySnapshot => {
          const dailyHabits = []
          querySnapshot.forEach(doc => {
            dailyHabits.push(doc.data())
          });
          this.dailyHabits = dailyHabits;
          this.setWeeklyData(this.dailyHabits, this.startDate);
        });
      },
      createHabit(newHabit) {
        this.$modal.hide('add-habit-modal');
        if (newHabit.period === 'daily') {
          db.collection('DailyHabits').add(newHabit);
        } else if (newHabit.period === 'weekly') {
          db.collection('WeeklyHabits').add(newHabit);
        } else {
          db.collection('MonthlyHabits').add(newHabit);
        }
        this.getDailyHabits();
      },
      logHabit(habit, date, done, checked) {
        const entry = {};
        entry[habit] = 1;

        db.collection('log')
          .doc(String(date.year))
          .collection('Months')
          .doc(String(date.month))
          .collection('Days')
          .doc(String(date.day))
          .set(entry, { merge: true })
      },
      setWeeklyData(habits, _date) {
        const range = this.getRange(_date);
        const weekData = {};

        range.forEach((_date, rangeId) => {
          this.$set(this.weeklyData[rangeId], 'date', _date.getDate());
          db.doc(`log/${_date.getFullYear()}/Months/${_date.getMonth()}/Days/${_date.getDate()}`)
            .get().then((doc) => {
              habits.forEach((habit) => {
                if (!weekData[habit.title]) {
                  weekData[habit.title] = [];
                }
                let checked = 0;
                if (doc.exists) {
                  const data = doc.data();
                  checked = doc.data()[habit.title];
                }
                weekData[habit.title].push(checked);
                this.$set(this.weeklyData[rangeId], habit.title, checked);
              })
              this.weeklyData = _.clone(this.weeklyData)
            });
        });
      },
      getRange(_date) {
        const range = [];
        for (let i = 0; i < 7; i++) {
          const newDate = new Date();
          newDate.setMonth(_date.getMonth());
          newDate.setDate(_date.getDate() + i)
          range.push(newDate)
        }
        return range;
      },
    }
  }

</script>

<style>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .nav {
    display: flex;
    align-items: right;
  }

  .radio-buttons {
    align-self: left;
    margin-bottom: 20px;
  }

  button,
  .tool-button {
    color: white;
    background-color: lightgrey;
    font-weight: bold;
    border: none;
    outline: 0;
    cursor: pointer;
  }

  .tool-button {
    position: absolute;
    right: 0;
  }

  .action-button {
    background: #42b983;
    padding: 14px;
    border-radius: 22px;
    font-size: 1em;
  }

  .floating-action-button {
    position: absolute;
    right: 50px;
    bottom: 50px;
    height: 70px;
    width: 70px;
    z-index: 99;
    background: #42b983;
    border-radius: 100%;
    font-size: 2.2em;
  }

  .week th {
    min-width: 100px;
  }

  .check {
    border-radius: 100%;
  }

  .custom-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    height: 100%;
  }

  .custom-modal h3 {
    align-self: center;
    text-align: center;
  }

  .container {
    position: relative;
    padding-left: 25px;
    padding-right: 20px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  /* Hide the browser's default radio button */

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  /* Create a custom radio button */

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 50%;
  }
  /* On mouse-over, add a grey background color */

  .container:hover input~.checkmark {
    background-color: #ccc;
  }
  /* When the radio button is checked, add a blue background */

  .container input:checked~.checkmark {
    background-color: #2196F3;
  }
  /* Create the indicator (the dot/circle - hidden when not checked) */

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  /* Show the indicator (dot/circle) when checked */

  .container input:checked~.checkmark:after {
    display: block;
  }
  /* Style the indicator (dot/circle) */

  .container .checkmark:after {
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
</style>
