<template>
    <div class="habit-bar">
        <div class="habit-title">{{title}}</div>
        <button style="position: fixed; top: 10px; left: 10px" @click="update()">Update</button>
        <div v-for="day in days" class="cell">
            <div :class="{ connectorstart: (habitData[0] && (day === 0) && (currentStreak !== 0)) }"></div>
            <label class="container">
    
                <div v-if="connect(day,(day + 1))" class="connector"></div>
                <input v-model="habitData[day]" @click="$emit('log-habit', day, title, habitData[day])" type="checkbox">
                <div class="checkmark" :class="{ count: hasCount(day) }" >
                    <span v-if="hasCount(day)">{{ streak(day) }}</span>
                </div>
            </label>
        </div>
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
                days,
                habitData: [false, false, false, false, false, false, false],
            }
        },
        props: [
            'range',
            'title',
            'checked',
            'currentStreak',
            'logHabit',
            'habitDataRaw'
        ],
        watch: {
            habitDataRaw: function (newVal, oldVal) {
                this.updateHabitData(newVal);
            }
        },
        methods: {
            updateHabitData(updates) {
                updates.forEach((flag, i) => {
                    if (flag !== undefined) {
                        this.habitData.splice(i, 1, flag);
                    }
                })
            },
            hasCount: function (day) {
                return this.habitData[day] && !this.habitData[day + 1];
            },
            connect: function (start, end) {
                console.log('connect ', this.habitData)
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
            update: function () {
                this.habitData.splice(0, 1, true)
            }
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
