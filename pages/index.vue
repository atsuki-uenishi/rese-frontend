<template>
  <div class="top">
    <div class="menu flex">
      <Menu />
      <div class="search-box flex">
        <div class="search-select">
          <select namåe="area" v-model="selectArea">
            <option value="" @click="getStores" selected>All area</option>
            <option v-for="area in areas" :key="area.id" :value="area">{{
              area
            }}</option>
          </select>
        </div>
        <span></span>
        <div class="search-select">
          <select name="genre" v-model="selectGenre">
            <option value="" @click="getStores" selected>All genre</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre">{{
              genre
            }}</option>
          </select>
        </div>
        <span></span>
        <div class="name-search flex">
          <img src="../assets/img/magnifying-glass.png" />
          <input
            v-model="searchName"
            type="search"
            name="search"
            placeholder="Search ..."
            @input="getStores"
          />
        </div>
      </div>
    </div>
    <div class="container">
      <div class="store-list flex">
        <div v-for="store in showStores" :key="store.id" class="store-card">
          <img :src="store.img_path" class="store-card-img" />
          <div class="store-card-detail">
            <h2>{{ store.name }}</h2>
            <div class="flex store-card-tag">
              <a>#{{ store.area.name }}</a>
              <a>#{{ store.genre.name }}</a>
            </div>
            <div class="star flex">
              <img
                class="star-small"
                :class="{ active: averageRating(store.reviews) >= 1 }"
                src="../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: averageRating(store.reviews) >= 2 }"
                src="../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: averageRating(store.reviews) >= 3 }"
                src="../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: averageRating(store.reviews) >= 4 }"
                src="../assets/img/star.png"
              />
              <img
                class="star-small"
                :class="{ active: averageRating(store.reviews) >= 5 }"
                src="../assets/img/star.png"
              />
              <p>{{ averageRating(store.reviews) }}</p>
              <p>({{ store.reviews.length }}件)</p>
            </div>
            <div class="flex store-card-action">
              <button class="store-card-btn" @click="toStoreDetail(store.id)">
                詳しく見る
              </button>
              <img
                v-if="$store.state.user.userId"
                class="like-btn"
                src="../assets/img/like.png"
                :class="likeIf(store.id)"
                @click="like(store.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <paginate
        :page-count="getPageCount"
        :page-range="3"
        :margin-pages="2"
        :click-handler="clickCallback"
        :prev-text="'＜'"
        :next-text="'＞'"
        :container-class="'pagination flex'"
        :page-class="'pagination-item'"
        :page-link-class="'pagination-item__link'"
        :prev-class="'pagination-btn pagination-prev'"
        :prev-link-class="'pagination-btn__link'"
        :next-class="'pagination-btn pagination-next'"
        :next-link-class="'pagination-btn__link'"
        :hide-prev-next="true"
      >
      </paginate>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stores: [],
      selectArea: "",
      selectGenre: "",
      searchName: "",
      likedStores: [],
      areas: [],
      genres: [],
      parPage: 8,
      currentPage: 1
    };
  },
  methods: {
    async getStores() {
      const getData = await this.$axios.get(
        "https://mysterious-plateau-61386.herokuapp.com/api/v1/stores"
      );
      this.stores = getData.data.data;
      for (let index = 0; index < this.stores.length; index++) {
        const store = this.stores[index];
        if (this.areas.indexOf(store.area.name) === -1) {
          this.areas.push(store.area.name);
        }
        if (this.genres.indexOf(store.genre.name) === -1) {
          this.genres.push(store.genre.name);
        }
        if (this.$store.state.user.userId) {
          for (let index = 0; index < store.likes.length; index++) {
            const likeStore = store.likes[index];
            if (likeStore.user_id === this.$store.state.user.userId) {
              this.likedStores.push(likeStore);
            }
          }
        }
      }
    },
    async getLike() {
      if (this.$store.state.user.userId) {
        const getData = await this.$axios.get(
          "https://mysterious-plateau-61386.herokuapp.com/api/auth/v1/users/" +
            this.$store.state.user.userId +
            "/likes"
        );
        this.likedStores = getData.data.data;
      }
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
      this.getLike();
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
    getUser() {
      if (this.$auth.loggedIn) {
        this.$store.commit("user/userIdSet", this.$auth.user.id);
        this.$store.commit("user/userNameSet", this.$auth.user.name);
        this.userId = this.$store.state.user.userId;
      }
      this.getStores();
    },
    toStoreDetail(storeId) {
      if (!this.$store.state.user.userId) {
        return alert("ログインしてください");
      }
      this.$router.push("/detail/" + storeId);
    },
    averageRating(reviews) {
      if (!reviews[0]) {
        return 0;
      }
      let averageRating = 0;
      for (let index = 0; index < reviews.length; index++) {
        const rating = reviews[index].rating;
        averageRating += rating;
      }
      return Math.round((averageRating / reviews.length) * 10) / 10;
    },
    clickCallback(pageNum) {
      this.currentPage = Number(pageNum);
    }
  },
  computed: {
    searchStores() {
      const searchStores = [];
      for (let index = 0; index < this.stores.length; index++) {
        const store = this.stores[index];
        if (
          store.name.indexOf(this.searchName) !== -1 &&
          store.area.name.indexOf(this.selectArea) !== -1 &&
          store.genre.name.indexOf(this.selectGenre) !== -1
        ) {
          searchStores.push(store);
        }
      }
      return searchStores;
    },
    showStores() {
      let current = this.currentPage * this.parPage;
      let start = current - this.parPage;
      return this.searchStores.slice(start, current);
    },
    getPageCount() {
      return Math.ceil(this.searchStores.length / this.parPage);
    }
  },
  created() {
    this.getUser();
  }
};
</script>

