<template>
  <div class="store_detail">
    <div class="container flex">
      <div class="detail">
        <div class="menu">
          <Menu />
        </div>
        <div class="detail-box">
          <div class="store-name flex">
            <button @click="toBack" class="back-btn">＜</button>
            <p>{{ store.name }}</p>
            <img :src="store.img_path" class="store-img" />
          </div>
          <div class="reviews-list" v-for="review in reviews" :key="review.id">
            <div class="review-top flex">
              <p>{{ review.user.name }}</p>
              <img
                src="../../assets/img/cancel.png"
                class="delete-btn"
                v-show="review.user_id === userId"
                @click="deleteReview(review.id)"
              />
            </div>
            <div class="reviews-list-star flex">
              <img
                class="star-small"
                :class="{ active: review.rating >= 1 }"
                src="../../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: review.rating >= 2 }"
                src="../../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: review.rating >= 3 }"
                src="../../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: review.rating >= 4 }"
                src="../../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: review.rating >= 5 }"
                src="../../assets/img/star.png"
              />
            </div>
            <p>{{ review.review }}</p>
          </div>
        </div>
      </div>
      <div class="review">
        <div :class="{ notVisitedAlert: !visited }" v-if="!visited">
          <p>レビューは来店後投稿できます</p>
        </div>
        <div class="review-box" :class="{ notVisited: !visited }">
          <h2>レビュー</h2>
          <div class="star-box flex">
            <img
              class="star"
              :class="{ active: this.rating >= 1 }"
              src="../../assets/img/star.png"
              @click="star1"
            />
            <img
              class="star"
              :class="{ active: this.rating >= 2 }"
              src="../../assets/img/star.png"
              @click="star2"
            />
            <img
              class="star"
              :class="{ active: this.rating >= 3 }"
              src="../../assets/img/star.png"
              @click="star3"
            />
            <img
              class="star"
              :class="{ active: this.rating >= 4 }"
              src="../../assets/img/star.png"
              @click="star4"
            />
            <img
              class="star"
              :class="{ active: this.rating >= 5 }"
              src="../../assets/img/star.png"
              @click="star5"
            />
            <button class="btn satar-delete-btn" @click="starDelete">
              消去
            </button>
          </div>
          <div class="review-content">
            <textarea name="review" v-model="review" />
          </div>
          <button
            class="btn review-btn"
            @click="sendReview"
            v-if="!alreadyReview"
          >
            レビューする
          </button>
          <button
            class="btn review-btn"
            @click="changeReview"
            v-if="alreadyReview"
          >
            レビューを変更する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      store: "",
      reservations: [],
      review: "",
      rating: "0",
      reviews: [],
      alreadyReviewId: ""
    };
  },
  methods: {
    async getShop() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/v1/stores/" +
          this.$route.params.shop_id
      );
      this.store = getData.data.data;
      this.reservations = this.store.reservations;
    },
    toBack() {
      this.$router.push("/mypage");
    },
    star1() {
      this.rating = 1;
    },
    star2() {
      this.rating = 2;
    },
    star3() {
      this.rating = 3;
    },
    star4() {
      this.rating = 4;
    },
    star5() {
      this.rating = 5;
    },
    starDelete() {
      this.rating = 0;
    },
    async sendReview() {
      if (this.review) {
        const sendData = {
          user_id: this.$store.state.user.userId,
          store_id: this.store.id,
          rating: this.rating,
          review: this.review
        };
        await this.$axios.post(
          "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reviews",
          sendData
        );
        alert("レビューありがとうございます");
        this.getReviews();
      } else {
        alert("レビューを入力してください");
      }
    },
    async getReviews() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/v1/stores/" +
          this.$route.params.shop_id +
          "/reviews"
      );
      this.reviews = getData.data.data;
      this.alreadyReview();
    },
    async deleteReview(reviewId) {
      await this.$axios.delete(
        "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reviews/" +
          reviewId
      );
      this.getReviews();
      alert("レビューを削除しました");
    },
    alreadyReview() {
      const reviewIndex = this.reviews.findIndex(
        review => review.user_id === this.$store.state.user.userId
      );
      if (reviewIndex !== -1) {
        this.alreadyReviewId = this.reviews[reviewIndex].id;
        this.rating = this.reviews[reviewIndex].rating;
        this.review = this.reviews[reviewIndex].review;
        return true;
      } else {
        return false;
      }
    },
    async changeReview() {
      if (this.review) {
        const sendData = {
          rating: this.rating,
          review: this.review
        };
        await this.$axios.put(
          "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/reviews/" +
            this.alreadyReviewId,
          sendData
        );
        alert("レビューを変更しました");
        this.getReviews();
      } else {
        alert("レビューを入力してください");
      }
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    },
    visited() {
      const reservationIndex = this.reservations.findIndex(
        reservation => reservation.user_id === this.$store.state.user.userId
      );
      const today = new Date();
      if (
        reservationIndex !== -1 &&
        this.reservations[reservationIndex].date <
          today.getFullYear() +
            "-" +
            ("0" + (today.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + today.getDate()).slice(-2)
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.getShop();
    this.getReviews();
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
.review {
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
  width: 100px;
  margin-left: 50px;
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

.review-box {
  width: 85%;
  margin: 0 auto;
}

.review h2 {
  margin: 40px auto;
  font-weight: bold;
  font-size: 1.6rem;
}

.review-btn {
  background-color: #052fd8;
  display: block;
  width: 100%;
  bottom: 0;
  position: absolute;
  height: 60px;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
  left: 0px;
}

.reviews-list {
  color: #fff;
  background-color: #2f5dff;
  width: 70%;
  padding: 20px 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 1px 1px 3px #888;
}

.star-box {
  width: 90%;
  margin-top: 30px;
}

.reviews-list-star {
  margin: 10px 0;
}

.star {
  width: 10%;
  margin-right: 15px;
  cursor: pointer;
  filter: invert(100%);
}

.star-small {
  width: 5%;
  margin-right: 5px;
  filter: invert(100%);
}

.active {
  filter: invert(81%) sepia(81%) saturate(633%) hue-rotate(359deg)
    brightness(106%) contrast(105%);
}

.satar-delete-btn {
  background-color: #052fd8;
  border-radius: 30px;
  margin-left: 40px;
  padding: 5px 20px;
}

.review-content {
  margin: 40px 0 120px;
}
.review-content textarea {
  margin-top: 20px;
  resize: none;
  outline: none;
  border-radius: 8px;
  border: none;
  width: 90%;
  height: 250px;
}
.review-top {
  justify-content: space-between;
}
.delete-btn {
  width: 25px;
  height: 25px;
  filter: invert(100%);
  cursor: pointer;
}
.notVisited {
  opacity: 0;
  pointer-events: none;
}
.notVisitedAlert {
  opacity: 1;
  z-index: 10;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
