<template>
  <div class="mypage">
    <div class="menu">
      <Menu />
    </div>
    <div class="container flex">
      <div class="reservations">
        <h2 class="title">予約状況</h2>
        <div class="reservations-list flex">
          <div
            class="reservations-box"
            v-for="reservation in reservations"
            :key="reservation.id"
          >
            <div class="reservations-top flex">
              <img src="../assets/img/clock.png" />
              <h2>予約 {{ reservation.id }}</h2>
              <img
                v-if="!afterDay(reservation.date)"
                class="delete-btn"
                src="../assets/img/cancel.png"
                @click="deleteReservation(reservation.id)"
              />
            </div>
            <table>
              <tr>
                <th>Shop</th>
                <td>{{ reservation.store.name }}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{{ reservation.date }}</td>
              </tr>
              <tr>
                <th>Time</th>
                <td>{{ reservation.time.slice(0, 5) }}</td>
              </tr>
              <tr>
                <th>Number</th>
                <td>{{ reservation.number }}人</td>
              </tr>
            </table>

            <button
              v-if="!afterDay(reservation.date)"
              class="btn option-btn"
              @click="
                changeOpen(
                  reservation.id,
                  reservation.date,
                  reservation.time,
                  reservation.number
                )
              "
            >
              予約を変更する
            </button>
            <button
              v-if="afterDay(reservation.date)"
              class="btn option-btn"
              @click="toReview(reservation.store.id)"
            >
              レビューする
            </button>
          </div>
        </div>
        <div class="reservation-change-modal" v-show="modal">
          <div class="reservation-change-content">
            <table>
              <tr>
                <th>予約</th>
                <th>{{ changeReservationId }}</th>
              </tr>
              <tr>
                <th>Date</th>
                <td>
                  <input
                    type="date"
                    name="date"
                    class="input-date"
                    :min="today"
                    v-model="date"
                  />
                </td>
              </tr>
              <tr>
                <th>Time</th>
                <td>
                  <select name="time" class="input-time" v-model="time">
                    <option
                      v-show="beforeTime(reservationTime)"
                      v-for="reservationTime in reservationTimes"
                      :key="reservationTime"
                      :value="reservationTime"
                      >{{ reservationTime }}</option
                    >
                  </select>
                </td>
              </tr>
              <tr>
                <th>Number</th>
                <td>
                  <select name="number" class="input-number" v-model="number">
                    <option :value="n" v-for="n in 10" :key="n"
                      >{{ n }}人</option
                    >
                  </select>
                </td>
              </tr>
            </table>

            <button
              class="btn option-btn modal-btn"
              @click="changeReservation()"
            >
              予約を変更する
            </button>
            <button @click="closeModal" class="modal-btn btn option-btn">
              閉じる
            </button>
          </div>
        </div>
      </div>
      <div class="likestores">
        <h2 class="username">{{ $store.state.user.userName }}</h2>
        <h2 class="title">お気にり店舗</h2>
        <div class="store-list flex">
          <div
            v-for="likestore in likedStores"
            :key="likestore.id"
            class="store-card"
          >
            <img :src="likestore.store.img_path" class="store-card-img" />
            <div class="store-card-detail">
              <h2>{{ likestore.store.name }}</h2>
              <div class="flex store-card-tag">
                <a>#{{ likestore.store.area.name }}</a>
                <a>#{{ likestore.store.genre.name }}</a>
              </div>
              <div class="flex store-card-action">
                <button
                  class="store-card-btn"
                  @click="toStoreDetail(likestore.store.id)"
                >
                  詳しく見る
                </button>
                <img
                  v-if="$store.state.user.userId"
                  class="like-btn"
                  src="../assets/img/like.png"
                  :class="likeIf(likestore.store.id)"
                  @click="like(likestore.store.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservations: [],
      likedStores: [],
      changeReservationId: "",
      date: "",
      time: "",
      number: "",
      modal: false,
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
    async getReservations() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/users/" +
          this.$store.state.user.userId +
          "/reservations"
      );
      this.reservations = getData.data.data;
    },
    async getLikeStores() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/users/" +
          this.$store.state.user.userId +
          "/likes"
      );
      this.likedStores = getData.data.data;
    },
    async like(storeId) {
      if (!this.likedStores[0]) {
        const sendData = {
          user_id: this.$store.state.user.userId,
          store_id: storeId
        };
        await this.$axios.post(
          "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/likes",
          sendData
        );
      } else {
        const likeIndex = this.likedStores.findIndex(
          like => like.store_id === storeId
        );
        if (likeIndex !== -1) {
          await this.$axios.delete(
            "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/likes/" +
              this.likedStores[likeIndex].id
          );
        } else {
          const sendData = {
            user_id: this.$store.state.user.userId,
            store_id: storeId
          };
          await this.$axios.post(
            "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/likes",
            sendData
          );
        }
      }
      this.getLikeStores();
    },
    likeIf(id) {
      if (this.likedStores[0]) {
        if (this.likedStores.some(like => like.store_id === id)) {
          return "liked";
        } else {
          return "notlike";
        }
      } else {
        return "notlike";
      }
    },
    async deleteReservation(reservationId) {
      await this.$axios.delete(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reservations/" +
          reservationId
      );
      this.getReservations();
      alert("予約を削除しました");
    },
    toStoreDetail(storeId) {
      this.$router.push("/detail/" + storeId);
    },
    async changeReservation() {
      const nowH = new Date().getHours();
      const today = new Date();
      if (!this.date || !this.time || !this.number) {
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
        date: this.date,
        time: this.time,
        number: this.number
      };
      await this.$axios.put(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reservations/" +
          this.changeReservationId,
        sendData
      );
      alert("予約を変更しました");
      this.getReservations();
      this.modal = false;
    },
    changeOpen(storeId, date, time, number) {
      this.modal = true;
      this.changeReservationId = storeId;
      this.date = date;
      this.time = time;
      this.number = number;
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
    },
    afterDay(date) {
      const today = new Date();
      if (
        today.getFullYear() +
          "-" +
          ("0" + (today.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + today.getDate()).slice(-2) >
        date
      ) {
        return true;
      } else {
        return false;
      }
    },
    toReview(storeId) {
      this.$router.push("/review/" + storeId);
    },
    closeModal() {
      this.modal = false;
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
    this.getReservations();
    this.getLikeStores();
  }
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: 0 auto 30px;
}
.menu {
  width: 95%;
  margin: 40px auto 0;
}
.reservations {
  width: 40%;
  margin: 50px auto 0;
}
.title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 30px;
}
.reservations-list {
  flex-wrap: wrap;
}
.reservations-box {
  width: 100%;
  background-color: #2f5dff;
  border-radius: 8px;
  box-shadow: 1px 1px 5px #888;
  padding: 15px 20px;
  color: #fff;
  margin-bottom: 20px;
}
.reservations-top {
  align-items: center;
  height: 30px;
  margin-bottom: 20px;
}
.reservations-top img {
  width: 30px;
  height: 30px;
  filter: invert(100%);
}
.reservations-top h2 {
  font-size: 1.2rem;
  width: 80%;
  margin: 0 30px;
}
.reservations-box table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 15px;
}

