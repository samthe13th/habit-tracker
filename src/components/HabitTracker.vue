<template>
  <div class="hello">
    <div class="nav">
      <button class="tool-button" v-on:click="logout">Logout</button>
    </div>
    <habit-list 
      @log-habit="logHabit"
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
  import db from '@/db'
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
          {}, {}, {}, {}, {}, {}, {}, {}, {}
        ],
        habitData: {
          name: '',
        }
      }
    },
    created() {
      this.getDailyHabits();
    },
    methods: {
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
          this.getWeeklyLog(this.dailyHabits);
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
        entry[habit] = true;

        db.collection('log')
          .doc(String(date.year))
          .collection('Months')
          .doc(String(date.month))
          .collection('Days')
          .doc(String(date.day))
          .set(entry, { merge: true })
      },
      getWeeklyLog(habits) {
        const range = this.getRange();
        const weekData = {};

        range.forEach((_date, rangeId) => {
          db.doc(`log/${_date.getFullYear()}/Months/${_date.getMonth()}/Days/${_date.getDate()}`)
            .get().then(doc => {
              habits.forEach((habit) => {
                if (!weekData[habit.title]) {
                  weekData[habit.title] = [];
                }
                let checked = false;
                if (doc.exists) {
                  const data = doc.data();
                  checked = doc.data()[habit.title] === true;
                }
                weekData[habit.title].push(checked);
                this.$set(this.weeklyData[rangeId], habit.title, checked);
              })
            });
        });
      },
      getRange() {
        const range = [];
        const start = new Date();
        start.setDate(date.getDate() - date.getDay())
        for (let i = -1; i < 8; i++) {
          const newDate = new Date();
          newDate.setMonth(start.getMonth());
          newDate.setDate(start.getDate() + i)
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