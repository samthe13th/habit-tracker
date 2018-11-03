<template>
  <button @click="logHabit()">
    {{ streak[name] }}
  </button>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import Vue from 'vue'

  export default {
    name: 'DataPoint',
    data() {
      return {
        test: 'XX'
      }
    },
    props: [
      'name',
      'date',
      'prevDate'
    ],
    data() {
      return {
        streak: 0,
      }
    },
    firestore() {
      return {
        prevStreak: db.doc(`log/${this.prevDate.getFullYear()}/Months/${this.prevDate.getMonth()}/Days/${this.prevDate.getDate()}`),
        streak: db.doc(`log/${this.date.getFullYear()}/Months/${this.date.getMonth()}/Days/${this.date.getDate()}`),
        days: db.collection(`log/${this.date.getFullYear()}/Months/${this.date.getMonth()}/Days`),
      }
    },
    methods: {
      logHabit() {
        const entry = {};
        if (this.$firestore.streak) {
          this.$firestore.streak.get().then((snap) => {
            if (snap.data()[this.name] && snap.data()[this.name] > 0) {
              entry[this.name] = 0;
              this.setCurrentStreak(entry)
            } else {
              if (this.$firestore.prevStreak) {
                this.addPreviousStreak(entry);
              }
            }
          })
        } else {
          entry[this.name] = 1;
          this.setCurrentStreak(entry);
          if (this.$firestore.prevStreak) {
            this.addPreviousStreak(entry);
          }
        }
      },
      addPreviousStreak(entry) {
        entry[this.name] = 1;
        this.$firestore.prevStreak
          .get()
          .then( ( snapshot ) => {
            const prevStreak = snapshot.data()[ this.name ];
            if( prevStreak && prevStreak > 0 ) {
              entry[ this.name ] = prevStreak + 1;
            }
          }).then(() => {
          this.setCurrentStreak(entry);
        })
      },
      setCurrentStreak(entry) {
        this.$firestore.days.doc(this.date.getDate().toString())
          .set(entry, { merge: true});
        setTimeout(() => {
          this.adjustFutureStreak(this.date, entry[this.name], this.name);
        })
      },
      adjustFutureStreak(_date, streak, habit) {
        const nextDate = _.clone(_date);
        const entry = {};
        nextDate.setDate(nextDate.getDate() + 1);
        const log = this.getDateDoc(nextDate);
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
        return doc;
      },
    }
  }
</script>
