<template>
  <div class="top">
    <div class="menu flex">
      <Menu/>
      <div class="search-box flex">
        <div class="search-select">
          <select name="area" v-model="selectArea">
            <option value=""  @click="getStores" selected>All area</option>
            <option v-for="(area,index) in areas" :key="index" :value="area">{{area}}</option>
          </select>
        </div>
        <span></span>
        <div class="search-select">
          <select name="genre" v-model="selectGenre">
            <option value="" @click="getStores" selected>All genre</option>
            <option v-for="(genre,index) in genres" :key="index" :value="genre">{{genre}}</option>
          </select>
        </div>
        <span></span>
        <div class="name-search flex">
          <img src="../assets/img/magnifying-glass.png">
          <input v-model="searchName" type="search" name="search" placeholder="Search ..." @input="getStores">
        </div>
      </div>
    </div>
    <div class="container">
      <div class="store-list flex">
        <div v-for="store in searchStores" :key="store.id" class="store-card">
          <img :src="store.img_path" class="store-card-img">
          <div class="store-card-detail">
            <h2>{{store.name}}</h2>
            <div class="flex store-card-tag">
              <a>#{{store.area.name}}</a>
              <a>#{{store.genre.name}}</a>
            </div>
            <div class="flex store-card-action">
              <button class="store-card-btn" @click="toStoreDetail(store.id)">詳しく見る</button>
              <img v-if="$store.state.user.userId" class="like-btn" src="../assets/img/like.png" :class="likeIf(store.id)"  @click="like(store.id)">
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
      stores: [],
      selectArea: "",
      selectGenre: "",
      searchName: "",
      likedStores: [],
      areas: [],
      genres: []
    }
  },
  methods: {
    async getStores() {
      const getData = await this.$axios.get("https://mysterious-plateau-61386.herokuapp.com/api/v1/stores");
      this.stores = getData.data.data;
      for (let index = 0; index < this.stores.length; index++) {
        const store = this.stores[index];
        if(this.areas.indexOf(store.area.name) === -1) {
          this.areas.push(store.area.name);
        }
        if(this.genres.indexOf(store.genre.name) === -1) {
          this.genres.push(store.genre.name);
        }
      }
    },
    async getlike() {
      if(this.$store.state.user.userId) {
        const getData = await this.$axios.get("https://mysterious-plateau-61386.herokuapp.com/api/v1/users/" + this.$store.state.user.userId + "/likes");
        this.likedStores = getData.data.data
      }
    },
    async like(storeId) {
      if(!this.likedStores[0]) {
        const sendData = {
            user_id: this.$store.state.user.userId,
            store_id: storeId
          };
          await this.$axios.post("https://mysterious-plateau-61386.herokuapp.com/api/v1/likes", sendData);
      } else {
        const likeIndex = this.likedStores.findIndex(like => like.store_id === storeId);
        if(likeIndex !== -1) {
          await this.$axios.delete("https://mysterious-plateau-61386.herokuapp.com/api/v1/likes/" + this.likedStores[likeIndex].id);
        } else {
          const sendData = {
              user_id: this.$store.state.user.userId,
              store_id: storeId
            };
            await this.$axios.post("https://mysterious-plateau-61386.herokuapp.com/api/v1/likes", sendData);
        }
      }
      this.getlike();
    },
    likeIf(id) {
      if(this.likedStores[0]){
          if(this.likedStores.some(like => like.store_id === id)) {
          return 'liked'
        } else {
          return 'notlike'
        }
      } else {
        return 'notlike'
      }
    },
    getUser() {
      if(this.$auth.loggedIn) {
        this.$store.commit('user/userIdSet', this.$auth.user.id)
        this.$store.commit('user/userNameSet', this.$auth.user.name)
        this.userId = this.$store.state.user.userId
      }
    },
    toStoreDetail(storeId) {
      if(!this.$store.state.user.userId) {
        return alert('ログインしてください')
      }
      this.$router.push('/detail/' + storeId)
    }
  },
  computed: {
    searchStores() {
      if(this.selectArea && this.selectGenre && this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.selectArea === store.area.name && this.selectGenre === store.genre.name && this.searchName === store.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(this.selectArea && !this.selectGenre && !this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          console.log(store.area.name);
          console.log(this.selectArea)
          if(this.selectArea === store.area.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(!this.selectArea && this.selectGenre && !this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.selectGenre === store.genre.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(!this.selectArea && !this.selectGenre && this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.searchName === store.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(this.selectArea && this.selectGenre && !this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.selectArea === store.area.name && this.selectGenre === store.genre.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(!this.selectArea && this.selectGenre && this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.selectGenre === store.genre.name && this.searchName === store.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      }
      else if(this.selectArea && !this.selectGenre && this.searchName) {
        const searchStores = [];
        for (let index = 0; index < this.stores.length; index++) {
          const store = this.stores[index];
          if(this.selectArea === store.area.name && this.searchName === store.name) {
            searchStores.push(store);
          }
        }
        return searchStores;
      } else {
        return this.stores;
      }
    }

  },
  created() {
    this.getStores();
    this.getlike();
    this.getUser();
  }
}
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

  .name-search img{
    padding-top: 12px;
    height: 40%;
    filter: invert(90%) sepia(0%) saturate(50%) hue-rotate(143deg) brightness(101%) contrast(93%);
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
    font-size: .9rem;
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
    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(95%) contrast(112%);
  }
  .notlike {
    filter: invert(90%) sepia(0%) saturate(50%) hue-rotate(143deg) brightness(101%) contrast(93%);
  }
</style>