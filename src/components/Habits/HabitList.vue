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
          v-bind:data="habit"
          v-bind:key="habit.title"
          @log-habit="logHabit"
          @delete-habit="deleteHabit"
          :dateArray="dateArray"
          :incomingDate="incomingDate"
          :title="habit.title"
          :habitDataRaw="getHabitData(habit.title)">
        </habit-bar>

        <!-- buttons -->
        <div class="habit-buttons">
          <button class="privacy-btn">
            <img src="../../assets/lock-96.png" />
          </button>
          <button class="delete-btn" v-on:click="deleteHabit(habit.title)">
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

  const date = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthNumber = date.getMonth();
  const dayNumber = date.getDay();
  const day = days[dayNumber];
  const fullYear = date.getFullYear();
  const month = months[date.getMonth()];
  const sundayMonth = displayedMonths();

  import Vue from 'vue'
  import HabitBar from './HabitBar'
  import RemoveHabit from './RemoveHabit'

  export default {
    name: 'HabitList',
    components: {
      HabitBar,
      RemoveHabit,
    },
    data() {
      return {
        incomingDate: this.getIncomingDate(),
        sundayMonth,
        week: [{}, {}, {}, {}, {}, {}, {}],
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
        dayOne: this.dateArray[0],
        wakeUp: [],
        habitData: _.reduce(this.dailyHabits, (acc, h) => {
          const habit = {};
          habit[h] = [0,0,0,0,0,0,0];
          return { ...acc, habit };
        }, {}),
        habitList: {
          sunday: {},
          monday: {},
          tuesday: {},
          wednesday: {},
          thursday: {},
          friday: {},
          saturday: {},
        }
      }
    },
    props: [
      'dailyHabits',
      'weeklyData',
      'startDate',
      'dateArray',
      'inDate',
      'outDate',
    ],
    firestore() {
      return {
        habits: db.collection('DailyHabits'),
      }
    },
    created() {
      this.setWeek();
    },
    mounted() {
      this.days.forEach((day, i) => {
        this.$binding(day, db.doc(`log/${this.dateArray[i].getFullYear()}/Months/${this.dateArray[i].getMonth()}/Days/${this.dateArray[i].getDate()}`))
          .then((monday) => {
            this.habitList[day] = monday;
          }).catch(err => {
          this.habitList[day] = {};
        })
      });
    },
    watch: {
      weeklyData: function(newVal, oldVal) {
      },
      startDate: function(newVal, oldVal) {
        this.incomingDate = this.getIncomingDate();
      },
    },
    methods: {
      deleteHabit(title) {
        this.$modal.show('delete-habit-modal');

/*        this.$firestore.habits
          .where("title", "==", title)
          .get()
          .then((snap) => {
            var batch = db.batch();

            snap.forEach((doc) => {
              batch.delete(doc.ref);
            });

            batch.commit();
          })*/
      },
      getHabitList() {
        return this.habitList;
      },
      updateTest(_checked) {
        const n = (_checked) ? 8 : 0;
        this.test(n);
      },
      test(n) {
        this.$firestore.sunday.update({ fasdfdf: n })
        this.$firestore.sunday.get().then((doc) => {
          this.dayOne = doc.data().fasdfdf;
        })
      },
      getIncomingDate() {
          const incomingDate = _.clone(this.startDate);
          incomingDate.setDate(incomingDate.getDate() - 1);
          return incomingDate;
      },
      logHabit(day, title, streak) {
        console.log('log ', day, title, streak)
        const logDate = new Date();

        logDate.setYear(this.startDate.getFullYear());
        logDate.setMonth(this.startDate.getMonth());
        logDate.setDate(this.startDate.getDate() + day);

        this.setStreak(logDate, title, streak);
      },
      setStreak(_date, habit, streak) {
        const prevDay = _.clone(_date);
        prevDay.setDate(prevDay.getDate() - 1);

        db.doc(`log/${prevDay.getFullYear()}/Months/${prevDay.getMonth()}/Days/${prevDay.getDate()}`)
          .get().then((doc) => {
            const entry = {};
            entry[habit] = streak;

            db.collection('log')
              .doc(String(_date.getFullYear()))
              .collection('Months')
              .doc(String(_date.getMonth()))
              .collection('Days')
              .doc(String(_date.getDate()))
              .set(entry, { merge: true });
            this.adjustFutureStreak(_date, streak, habit);
          });
      },
      adjustFutureStreak(_date, streak, habit) {
        const nextDate = _.clone(_date);
        const entry = {};
        nextDate.setDate(nextDate.getDate() + 1);
        const log = this.getDateDoc(nextDate)
        log.get().then(doc => {
          if (doc.data() && doc.data()[habit] && doc.data()[habit] !== 0) {
            entry[habit] = streak + 1;
            log.set(entry, { merge: true });
            this.adjustFutureStreak(nextDate, streak + 1, habit);
          }
        })
      },
      getDateDoc(_date) {
        const doc = db.doc(`log/${_date.getFullYear()}/Months/${_date.getMonth()}/Days/${_date.getDate()}`);
        console.log(doc)
        return doc;
      },
      getHabitData(habitTitle) {
        let data = [0, 0, 0, 0, 0, 0, 0]
        this.weeklyData.forEach((day, i) => {
          data[i] = day[habitTitle] | 0;
        });

        return data;
      },
      setWeek() {
        this.week = days.map((days, i) => {
          const newDate = new Date();
          newDate.setMonth(this.startDate.getMonth());
          newDate.setDate(this.startDate.getDate() + i);
          this.incomingDate = this.getIncomingDate();
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


// WEBPACK FOOTER // // HabitList.vue
