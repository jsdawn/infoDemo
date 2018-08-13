<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input  placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12" class="border-lt">
        <p class="tab-tile">规则结果</p>
        <ve-ring :data="chartData" :title="title" :settings="chartSettings" :legend-visible="false" :tooltip-visible="false" :colors="colors" height="300px"></ve-ring>
      </el-col>
      <el-col :span="12" class="role">
        <p class="tab-tile">规则结果</p>
        <p class="role-item">
          手机在网状态
          <span class="badge ok">通过</span>
        </p>
        <p class="role-item">
          银行卡三要素
          <span class="badge ok">通过</span>
        </p>
        <p class="role-item">
          借款人三要素
          <span class="badge no">不通过</span>
        </p>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import "echarts/lib/component/title";
export default {
  data() {
    return {
      title: {
        show: true,
        text: "950",
        left: "center",
        top: "middle",
        textStyle: {
          color: "#ABCE6A",
          fontWeight: "bold",
          fontSize: "30"
        }
      },
      colors: ["#ABCE6A", "#EFEFEF"],
      chartSettings: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        hoverAnimation: false,
        selectedMode: false,
        radius: ["70%", "75%"],
        offsetY: "50%"
      },
      chartData: {
        columns: ["评分", "数值"],
        rows: [{ 评分: "已得分", 数值: 950 }, { 评分: "未得分", 数值: 50 }]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.role {
  padding: 40px 20px 0 80px;
  font-size: 18px;
  .role-item {
    padding: 20px 0;
    .badge {
      background-color: #abce6a;
      color: #ffffff;
      display: inline-block;
      padding: 2px 5px;
      border-radius: 3px;
      margin-left: 5px;
      &:first-child {
        margin-left: 40px;
      }
      &.no {
        background-color: #f16d78;
      }
    }
  }
}
.el-col {
  position: relative;
}
.border-lt{
  border-right: 1px solid #eee;
}
.tab-tile {
  margin-bottom: 40px;
  font-size: 18px;
  position: absolute;
  left: 70px;
  top: 0;
}
</style>

