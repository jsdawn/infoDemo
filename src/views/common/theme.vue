<template>
  <el-form>
    <h2 style="margin-bottom:20px;">布局设置</h2>
    <el-form-item label="导航条类型">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="侧边栏皮肤">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item>
    <h2 v-if="false">主题设置</h2>
    <el-form-item label="选择主题" class="theme" v-if="false">
      <el-radio-group v-model="themeName">
        <el-radio label="0DAEC6" border>青色</el-radio>
        <el-radio label="17B3A3" border>蓝绿色</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  computed: {
    navbarLayoutType: {
      get () {
        return this.$store.state.common.navbarLayoutType
      },
      set (val) {
        this.$store.commit('common/updateNavbarLayoutType', val)
      }
    },
    sidebarLayoutSkin: {
      get () {
        return this.$store.state.common.sidebarLayoutSkin
      },
      set (val) {
        this.$store.commit('common/updateSidebarLayoutSkin', val)
      }
    },
    themeName: {
      get () {
        return this.$store.state.common.themeName
      },
      set (val) {
        this.$store.commit('common/updateThemeName', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.theme {
  .el-radio-group {
    .el-radio {
      margin-bottom: 10px;
      margin-left: 0px;
      margin-right: 10px;
    }
  }
}
</style>


