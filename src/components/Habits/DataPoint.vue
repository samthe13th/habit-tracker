<template>

  <div style="position: relative">

    <template v-if="log">

      <button
        @click="logHabit()"
        v-bind:class="{
          'point--marked': log[date.getDate()],
          'point--clickable': isCurrentDate(),
        }"
        class="point">

        <template v-if="!nextLog[nextDate.getDate()] && log[date.getDate()]">
          {{ log[date.getDate()] }}
        </template>

      </button>

      <template v-if="log[date.getDate()]">

        <div
          v-if="prevLog && prevLog[prevDate.getDate()]"
          class="streak-bar">
        </div>

        <div
          v-if="date.getDay() === 6 && nextLog[nextDate.getDate()]"
          class="streak-bar--end">
        </div>

      </template>

    </template>
  </div>

</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import Vue from 'vue'

  const date = new Date();

  export default {
    name: 'DataPoint',
    props: [
      'id',
      'date',
      'prevDate',
      'nextDate'
    ],
    data() {
      return {
        streak: 0,
      }
    },
    created() {
      console.log('id: ', this.id)
    },
    firestore() {
      return {
        prevLog: db.doc(`DailyHabits/${this.id}/log/${this.prevDate.getFullYear()}_${this.prevDate.getMonth()}`),
        nextLog: db.doc(`DailyHabits/${this.id}/log/${this.nextDate.getFullYear()}_${this.nextDate.getMonth()}`),
        log: db.doc(`DailyHabits/${this.id}/log/${this.date.getFullYear()}_${this.date.getMonth()}`),
      }
    },
    methods: {
      isCurrentDate() {
        return this.date.setHours(0,0,0,0) == date.setHours(0,0,0,0);
      },
      logHabit() {
        const day = `${this.date.getDate()}`;
        const prevDate = _.clone(this.date);
        prevDate.setDate(this.date.getDate() - 1);
        const streak = db.doc(`DailyHabits/${this.id}/log/${this.date.getFullYear()}_${this.date.getMonth()}`);
        const entry0 = {};
        streak.get().then((snap) => {
          if (snap.data()) {
            entry0[day] = 0;
            if (snap.data()[day]) {
              this.setCurrentStreak(entry0, day);
            } else {
              const prevStreak = db.doc(`DailyHabits/${this.id}/log/${prevDate.getFullYear()}_${prevDate.getMonth()}`);
              prevStreak.get().then((snap) => {
                if (snap.data()[prevDate.getDate()]) {
                  this.addPreviousStreak(prevStreak, entry0, prevDate.getDate().toString(), day)
                } else {
                  entry0[day] = 1;
                  this.setCurrentStreak(entry0, day);
                }
              })
            }
          }
        })
      },
      setCurrentStreak(entry, day) {
        this.$firestore.log.update(entry);
        setTimeout(() => {
          this.adjustFutureStreak(entry, this.date, entry[day])
        })
      },
      addPreviousStreak(_prevStreak, entry, prevDay, day) {
        entry[day] = 1;
        _prevStreak
          .get()
          .then((snapshot) => {
            const prevStreak = snapshot.data()[prevDay];
            if (prevStreak && prevStreak > 0) {
              entry[day] = prevStreak + 1;
            }
          }).then(() => {
            this.setCurrentStreak(entry, this.date.getDate().toString());
          })
      },
      adjustFutureStreak(entry, date, streak) {
        const nextDate = _.clone(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const day = nextDate.getDate();

        const log = this.getMonthLog(nextDate);;
        log.get().then((doc) => {
          if (doc.data() && doc.data()[day]) {
            entry[day] = streak + 1;
            log.update(entry);
            this.adjustFutureStreak(entry, nextDate, entry[day]);
          }
        })
      },
      getMonthLog(_date) {
        const doc = db.doc(`DailyHabits/${this.id}/log/${_date.getFullYear()}_${_date.getMonth()}`);
        return doc;
      },
    }
  }

</script>

<style scoped>
  .point {
    cursor: default;
    background: lightgrey;
    line-height: 30px;
    z-index: 100;
    height: 30px;
    width: 30px;
    font-size: 16px;
  }

  .point--clickable {
    cursor: pointer;
  }

  .point--clickable:hover {
    height: 34px;
    width: 34px;
    transform: translate(-2px,-2px);
  }

  .point--marked {
    background: #0099CC;
  }

  .streak-bar {
    display: block;
    content: '';
    width: 20px;
    height: 10px;
    left: -10px;
    top: 10px;
    position: absolute;
    background-color: #0099CC;
  }

  .streak-bar--end {
    display: block;
    content: '';
    width: 97px;
    height: 24px;
    right: -55px;
    top: 0;
    position: absolute;
    background-color: #0099CC;
    opacity: 0.6;
  }
</style>
