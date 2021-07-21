<template>
    <div class="mypage">
        <div class="menu">
            <Menu/>
        </div>
        <div class="container flex">
            <div class="reservations">
                <h2 class="title">予約状況</h2>
                <div class="reservations-list flex">
                <div class="reservations-box" v-for="(reservation, index) in reservations" :key="index">
                    <div class="reservations-top flex">
                        <img  src="../assets/img/clock.png">
                        <h2>予約{{index + 1}}</h2>
                        <img class="dlete-btn" src="../assets/img/cancel.png" @click="deleteReservation(reservation.id)">
                    </div>
                <table>
                    <tr>
                        <th>Shop</th>
                        <td>{{reservation.store.name}}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>{{reservation.date}}</td>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <td>{{reservation.time}}</td>
                    </tr>
                    <tr>
                        <th>Number</th>
                        <td>{{reservation.number}}人</td>
                    </tr>
                </table>
                </div>
            </div>
            </div>
            <div class="likestores">
                <h2 class="username">{{$store.state.user.userName}}</h2>
                <h2 class="title">お気にり店舗</h2>
                <div class="store-list flex">
                    <div v-for="likestore in stores" :key="likestore.id" class="store-card">
                        <img :src="likestore.store.img_path" class="store-card-img">
                        <div class="store-card-detail">
                        <h2>{{likestore.store.name}}</h2>
                        <div class="flex store-card-tag">
                            <a>#{{likestore.store.area.name}}</a>
                            <a>#{{likestore.store.genre.name}}</a>
                        </div>
                        <div class="flex store-card-action">
                            <button class="store-card-btn" @click="toStoreDetail(likestore.store.id)">詳しく見る</button>
                            <img v-if="$store.state.user.userId" class="like-btn" src="../assets/img/like.png" :class="likeIf(likestore.store.id)"  @click="like(likestore.store.id)">
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
            stores: [],
            likedStores: []
        }
    },
    methods: {
        async getlike() {
            if(this.$auth.loggedIn) {
                const getData = await this.$axios.get("APP_BASE_API/api/v1/users/" + this.$store.state.user.userId + "/likes");
                this.likedStores = getData.data.data
            }
        },
        async getReservations() {
            const getData = await this.$axios.get("APP_BASE_API/api/v1/users/" + this.$store.state.user.userId + "/reservations");
            this.reservations = getData.data.data
        },
        async getLikeStores() {
            const getData = await this.$axios.get("APP_BASE_API/api/v1/users/" + this.$store.state.user.userId + "/likes");
            this.stores = getData.data.data
        },
        async getlike() {
        if(this.$store.state.user.userId) {
            const getData = await this.$axios.get("APP_BASE_API/api/v1/users/" + this.$store.state.user.userId + "/likes");
            this.likedStores = getData.data.data
        }
        },
        async like(storeId) {
            if(!this.likedStores[0]) {
                const sendData = {
                    user_id: this.$store.state.user.userId,
                    store_id: storeId
                };
            await this.$axios.post("APP_BASE_API/api/v1/likes/", sendData);
            } else {
                const likeIndex = this.likedStores.findIndex(like => like.store_id === storeId);
                if(likeIndex !== -1) {
                await this.$axios.delete("APP_BASE_API/api/v1/likes/" + this.likedStores[likeIndex].id);
                } else {
                    const sendData = {
                        user_id: this.$store.state.user.userId,
                        store_id: storeId
                    };
                    await this.$axios.post("APP_BASE_API/api/v1/likes/", sendData);
                }
            }
            this.getlike();
            this.getLikeStores();
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
        async deleteReservation(reservationId) {
            await this.$axios.delete("APP_BASE_API/api/v1/reservations/" + reservationId);
            this.getReservations();
        },
        toStoreDetail(storeId) {
            this.$router.push('/detail/' + storeId)
        }
    },
    created() {
        this.getReservations();
        this.getLikeStores();
        this.getlike();
    }
}
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
.reservations-list{
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
.dlete-btn {
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