<template>
  <div>
    <div class="habit-title">{{title}}</div>
    <div class="habit-bar" :class="{ 'cell-private': !isPublic }">

      <div v-for="day in dateArray" class="cell">
        <data-point :name="title" :date="day" :prevDate="prevDate(day)" :nextDate="nextDate(day)"></data-point>
        <!--      <div :class="{ connectorstart: (habitData[0] && (day === 0) && (currentStreak !== 0)) }"></div>
              <label class="container">
                <div v-if="connect(day, day + 1)" class="connector"></div>
                <input v-model="marked[day]" @click="$emit('log-habit', day, title, streak(day))" type="checkbox">
                <div class="checkmark" :class="{ count: hasCount(day) }">
                  <span v-if="hasCount(day)">{{ habitData[ day ] }}</span>
                </div>
              </label>-->
      </div>

      <!--
      <div v-for="day in dateArray" class="cell">
        <label class="container">
          <input @click="updateTest()" type="checkbox">
          <div class="checkmark">
          </div>
        </label>
      </div>
      -->

      <button :class="{ 'half-opacity': isPublic }" class="privacy-btn" v-on:click="togglePrivacy">
        <img src="../../assets/lock-96.png" />
      </button>

    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'
  import Vue from 'vue'
  import DataPoint from './DataPoint'

  const days = [ 0, 1, 2, 3, 4, 5, 6 ];
  const date = new Date();

  export default {
    name:    'DailyHabit',
    components: {
      DataPoint
    },
    data() {
      return {
        isPublic:       true,
        days,
        habitData:      [ 0, 0, 0, 0, 0, 0, 0 ],
        marked:         [ false, false, false, false, false, false ],
        incomingStreak: 0,
      }
    },
    props:   [
      'title',
      'currentStreak',
      'habitDataRaw',
      'incomingDate',
      'outgoingDate',
      'dayOne',
      'dateArray',
    ],
    watch:   {
      habitDataRaw: function(newVal, oldVal) {
        this.updateHabitData(newVal);
      },
      habitList: function(n,o) {
        console.log('n: ', n)
      },
      marked: function( n, o ) {
        setTimeout(() => {
          this.updateLogData();
          n.forEach((mark, i) => {
            this.marked.splice(i, 1, mark);
          })
        })
      },
      dayOne: function(n,o) {
        console.log('dayOne: ', n)
      },
      dateArray: function(n,o) {
        console.log('date array: ', n, o)
      }
    },
    methods: {
      prevDate(_date) {
        const prevDate = _.clone(_date);
        prevDate.setDate(_date.getDate() - 1);
        return prevDate;
      },
      nextDate(_date) {
        const nextDate = _.clone(_date);
        nextDate.setDate(_date.getDate() + 1);
        return nextDate;
      },
      updateTest() {
        const entry = {};
        entry[this.title] = 7;

        this.$firestore.sunday.update(entry);
        this.$firestore.sunday.get().then((doc) => {
          this.dayOne = doc.data()[this.title];
        })
      },
      getDateDoc( _date ) {
        console.log('get doc for', _date);
        return db.doc( `log/${_date.getFullYear()}/Months/${_date.getMonth()}/Days/${_date.getDate()}`);
      },
      updateLogData() {
        const startDate = new Date();
        startDate.setDate(date.getDate() - date.getDay());
        const range    = this.getRange(startDate);

        range.forEach( ( _date, i ) => {
          db.doc( `log/${_date.getFullYear()}/Months/${_date.getMonth()}/Days/${_date.getDate()}` )
            .get()
            .then( ( doc ) => {
              let checked = 0;
              if( doc.exists ) {
                const data = doc.data();
                checked    = doc.data()[ this.title ];
              }
              this.habitData.splice( i, 1, checked );
            });
        })


      },
      getRange( _date ) {
        const range = [];
        for( let i = 0; i < 7; i++ ) {
          const newDate = new Date();
          newDate.setMonth( _date.getMonth() );
          newDate.setDate( _date.getDate() + i )
          range.push( newDate )
        }
        return range;
      },
      togglePrivacy() {
        this.isPublic = !this.isPublic;
      },
      updateHabitData( updates ) {
        updates.forEach( ( flag, i ) => {
          if( flag !== undefined && flag !== 0 ) {
            this.habitData.splice( i, 1, flag );
            this.marked.splice( i, 1, true );
          } else {
            this.marked.splice( i, 1, false )
          }
        } );
        this.habitData = _.clone( updates );
      },
      hasCount: function( day ) {
        return this.habitData[ day ] && !this.habitData[ day + 1 ];
      },
      connect: function( start, end ) {
        return (this.marked[ start ] && this.marked[ end ]);
      },
      streak: function( day ) {
        let incoming = 0;

        if( day === 0 ) {
          incoming = this.incomingStreak;
        } else if( this.habitData[ day - 1 ] ) {
          incoming = this.habitData[ day - 1 ];
        }

        return (this.habitData[ day ] === 0) ? incoming + 1 : 0;
      },
    },
  }

</script>

<style scoped>
  .cell {
    width: 80px;
  }

  .habit-bar {
    display: flex;
    flex-direction: row;
    padding: 10px;
    justify-content: space-evenly;
    position: relative;
    height: 45px;
    overflow:hidden;
  }

  .container {
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    transition: width 200ms;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translate(-50%, -50%);
    height: 24px;
    width: 24px;
    background-color: #eee;
    line-height: 24px;
    text-align: center;
    color: white;
  }

  .cell-private {
    background: #2c2e84;
  }

  .cell-private-2 {
    background: #243f6f;
  }

  .privacy-btn {
    position: absolute;
    left: 100%;
    margin-left: 10px;
    height: 45px;
    top: 0;
    background: none;
    display: flex;
    opacity: 1;
  }

  .privacy-btn img {
    height: 30px;
  }

  .half-opacity {
    opacity: 0.3;
    transition: opacity 100ms ease;
  }

  .half-opacity:hover {
    opacity: 0.6;
  }

  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .container input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  .connector {
    display: block;
    content: '';
    position: absolute;
    width: 97px;
    height: 24px;
    top: -1px;
    left: 18px;
    background-color: #2196F3;
    opacity: 0.6;
  }

  .connectorstart {
    display: block;
    content: '';
    position: absolute;
    background-color: #2196F3;
    opacity: 0.6;
    width: 60px;
    height: 24px;
    left: 0;
  }

  .container .checkmark:after {
    background: none;
  }

  .count {
    width: 36px;
    height: 36px;
    line-height: 39px;
    font-size: 18px;
  }

  .habit-title {
    line-height: 50px;
    font-size: 20px;
    position: absolute;
    padding-right: 10px;
    left: -2px;
    transform: translateX(-100%);
  }
</style>
