<template>
  <div class="goal-card">

    <div class="goal-card__details--wrapper">
      <h1>Completion of</h1>
      <h2>Something</h2>

      <div class="goal-card__details">
        <div><strong>Type: </strong>Project</div>
        <div><strong>Deadline: </strong></div>
        <div><strong>Days before deadline: </strong>5</div>
      </div>
    </div>

    <div class="goal-card__graph--wrapper">
      <div class="goal-label goal-x">{{ goalCoordinates.x }}</div>
      <div class="goal-label goal-y">{{ goalCoordinates.y }}</div>

      <svg class="goal-card__graph--stage">

        <!-- Star -->
        <g class="star">
          <path stroke="white" fill="#0099CB" stroke-width="3" v-bind:d="starPath(20)"></path>
        </g>

        <!-- Plot -->
        <g class="plot">
          <path v-bind:d="GraphPlot(plotPoints)" stroke-width="1" stroke="white" fill="white"/>
        </g>

        <!-- Plot -->
        <g class="trendline">
          <path v-bind:d="TrendLine(plotPoints)" stroke-width="5" stroke="#0099CB"/>
        </g>

        <!-- V-Axis -->
        <g class="v-axis">
          <path v-bind:d="VAxis()" stroke-width="2" stroke="black"/>
          <path
            stroke-width="1"
            stroke="black"
            v-for="tick in vTicks"
            v-bind:d="tick">
          </path>
        </g>

        <!-- H-Axis -->
        <g class="h-axis">
          <path v-bind:d="HAxis()" stroke-width="2" stroke="black"/>
          <path
            stroke-width="1"
            stroke="black"
            v-for="tick in hTicks"
            v-bind:d="tick">
          </path>
        </g>

      </svg>

    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import * as _ from 'lodash'
  import { db } from '../../main'

  export default {
    name: 'GoalCard',
    created() {
      setTimeout(() => {
        this.setTicks('H', 450);
        this.setTicks('V', 250);
      })
    },
    data() {
      return {
        goalCoordinates: {
          x: 120,
          y: 150,
        },
        plotPoints: [
          [1, 14],
          [2, 15],
          [3, 20],
          [6, 40],
          [12, 50],
          [40, 58],
          [50, 60],
          [80, 62],
          [90, 80],
          [100, 120],
          [110, 130]
        ],
        tickSize: 10,
        graphWidth: 480,
        graphHeight: 250,
        hTicks: [],
        vTicks: [],
      }
    },
    methods: {
      TrendLine(points) {
        let _trendLine = 'M0 0 ';
        const xMean = (_.reduce(points, (acc, p) => (acc + p[0]), 0) / points.length);
        const yMean = (_.reduce(points, (acc, p) => (acc + p[1]), 0) / points.length);
        const slope = (_.reduce(points, (acc, p) => (acc + ((p[0] - xMean) * (p[1] - yMean))), 0) / _.reduce(points, (acc, p) => (acc + ((p[0] - xMean) **2)), 0));
        const yIntercept = yMean - (slope * xMean);
        const endPoint = -slope * (this.goalCoordinates.x - yIntercept);
        const xStep = this.graphWidth / this.goalCoordinates.x;
        const yStep = this.graphHeight / this.goalCoordinates.y;
        console.log(this.goalCoordinates.x, {endPoint})

        console.log({slope}, {yIntercept})
        return `M0 ${-yIntercept * yStep} ${this.goalCoordinates.x * xStep} ${endPoint * yStep}`;
      },
      starPath(R) {
        let starPath = `M`;
        const angle = ((2 * Math.PI) / 10);
        for (let i = 0; i < 11; i++) {
          let H = (i % 2 !== 0) ? (R - 10) : R;
          const x = (Math.cos(i * angle) * H);
          const y = -(Math.sin(i * angle) * H);
          starPath += `${x} ${y} `
        }
        return starPath
      },
      setTicks(axis, dist) {
        let ticks;
        let span;

        if (axis === 'H') {
          ticks = 10;
          span = _.floor(dist / ticks);
          this.hTicks = _.range(ticks + 1).map(n => this.HTick(n * span));
        } else {
          ticks = 6;
          span = _.floor(dist / ticks);
          this.vTicks = _.range(ticks + 1).map(n => this.VTick(250 - (n * span)));
        }
      },
      HTick(x) {
        return `M${x} 0 V ${this.tickSize}`;
      },
      VTick(y) {
        return `M0 ${y} H -${this.tickSize}`;
      },
      VAxis() {
        return `M0 0 V ${this.graphHeight}`;
      },
      HAxis() {
        return `M0 0 H ${this.graphWidth}`;
      },
      GraphPlot(points) {
        let plotPoints = `M0 0 `;
        const xStep = this.graphWidth / this.goalCoordinates.x;
        const yStep = this.graphHeight / this.goalCoordinates.y;

        for(let i = 0; i < points.length; i++) {
            const x = points[i][0] * xStep;
            const y = -(points[i][1] * yStep);
            plotPoints += `${x} ${y} `
          if (i === (points.length - 1)) {
              plotPoints += `${x} 0 Z`
          }
        }
        return plotPoints;
      }
    }
  }

</script>

<style scoped>

  .trendline {
    transform: translate(80px, 280px);
  }

  .star {
    transform: translate(520px, 40px) rotate(55deg);
  }

  .goal-label {
    font-size: 16px;
    position: absolute;
    background: white;
    padding: 0 4px;
    border-radius: 4px;
  }

  .goal-x {
    bottom: 32px;
    right: 56px;
  }

  .goal-y {
    left: 22px;
    top: 22px;
  }

  .plot {
    transform: translate(80px, 280px);
  }

  .goal-card {
    min-width: 300px;
    max-width: 600px;
    background: white;
    border-radius: 10px;
    margin: 10px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .goal-card__details--wrapper {
    padding: 30px 40px;
  }

  .goal-card__details--wrapper h1 {
    margin: 0;
    text-align: left;
    padding-bottom: 10px;
    font-size: 36px;
    font-weight: 500;
  }

  .goal-card__details--wrapper h2 {
    margin: 0;
    text-align: left;
    color: #0099CC;
    font-weight: 500;
    padding-bottom: 30px;
  }

  .goal-card__details {
    text-align: left;
    font-size: 16px;
  }

  .goal-card__graph--wrapper {
    background: #FFCC01;
    height: 350px;
    position: relative;
  }

  .goal-card__graph--stage {
    width: 100%;
    height: 100%;
  }

  .v-axis {
    transform: translate(80px, 30px);
  }

  .h-axis {
    transform: translate(80px, 280px);
  }

  .habit-buttons {
    position: absolute;
    top: 0;
    right: 0;
  }

  .habit-buttons button {
    font-size: 24px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: transparent;
    color: lightgrey;
  }

  .habit-buttons button:hover {
    color: #0099CC;
  }

  .cell {
    width: 30px;
    display: flex;
    flex-direction: column;
  }

  .cell-private {
    background: #0099CC;
  }

  .habit-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    padding: 2px 8px;
    margin: 0 -8px;
    height: 34px;
  }

  .habit-title {
    color: black;
    text-align: left;
    font-size: 22px;
  }

  .day {
    z-index: 100;
    width: 30px;
    font-size: 16px;
  }
</style>
