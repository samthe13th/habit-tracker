<template>

  <div class="week">
    <h1>Pull Your Goddamn Life Together</h1>

    <div class="habit-log-header">
      <div v-for="(day, i) in week" class="cell">
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
    </div>

    <daily-habit class="habit-bar-wrapper" 
      v-for="dailyHabit in dailyHabits" 
      @log-habit="logHabit" :title="dailyHabit.title"
      :habitDataRaw="getHabitData(dailyHabit.title)"
      :currentStreak="currentStreak">
    </daily-habit>
  </div>

</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import db from '@/db'

  const calendar = require('../../calendar.js').calendar;
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
    created() {
      console.log("WEEK: ", this.weeklyData)
    },
    data() {
      return {
        currentStreak: 30,
        sundayMonth,
        week: getWeek(date),
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
    ],
    methods: {
      logHabit(day, title, checked) {
        const dayDiff = day - date.getDay();
        const logDate = new Date();
        const entry = {};

        logDate.setDate(date.getDate() + dayDiff);
        entry[title] = !checked;

        db.collection('log')
          .doc(String(logDate.getFullYear()))
          .collection('Months')
          .doc(String(logDate.getMonth()))
          .collection('Days')
          .doc(String(logDate.getDate()))
          .set(entry, { merge: true })
      },
      getHabitData(habitTitle) {
        let data = [false, false, false, false, false, false, false]
        this.weeklyData.forEach((day, i) => {
          if (i !== 0 && i !== 8) {
            data[i - 1] = day[habitTitle];
          }
        })
        return data;
      }
    },
  }

  function displayedMonths() {
    const start = new Date();
    start.setDate(date.getDate() - date.getDay())
    return months[start.getMonth()];
  }

  function getWeek(date) {
    const start = new Date();
    start.setDate(date.getDate() - date.getDay());

    return days.map((days, i) => {
      const newDate = new Date();
      newDate.setMonth(start.getMonth());
      newDate.setDate(start.getDate() + i);
      return { date: newDate.getDate(), month: months[newDate.getMonth()] }
    });
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
</style>


// WEBPACK FOOTER //
// HabitList.vue