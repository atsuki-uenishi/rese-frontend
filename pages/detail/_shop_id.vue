<template>
  <div class="store_detail">
    <div class="container flex">
      <div class="detail">
        <div class="menu">
          <Menu />
        </div>
        <div class="detail-box">
          <div class="store-name flex">
            <button @click="toTop" class="back-btn">＜</button>
            <p>{{ store.name }}</p>
          </div>
          <img :src="store.img_path" class="store-img" />
          <div class="store-tag">
            <a>#{{ area.name }}</a>
            <a>#{{ genre.name }}</a>
          </div>
          <p class="store-overview">
            {{ store.overview }}
          </p>
        </div>
      </div>
      <div class="reservation">
        <div class="reservation-box">
          <h2>予約</h2>
          <input
            type="date"
            name="date"
            class="input-date"
            :min="today"
            v-model="date"
          />
          <select name="time" class="input-time" v-model="time">
            <option
              v-show="beforeTime(reservationTime)"
              v-for="reservationTime in reservationTimes"
              :key="reservationTime"
              :value="reservationTime"
              >{{ reservationTime }}</option
            >
          </select>
          <select name="number" class="input-number" v-model="number">
            <option :value="n" v-for="n in 10" :key="n">{{ n }}人</option>
          </select>
          <div class="reservation-content">
            <table>
              <tr>
                <th>Shop</th>
                <td>{{ store.name }}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{{ date }}</td>
              </tr>
              <tr>
                <th>Time</th>
                <td>{{ time }}</td>
              </tr>
              <tr>
                <th>Number</th>
                <td>{{ number }}人</td>
              </tr>
            </table>
          </div>
        </div>
        <button class="reservation-btn btn" @click="reserve">予約する</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      store: "",
      area: "",
      genre: "",
      date: "",
      time: "",
      number: "1",
      reservationTimes: [
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30"
      ]
    };
  },
  methods: {
    async getShop() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/v1/stores/" +
          this.$route.params.shop_id
      );
      this.store = getData.data.data;
      this.area = this.store.area;
      this.genre = this.store.genre;
    },
    toTop() {
      this.$router.push("/");
    },
    async reserve() {
      const nowH = new Date().getHours();
      const today = new Date();
      if (!this.date || !this.time) {
        return alert("必要事項を入力してください");
      }
      if (this.time.slice(0, 1) == 1 || this.time.slice(0, 1) == 2) {
        if (
          today.getFullYear() +
            "-" +
            ("0" + (today.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + today.getDate()).slice(-2) ==
            this.date &&
          this.time.slice(0, 2) <= nowH
        ) {
          return alert("時間が不適切です");
        }
      } else {
        if (
          today.getFullYear() +
            "-" +
            ("0" + (today.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + today.getDate()).slice(-2) ==
            this.date &&
          this.time.slice(0, 1) <= nowH
        ) {
          return alert("時間が不適切です");
        }
      }
      const sendData = {
        user_id: this.$store.state.user.userId,
        store_id: this.store.id,
        date: this.date,
        time: this.time,
        number: this.number
      };
      await this.$axios.post(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reservations",
        sendData
      );
      this.$router.push("/done");
    },
    beforeTime(time) {
      const nowH = new Date().getHours();
      const today = new Date();
      if (
        today.getFullYear() +
          "-" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + today.getDate()).slice(-2) !==
        this.date
      ) {
        return true;
      } else {
        if (time.slice(0, 1) == 1 || time.slice(0, 1) == 2) {
          if (time.slice(0, 2) <= nowH) {
            return false;
          } else {
            return true;
          }
        } else {
          if (time.slice(0, 1) <= nowH) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  },
  computed: {
    today() {
      const today = new Date();
      return (
        today.getFullYear() +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2)
      );
    }
  },
  created() {
    this.getShop();
  }
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
}

.detail {
  width: 40%;
  margin: 40px auto 30px;
}
.reservation {
  width: 40%;
  margin: 40px auto 50px;
  background-color: #2f5dff;
  position: relative;
  color: #fff;
  border-radius: 8px;
}
.menu {
  width: 100%;
  margin: 0 auto 50px 0;
}

.store-img {
  width: 100%;
}

.back-btn {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  box-shadow: 1px 1px 3px #888;
  background-color: #fff;
  border: none;
  padding: 5px;
}
.store-name {
  align-items: center;
  margin-bottom: 25px;
}

.store-name p {
  font-size: 1.7rem;
  font-weight: bold;
  margin-left: 10px;
}

.store-tag {
  margin: 20px 0;
  font-size: 0.9rem;
}

.store-overview {
  font-size: 0.9rem;
}

.reservation-box {
  width: 85%;
  margin: 0 auto;
}

.reservation h2 {
  margin: 20px auto;
  font-weight: bold;
  font-size: 1.3rem;
}

.reservation input,
.reservation select {
  display: block;
  margin: 0 auto 0 0;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  height: 30px;
}
.input-time,
.input-number {
  width: 100%;
}
.input-date {
  width: 50%;
}

.reservation-btn {
  background-color: #052fd8;
  display: block;
  width: 100%;
  bottom: 0;
  position: absolute;
  height: 60px;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
}

.reservation-content {
  background-color: #5497ee;
  margin: 0 auto;
  border-radius: 8px;
  padding: 10px 15px;
}

.reservation-content table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 15px;
}

.reservation-content table th {
  font-weight: normal;
  text-align: left;
  width: 120px;
}
</style>
