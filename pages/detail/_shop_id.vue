<template>
    <div class="store_detail">
        <div class="container flex">
            <div class="detail">
                <div class="menu">
                    <Menu/>
                </div>
                <div class="detail-box">
                    <div class="store-name flex">
                        <button @click="toTop" class="back-btn">＜</button>
                        <p>{{store.name}}</p>
                    </div>
                    <img :src="store.img_path" class="store-img">
                    <div class="store-tag">
                        <a>#{{area.name}}</a>
                        <a>#{{genre.name}}</a>
                    </div>
                    <p class="store-overview">
                        {{store.overview}}
                    </p>
                </div>
            </div>
            <div class="reservation">
                <div class="reservation-box">
                    <h2>予約</h2>
                    <input type="date" name="date" class="input-date" :min="today" v-model="date">
                    <select name="time" class="input-time" v-model="time">
                        <option v-show="beforeTime('09')" value="9:00">9:00</option>
                        <option v-show="beforeTime('09')" value="9:30">9:30</option>
                        <option v-show="beforeTime('10')" value="10:00">10:00</option>
                        <option v-show="beforeTime('10')" value="10:30">10:30</option>
                        <option v-show="beforeTime('11')" value="11:00">11:00</option>
                        <option v-show="beforeTime('11')" value="11:30">11:30</option>
                        <option v-show="beforeTime('12')" value="12:00">12:00</option>
                        <option v-show="beforeTime('12')" value="12:30">12:30</option>
                        <option v-show="beforeTime('13')" value="13:00">13:00</option>
                        <option v-show="beforeTime('13')" value="13:30">13:30</option>
                        <option v-show="beforeTime('14')" value="14:00">14:00</option>
                        <option v-show="beforeTime('14')" value="14:30">14:30</option>
                        <option v-show="beforeTime('15')" value="15:00">15:00</option>
                        <option v-show="beforeTime('15')" value="15:30">15:30</option>
                        <option v-show="beforeTime('16')" value="16:00">16:00</option>
                        <option v-show="beforeTime('16')" value="16:30">16:30</option>
                        <option v-show="beforeTime('17')" value="17:00">17:00</option>
                        <option v-show="beforeTime('17')" value="17:30">17:30</option>
                        <option v-show="beforeTime('18')" value="18:00">18:00</option>
                        <option v-show="beforeTime('18')" value="18:30">18:30</option>
                        <option v-show="beforeTime('19')" value="19:00">19:00</option>
                        <option v-show="beforeTime('19')" value="19:30">19:30</option>
                        <option v-show="beforeTime('20')" value="20:00">20:00</option>
                        <option v-show="beforeTime('20')" value="20:30">20:30</option>
                        <option v-show="beforeTime('21')" value="21:00">21:00</option>
                        <option v-show="beforeTime('21')" value="21:30">21:30</option>
                        <option v-show="beforeTime('22')" value="22:00">22:00</option>
                        <option v-show="beforeTime('22')" value="22:30">22:30</option>
                        <option v-show="beforeTime('23')" value="23:00">23:00</option>
                        <option v-show="beforeTime('23')" value="23:30">23:30</option>
                    </select>
                    <select name="number" class="input-number" v-model="number">
                        <option :value="1">1人</option>
                        <option :value="2">2人</option>
                        <option :value="3">3人</option>
                        <option :value="4">3人</option>
                        <option :value="5">4人</option>
                        <option :value="6">6人</option>
                        <option :value="7">7人</option>
                        <option :value="8">8人</option>
                        <option :value="9">9人</option>
                    </select>
                    <div class="reservation-content">
                        <table>
                            <tr>
                                <th>Shop</th>
                                <td>{{store.name}}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{{date}}</td>
                            </tr>
                            <tr>
                                <th>Time</th>
                                <td>{{time}}</td>
                            </tr>
                            <tr>
                                <th>Number</th>
                                <td>{{number}}人</td>
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
        }
    },
    methods: {
        async getShop() {
            const getData = await this.$axios.get("https://mysterious-plateau-61386.herokuapp.com/api/v1/stores/" + this.$route.params.shop_id);
            this.store = getData.data.data
            this.area = this.store.area
            this.genre = this.store.genre
        },
        toTop() {
            this.$router.push("/");
        },
        async reserve() {
            if(!this.date || !this.time) {
                return alert('必要事項を入力してください')
            }
            const sendData = {
                user_id: this.$store.state.user.userId,
                store_id: this.store.id,
                date: this.date,
                time: this.time,
                number: this.number
            }
            await this.$axios.post("https://mysterious-plateau-61386.herokuapp.com/api/v1/reservations", sendData);
            this.$router.push("/done");
        },
        beforeTime(time) {
            const nowH = new Date().getHours();
            if(time <= nowH) {
                return false
            } else {
                return true
            }
        }
    },
    computed: {
        today() {
            const today = new Date();
            return today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
        },
    },
    created() {
        this.getShop();
    }
}
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

.store-name p{
    font-size: 1.7rem;
    font-weight: bold;
    margin-left: 10px;
}

.store-tag {
    margin: 20px 0;
    font-size: .9rem;
}

.store-overview {
    font-size: .9rem;
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
    margin:0 auto 0 0;
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