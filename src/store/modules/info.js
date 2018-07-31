export default {
  namespaced: true,
  state: {
    tuwenId: localStorage.getItem("tuwenId") || "", //图文编辑id - 供修改资讯编辑用
    videoId: localStorage.getItem("tuwenId") || "" //视频编辑id
  },
  mutations: {
    updateTuwenId(state, id) {
      state.tuwenId = id;
      localStorage.setItem("tuwenId", id);
    },
    updateVideoId(state, id) {
      state.tuwenId = id;
      localStorage.setItem("videoId", id);
    }
  }
};