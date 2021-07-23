<template>
    <div class="register">
        <div class="menu">
            <Menu/>
        </div>
        <div class="container flex">
            <div class="box">
            <div class="register-box">
                <h2>Registration</h2>
            </div>
            <validation-observer ref="obs" v-slot="ObserverProps">
                <div class="input-box">
                    <div class="input-box-input flex">
                        <validation-provider v-slot="{ errors }" rules="required">
                            <img class="input-box-img" src="../assets/img/man.png">
                            <input type="text" placeholder="Username" name="username" v-model="username">
                            <div class="error">{{ errors[0] }}</div>
                        </validation-provider>
                    </div>
                    <div class="input-box-input flex">
                        <validation-provider v-slot="{ errors }" rules="required|email">
                            <img class="input-box-img" src="../assets/img/envelope.png">
                            <input type="email" placeholder="Email" name="email" v-model="email">
                            <div class="error">{{ errors[0] }}</div>
                        </validation-provider>
                    </div>
                    <div class="input-box-input flex">
                        <validation-provider v-slot="{ errors }" rules="required|min:6">
                            <img class="input-box-img" src="../assets/img/lock.png">
                            <input type="password" placeholder="Passwrod" name="password" v-model="password">
                            <div class="error">{{ errors[0] }}</div>
                        </validation-provider>
                    </div>
                    <button class="register-btn btn" @click="register" :disabled="ObserverProps.invalid || !ObserverProps.validated">登録</button>
                </div>
            </validation-observer>
        </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            email: "",
            password: ""
        }
    },
    methods: {
        async register() {
            try {
                await this.$axios.post("https://mysterious-plateau-61386.herokuapp.com/api/auth/register", {
                    name: this.username,
                    email: this.email,
                    password: this.password,
                });
                this.$router.push("/thanks");
                } catch {
                    alert("メールアドレスがすでに登録されています");
                }
        },
    }
}
</script>

<style scoped>
    .register {
        width: 100%;
        height: 100%;
    }
    .menu {
        width: 90%;
        margin: 40px auto 100px;
    }
    .error {
        color: red;
    }

    .container {
        justify-content: center;
    }

    .box {
        width: 30%;
        border-radius: 8px;
        box-shadow: 1px 1px 5px #888;
        background-color: #fff;
    }
    .register-box {
        background-color: #2f5dff;
        color: #fff;
        padding: 20px 20px;
        font-size: 1.1rem;
        border-radius: 8px 8px 0 0;
    }
    .input-box {
        width: 90%;
        margin: 0 auto;
        padding-top: 30px;
    }
    .input-box input {
        width: 86%;
        border: none;
        border-bottom: 1px solid #888;
        padding: 0;
        background-color: #fff;
        outline: none;
        font-size: 1.1rem;
    }
    .input-box-img {
        width: 9%;
        margin-right: 3%;
        vertical-align: middle;
        filter: invert(50%) sepia(0%) saturate(50%) hue-rotate(143deg) brightness(101%) contrast(93%);
    }
    .input-box-input {
        width: 100%;
        align-items: center;
        margin-bottom: 20px;
    }
    .register-btn {
        margin: 20px 0 20px auto;
        padding: 6px 18px;
        font-size: 1.1rem;
    }
</style>