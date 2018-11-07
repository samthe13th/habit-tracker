<template>

  <div style="position: relative">

    <button @click="logHabit()" v-if="streak[name] === undefined || streak[name] === 0" class="point point--sm"></button>

    <template v-if="streak[name] !== undefined && streak[name] !== 0">

      <div v-if="prevStreak && prevStreak[name] > 0" class="streak-bar"></div>

      <div v-if="date.getDay() === 6 && nextStreak && nextStreak[name] > 0" class="streak-bar--end"></div>

      <button
        v-if="nextStreak && (nextStreak[name] === 0 || nextStreak[name] === undefined)"
        @click="logHabit()"
        class="point point--lg point--marked">
          {{ streak[name] }}
      </button>

      <button
        v-if="nextStreak && (nextStreak[name] !== 0 && nextStreak[name] !== undefined)"
        @click="logHabit()"
        class="point point--sm point--marked">

      </button>

    </template>

  </div>

</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import Vue from 'vue'

  export default {
    name: 'DataPoint',
    props: [
      'day',
      'name',
      'date',
      'prevDate',
      'nextDate'
    ],
    data() {
      return {
        streak: 0,
      }
    },
    firestore() {
      return {
        nextStreak: db.doc(`log/${this.nextDate.getFullYear()}/Months/${this.nextDate.getMonth()}/Days/${this.nextDate.getDate()}`),
        prevStreak: db.doc(`log/${this.prevDate.getFullYear()}/Months/${this.prevDate.getMonth()}/Days/${this.prevDate.getDate()}`),
        streak: db.doc(`log/${this.date.getFullYear()}/Months/${this.date.getMonth()}/Days/${this.date.getDate()}`),
        days: db.collection(`log/${this.date.getFullYear()}/Months/${this.date.getMonth()}/Days`),
      }
    },
    methods: {
      logHabit() {
        const entry = {};
        const streak = db.doc(`log/${this.date.getFullYear()}/Months/${this.date.getMonth()}/Days/${this.date.getDate()}`);
        streak.get().then((snap) => {
          console.log('snap: ', snap.data())
          if (snap.data()){
            entry[this.name] = 0;
            if (snap.data()[this.name] && snap.data()[this.name] > 0) {
              this.setCurrentStreak(entry)
            } else {
              console.log( 'no snap data' )
              const prevStreak = db.doc( `log/${this.prevDate.getFullYear()}/Months/${this.prevDate.getMonth()}/Days/${this.prevDate.getDate()}` );
              prevStreak.get().then( ( snap ) => {
                  if( snap.data() ) {
                    console.log('GET PREV STREAK')
                    this.addPreviousStreak( prevStreak, entry );
                  } else {
                    console.log('wut now tho ', entry);
                    entry[this.name] = 1;
                    this.setCurrentStreak(entry)
                  }
                })
            }
          } else {
            console.log('no streak')
            entry[this.name] = 1;
            setTimeout(() => {
              const prevStreak = db.doc(`log/${this.prevDate.getFullYear()}/Months/${this.prevDate.getMonth()}/Days/${this.prevDate.getDate()}`);
              prevStreak.get().then((snap) => {
                if (snap.data()) {
                  console.log('HERE')
                  this.addPreviousStreak(prevStreak, entry);
                } else {
                  console.log('THERE')
                  this.setCurrentStreak(entry);
                }
              })
            })
          }
        })
      },
      addPreviousStreak(_prevStreak, entry) {
        entry[this.name] = 1;
        _prevStreak
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

<style scoped>
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }


  .privacy-btn img {
    height: 30px;
  }

  .point {
    border-radius: 100%;
    background: lightgrey;
    transition: all 80ms ease-in-out;
    line-height: 30px;
    transform: translateX(-50%);
    position: absolute;
    z-index: 100;
  }

  .point--sm {
    height: 24px;
    width: 24px;
  }

  .point--lg {
    height: 36px;
    width: 36px;
    transform: translate(-50%, -6px);
    font-size: 15px;
    padding: 0;
    line-height: 36px;
  }

  .point--marked {
    background: dodgerblue;
  }

  .streak-bar {
    display: block;
    content: '';
    width: 97px;
    height: 24px;
    left: -55px;
    top: 0;
    position: absolute;
    background-color: #2196F3;
    opacity: 0.6;
  }

  .streak-bar--end {
    display: block;
    content: '';
    width: 97px;
    height: 24px;
    right: -55px;
    top: 0;
    position: absolute;
    background-color: #2196F3;
    opacity: 0.6;
  }
</style>