<style scoped>
.menu {
  justify-content: space-between;
  margin: 40px auto 30px;
  align-items: center;
  width: 90%;
}

/* Search-box CSS */
.search-box {
  height: 50px;
  box-shadow: 1px 1px 5px #888;
  border-radius: 8px;
  width: 600px;
  padding: 5px 10px;
  background-color: #fff;
}
.search-box input,
.search-box select {
  outline: none;
  border: none;
}
.search-box span {
  height: 70%;
  background-color: #ddd;
  display: inline-block;
  width: 2px;
  border-radius: 10px;
  margin: 6px 7px 0;
  z-index: 1;
}

select {
  appearance: none;
  top: 50%;
  left: 10px;
  position: absolute;
  transform: translateY(-50%);
  width: 100%;
  cursor: pointer;
}
.search-select {
  position: relative;
  width: 20%;
}

.search-select::after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  right: 8px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-bottom: 2px solid #888;
  border-right: 2px solid #888;
  pointer-events: none;
}

.name-search img {
  padding-top: 12px;
  height: 40%;
  filter: invert(90%) sepia(0%) saturate(50%) hue-rotate(143deg)
    brightness(101%) contrast(93%);
  margin-right: 10px;
}
.name-search input {
  height: 90%;
}

.container {
  width: 90%;
  margin: 0 auto;
}

/* Store Card Css */
.store-list {
  flex-wrap: wrap;
  margin: -15px -1% 30px;
}
.store-card {
  width: 23%;
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
.star-small {
  width: 10%;
  margin-right: 5px;
  filter: invert(50%);
}
.active {
  filter: invert(81%) sepia(81%) saturate(633%) hue-rotate(359deg)
    brightness(106%) contrast(105%);
}
.star {
  margin: 15px 0;
  align-items: center;
}
.star p {
  margin-left: 10px;
  font-size: 1.05rem;
}
</style>

<style>
.pagination {
  width: 100%;
  margin: 20px auto 0;
  justify-content: center;
  margin-bottom: 40px;
}

.pagination-item, .pagination-prev, .pagination-next{
  list-style: none;
}

.pagination-btn__link,
.pagination-item__link {
  border: solid 2px #2f5dff;
  box-shadow: 1px 1px 5px #888;
  border-radius: 8px;
  text-align: center;
  padding: .4rem 1.6rem;
  margin: 0 .4rem;
  display: block;
}
.pagination-btn__link:hover,
.pagination-item__link:hover {
  background-color: #2f5dff;
  color: #fff;
}
.active .pagination-item__link {
  background-color: #2f5dff;
  color: #fff;
  pointer-events: none;
}
</style>
