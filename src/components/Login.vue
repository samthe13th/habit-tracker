<template>
    <div class="login">
        <h3>Sign In</h3>
        <input type="text" v-model="email" placeholder="Email"></input><br></br>
        <input type="password" v-model="password" placeholder="Password"></input><br></br>
        <button v-on:click="signIn">Sign In</button>
        <p>You don't have an account? You can
            <router-link to="/sign-up">create one!</router-link>
        </p>
    </div>
</template>

<script>
    import firebase from 'firebase';
    
    export default {
        name: 'login',
        data: function () {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            signIn: function() {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
                    (user) => {
                       this.$router.replace('hello')
                    }, 
                    (err) => {
                        alert('Oops, ' + err.message)
                    }
                );
            }
        },
    }

</script>

<style scoped>
    .login {
        margin-top: 40px;
    }

    input {
        margin: 5px 0;
        width: 20%;
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
</style>