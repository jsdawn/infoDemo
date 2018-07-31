<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  computed: {
    themeName: {
      get() {
        return this.$store.state.common.themeName;
      },
      set(val) {
        this.$store.commit("common/updateThemeName", val);
      }
    }
  },
  mounted() {
    // 切换class
    console.log(window.SITE_CONFIG.cdnUrl);
    let body = document.getElementById("body");
    body.classList.add("theme" + this.themeName);
    // 切换css的引入
    let themeLink = document.getElementById("themeLink");
    if (process.env.NODE_ENV === "production") {
      themeLink.href =
        window.SITE_CONFIG.cdnUrl +
        "/static/element-ui-theme/element-" +
        this.themeName +
        "/index.css";
    } else {
      themeLink.href =
        "./static/element-ui-theme/element-" + this.themeName + "/index.css";
    }
  },
  watch: {
    themeName(newVal, oldVal) {
      // 切换class
      let body = document.getElementById("body");
      let oneClass = body.classList.item(0);
      body.classList.remove(oneClass);
      body.classList.add("theme" + newVal);
      // 切换css的引入
      let themeLink = document.getElementById("themeLink");
      if (process.env.NODE_ENV === "production") {
        themeLink.href =
          window.SITE_CONFIG.cdnUrl +
          "/static/element-ui-theme/element-" +
          this.themeName +
          "/index.css";
      } else {
        themeLink.href =
          "./static/element-ui-theme/element-" + this.themeName + "/index.css";
      }
    }
  }
};
</script>

<style lang="scss">
@import url("assets/scss/main.scss");
</style>