<template>
    <div class="dashboard">
        <div class="card-group">
            <a class="module-card" id="habit-card" href="#/habits">
                <img src="../assets/lifer_icons--habit.png"></img>
                <div>Habits</div>
            </a>
            <div class="module-card" id="list-card--disabled">
                <img src="../assets/lifer_icons--list.png"></img>
                <div>Lists</div>
                <div class="in-development">In Development</div>
            </div>
            <div class="module-card" id="goal-card--disabled">
                <img src="../assets/lifer_icons--goal.png"></img>
                <div>Goals</div>
                <div class="in-development">In Development</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data: function () {
            return {
            }
        },
        methods: {
        },
    }
</script>

<style scoped>
    .dashboard {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .card-group {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .module-card {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 250px;
        width: 250px;
        border-radius: 8px;
        margin: 30px;
        font-size: 28px;
        color: white;
        font-weight: 800;
    }

    .in-development {
        position: absolute;
        bottom: 0; 
        right: -20%;
        transform: rotate(-30deg);
        background: tomato;
        padding: 10px;
    }

    .module-card--disabled {
        background: grey;
    }

    .module-card img {
        height: 50%;
        width: 50%;
    }

    #habit-card {
        background: #77b4e1;
    }

    #list-card {
        background: #7cdbd2;
    }

    [id*="--disabled"] {
        background: lightgrey;
    }

    #goal-card {
        background: #fcd06a;
    }
</style>