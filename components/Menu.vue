<template>
    <div class="menu">
      <div class="menu-box flex">
        <div class="menu-btn" :class="{open: open}" @click="openMenu">
                <span class="menu__line--top" ></span>
                <span class="menu__line--middle"></span>
                <span class="menu__line--bottom"></span>
        </div>
        <h2 class="logo">Rese</h2>
      </div>
      <div class="menu-list" v-show="open">
          <ul>
            <li @click="toHome">Home</li>
            <li v-if="!$store.state.user.userId" @click="toRegister">registration</li>
            <li v-if="!$store.state.user.userId" @click="toLogin">Login</li>
            <li v-if="$store.state.user.userId" @click="logout">Logout</li>
            <li v-if="$store.state.user.userId" @click="toMypage">Mypage</li>
          </ul>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
          open: false
        }
    },
    methods: {
      openMenu() {
        if(this.open === true) {
          this.open = false;
        } else {
          this.open = true;
        }
      },
      async logout() {
        try {
          await this.$auth.logout();
          alert('ログアウトしました')
          this.$store.commit('user/userIdSet', "")
          this.$router.push("/login")
        } catch(error) {
          console.log(error)
        }
      },
      toHome() {
        this.$router.push('/')
      },
      toRegister() {
        this.$router.push('/register')
      },
      toLogin() {
        this.$router.push('/login')
      },
      toMypage() {
        this.$router.push('/mypage')
      },
    }
}
</script>

<style scoped>


.menu-btn {
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: relative;
    background-color: #2f5dff;
    border-radius: 8px;
    box-shadow: 1px 1px 5px #888;
    z-index: 10;
    margin-right: 10px;
}

.menu__line--top,
.menu__line--middle,
.menu__line--bottom {
  display: inline-block;
  height: 1px;
  background-color: #fff;
  position: absolute;
  transition: 0.5s;
  z-index: 20;
  left: 20%;
}
.menu__line--top {
  top: 10px;
  width: 30%;
}
.menu__line--middle {
  top: 20px;
  width: 60%;
}
.menu__line--bottom {
  bottom: 10px;
  width: 15%;
}

.menu-btn.open {
  position: fixed;
}

.menu-btn.open span:nth-of-type(1) {
  top: 19px;
  width: 25px;
  height: 1.5px;
  left: 7px;
  transform: rotate(45deg);
}
.menu-btn.open span:nth-of-type(2) {
  opacity: 0;
}
.menu-btn.open span:nth-of-type(3) {
  top: 19px;
  width: 25px;
  height: 1.5px;
  left: 7px;
  transform: rotate(-45deg);
}

.logo {
  color: #2f5dff;
  position: relative;
  font-size: 40px;
}

.menu-list {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 5;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  color: #2f5dff;
}
.menu-list ul{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
.menu-list li {
  list-style: none;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
</style>