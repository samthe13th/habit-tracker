<template>
    <div class="habit-bar" :class="{ 'cell-private': !isPublic }">
        <div class="habit-title">{{title}}</div>
        <div v-for="day in days" class="cell" >
            <!--<div :class="{ connectorstart: (habitData[0] && (day === 0) && (currentStreak !== 0)) }"></div>-->
            <label class="container">
                <div v-if="connect(day, day + 1)" class="connector"></div>
                <input v-model="marked[day]" @click="$emit('log-habit', day, title, habitData[day])" type="checkbox">
                <div class="checkmark" :class="{ count: hasCount(day) }" >
                    <span v-if="hasCount(day)">{{ habitData[day] }}</span>
                </div>
            </label>
        </div>
        <button :class="{ 'half-opacity': isPublic }" class="privacy-btn" v-on:click="togglePrivacy">
            <img src="../../assets/lock-96.png"/>
        </button>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import * as _ from 'lodash'
    import db from '@/db'
    import Vue from 'vue'

    const days = [0, 1, 2, 3, 4, 5, 6];
    const date = new Date();

    export default {
        name: 'DailyHabit',
        data() {
            return {
                isPublic: true,
                days,
                habitData: [0,0,0,0,0,0,0],
                marked: [false, false, false, false, false, false],
            }
        },
        props: [
            'title',
            'currentStreak',
            'habitDataRaw'
        ],
        watch: {
            habitDataRaw: function (newVal, oldVal) {
                console.log('raw: ', newVal, oldVal)
                this.updateHabitData(newVal);
            }, 
            marked: function(n,o) {
                console.log('mark: ', n, o)
                this.update(n);
            }
        },
        methods: {
            togglePrivacy() {
                this.isPublic = !this.isPublic;
            },
            updateHabitData(updates) {
                updates.forEach((flag, i) => {
                    if (flag !== undefined && flag !== 0) {
                        this.habitData.splice(i, 1, flag);
                        this.marked.splice(i, 1, true);
                        console.log(this.habitData)
                    } else {
                        this.marked.splice(i, 1, false)
                    }
                })
            },
            update(marks) {
                marks.forEach((mark, i) => {
                    if (mark === true && this.habitData !== undefined) {
                        this.habitData[i] = (this.habitData[i - 1])
                        ? this.habitData[i - 1] + 1
                        : 1;
                    } else {
                        this.habitData[i] = 0;
                    }
                })
            },
            hasCount: function (day) {
                return this.habitData[day] && !this.habitData[day + 1];
            },
            connect: function (start, end) {
                return this.habitData[start] && this.habitData[end];
            },
            streak: function (end) {
                let count = 0;
                for (let i = end; i >= 0; i--) {
                    if (!this.habitData[i]) break;
                    if (i === 0) {
                        count = count + this.currentStreak;
                    }
                    count++;
                }
                return count;
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

    .container:hover input~.checkmark {
        background-color: #ccc;
    }

    .container input:checked~.checkmark {
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
        font-size: 20px;
        position: absolute;
        left: -20px;
        transform: translateX(-100%);
    }
</style>