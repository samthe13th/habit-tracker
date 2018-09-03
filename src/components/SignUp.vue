<template>
    <div class="sign-up">
        <h3>Sign Up</h3>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Password"></br>
        <button v-on:click="signUp">Sign Up</button>
        <p>or go back to <router-link to="/login">login</router-link></p>
    </div>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: 'sign-up',
        data: function () {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            signUp: function() {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                    (user) => {
                        this.$router.replace('hello');
                    }, 
                    (err) => {
                        alert('Oops, ' + err.message)
                    }
                );
            }
        }
    }
</script>

<style scoped>
    .signUp {
        margin-top: 40px;
    }

    input {
        margin: 5px 0;
        width: 250px;
        padding: 10px;
        border: solid 1px lightgrey;
        font-size: 14px;
    }

    button {
        margin-top: 30px;
        cursor: pointer;
        height: 30px;
        background: none;
        font-size: 14px;
    }

    p {
        margin-top: 40px;
        font-size: 14px;
    }

    p a {
        text-decoration: underline;
        cursor: pointer;
    }

    span {
        display: block;
        margin-top: 20px;
        font-size: 11px;
    }
</style>