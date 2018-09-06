<template>

  <div class="week">

    <h1>Daily Habits</h1>

    <div class="habit-log-header">

      <div class="nav-btn nav-btn--left" @click="$emit('change-week', startDate, 'left')"></div>
      <div v-for="(day, i) in weeklyData" class="cell">
        <div style="height: 20px">
          <div v-if="i === 0">{{ sundayMonth }}</div>
          <div v-if="day.date === date && month !== sundayMonth">{{ month }}</div>
        </div>
        <div style="position: relative">
          <div v-if="day.date === date" class="current-day-overlay"></div>
          <h2>{{ days[i] }}</h2>
          <div>{{ day.date }}</div>
        </div>
      </div>
      <div class="nav-btn nav-btn--right" @click="$emit('change-week', startDate, 'right')">

      </div>
    </div>

    <daily-habit class="habit-bar-wrapper" v-for="dailyHabit in dailyHabits" @log-habit="logHabit" :title="dailyHabit.title"
      :habitDataRaw="getHabitData(dailyHabit.title)" :currentStreak="currentStreak">
    </daily-habit>

  </div>

</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import db from '@/db'

  const date = new Date();
  const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Ocober', 'November', 'December']
  const monthNumber = date.getMonth();
  const dayNumber = date.getDay();
  const day = days[dayNumber];
  const fullYear = date.getFullYear();
  const month = months[date.getMonth()];
  const sundayMonth = displayedMonths();

  import Vue from 'vue'
  import DailyHabit from './DailyHabit'

  export default {
    name: 'HabitList',
    components: {
      DailyHabit,
    },
    data() {
      return {
        currentStreak: 30,
        sundayMonth,
        week: [{},{},{},{},{},{},{}],
        calendarYear: 2018,
        months,
        days,
        month,
        fullYear,
        dateObject: date,
        date: date.getDate(),
        logDays: logDays(),
        dayNumber,
        day,
        days,
        wakeUp: [],
        habitData: {
          name: '',
        }
      }
    },
    props: [
      'dailyHabits',
      'weeklyData',
      'startDate',
    ],
    created() {
      this.setWeek();
      console.log('startDate: ', this.startDate, this.startDate.getFullYear())
    },
    methods: {
      logHabit(day, title, checked) {
        console.log('start date: ', this.startDate, this.startDate.getFullYear())
        console.log('log ', day, title, checked)
        const logDate = new Date();
        const entry = {};

        logDate.setYear(this.startDate.getFullYear())
        logDate.setMonth(this.startDate.getMonth())
        logDate.setDate(this.startDate.getDate() + day);

        console.log("log date: ", logDate.getDate(), logDate.getMonth(), logDate.getFullYear())
        entry[title] = !checked;

        db.collection('log')
          .doc(String(logDate.getFullYear()))
          .collection('Months')
          .doc(String(logDate.getMonth()))
          .collection('Days')
          .doc(String(logDate.getDate()))
          .set(entry, { merge: true });
      },
      setStreak(year, month, day, habit) {
        const previousDay = db.doc(`log/${year}/Months/${month}/Days/${day}`);
      },
      getHabitData(habitTitle) {
        let data = [false, false, false, false, false, false, false]
        this.weeklyData.forEach((day, i) => {
          data[i] = day[habitTitle];
        })
        return data;
      },
      setWeek() {
        this.week = days.map((days, i) => {
          const newDate = new Date();
          newDate.setMonth(this.startDate.getMonth());
          newDate.setDate(this.startDate.getDate() + i);
          return { date: newDate.getDate(), month: months[newDate.getMonth()] }
        });
      }
    },
  }

  function displayedMonths() {
    const start = new Date();
    start.setDate(date.getDate() - date.getDay())
    return months[start.getMonth()];
  }
  function logDays() {
    const logDays = days.map((day, i) => {
      const d = (i + (date.getDate() - dayNumber + 1));
      return { day: d, month: date.getMonth(), year: date.getFullYear() }
    })
    return logDays;
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
    margin: 5px;
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
</style>


// WEBPACK FOOTER // // HabitList.vue