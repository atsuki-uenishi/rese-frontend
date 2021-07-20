export const state = () => ({
    userId: "",
    userName: ""
})

export const mutations = {
    userIdSet(state, payload) {
        state.userId = payload;
    },
    userNameSet(state, payload) {
        state.userName = payload;
    },
}