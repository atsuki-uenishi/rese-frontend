<template>
  <div class="done">
    <div class="menu">
      <Menu />
    </div>
    <div class="container">
      <p>ご予約ありがとうございます</p>
      <button class="btn back-btn" @click="toTop">戻る</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toTop() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.menu {
  width: 90%;
  margin: 40px auto 100px;
}

p {
  font-size: 1.8rem;
}

.container {
  width: 30%;
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
  padding: 120px 80px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px #888;
}
.back-btn {
  padding: 8px 20px;
  margin: 50px auto 0;
  font-size: 1.1rem;
}
</style>