.reservations-box table th {
  text-align: left;
  width: 120px;
}

.option-btn {
  background-color: #5497ee;
  display: block;
  margin: 10px auto 0;
  padding: 8px 16px;
  width: 200px;
}

.delete-btn {
  cursor: pointer;
}

.username {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.likestores {
  width: 55%;
  margin: 0 auto;
}
.store-list {
  flex-wrap: wrap;
  margin: -15px -1% 30px;
}
.store-card {
  width: 48%;
  box-shadow: 1px 1px 5px #888;
  border-radius: 8px;
  padding-bottom: 20px;
  margin: 15px 1% 0px;
  background-color: #fff;
}

.store-card-img {
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.store-card-detail {
  width: 90%;
  margin: 15px auto 0;
}
.store-card-detail h2 {
  font-size: 1.3rem;
}

.store-card-tag {
  margin: 10px auto 15px;
  font-size: 0.9rem;
  color: #222;
}
.store-card-tag a {
  margin-right: 5px;
}

.store-card-action {
  justify-content: space-between;
}
.store-card-btn {
  background-color: #2f5dff;
  box-shadow: 1px 1px 5px #888;
  border-radius: 8px;
  color: #fff;
  padding: 8px 15px;
  border: none;
  font-size: 1.05rem;
  cursor: pointer;
}
.like-btn {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.liked {
  filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg)
    brightness(95%) contrast(112%);
}
.notlike {
  filter: invert(90%) sepia(0%) saturate(50%) hue-rotate(143deg)
    brightness(101%) contrast(93%);
}

.reservation-change-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
}
.reservation-change-content {
  width: 600px;
  text-align: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
  padding: 30px 0 20px;
}
.reservation-change-content table {
  width: 90%;
  margin: 0 auto;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 12px;
}
.reservation-change-content input {
  width: 70%;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
}
.reservation-change-content select {
  width: 50%;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
}

.modal-btn {
  margin-top: 15px;
}
</style>
