<template>
  <div class="table">
    <div class="handle-box">
      <el-button type="primary" size="mini" @click="$router.push('/ifo-commList')">返回管理列表</el-button>
      <el-button v-if="isAuth('ifo:infoEdit:delete')" type="danger" size="mini" icon="delete" class="handle-del" @click="delAll" v-show="showType=='list'">批量删除</el-button>
      <div class="handle-right rt">
        <span class="item">
          <label>评论人</label>
          <el-input size="mini" v-model="name" placeholder="评论人" class="handle-input"></el-input>
        </span>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
      </div>
    </div>
    <div class="title">
      <p class="label">标题：</p>
      <p class="text">{{id}}</p>
    </div>
    <el-table v-loading="loadingList" v-show="showType=='list'" :data="articleList" size="small" header-cell-class-name="tableheader" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="内容">
      </el-table-column>
      <el-table-column prop="authorName" label="评论人" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="updateDate" label="时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="isAuth('ifo:commList:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-loading="loadingList" class="chartBox" v-show="showType=='chart'">
      <el-card :body-style="{ padding: '0px' }" v-for="val in articleList" :key="val.id">
        <div class="body" style="padding: 14px 14px 10px 14px;">
          <p>{{val.title}}</p>
          <i v-if="val.imageUrl" :style="{'background-image': 'url(' + val.imageUrl + ')'}" class="image"></i>
          <i v-else :style="{'background-image': 'url(' + noImg + ')'}" class="image"></i>
        </div>

        <div class="bottom" style="padding: 0 14px 14px 14px;">
          <div class="clearfix">
            <time class="time">{{ val.updateDate }}</time>
            <p class="opera">
              <i v-if="isAuth('ifo:infoEdit:upd')" class="el-icon-edit"></i>
              <i v-if="isAuth('ifo:infoEdit:delete')" class="el-icon-delete"></i>
            </p>
          </div>
        </div>
      </el-card>

    </div>
    <div class="pagination">
      <el-pagination :page-size="showCount" :total="totalResult" :current-page="currentPage" @current-change="handleCurrentChange" layout="total,prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingList: false,
      showType: "list", // 视图标识
      noImg: require("../../../assets/img/noImg.png"), // 默认图片
      id:"",
      title: "",
      name: "",
      currentPage: 1, // 当前页，分页
      totalResult: 0, // 总条数，分页
      showCount: 10, // 每页条数
      articleList: [], // 资讯列表
      multipleSelection: [], // 选择列表
      del_list: []
    };
  },
  created() {
    this.id = this.$route.params.id;
    console.log(this.id);
  },
  mounted() {
    // this.getData()
    
    this.articleList = [
      {
        id: "222",
        title:
          "示范性高中庆祝高考圆满示范性高中庆祝高考圆满示范性高中庆祝高考圆满示范性高中庆祝高考圆满示范性高中庆祝高考圆满示范性高中庆祝高考圆满示范性高中庆祝高考圆满",
        authorName: "千月君",
        updateDate: "2018-07-09",
        type: "1"
      }
    ];
  },
  computed: {},
  methods: {
    // 切换视图
    toType(val) {
      this.showType = val;
    },
    // 新建资讯跳转相应编辑页面
    handleCommand(command) {
      this.$router.push("/" + command);
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 格式化类型type中文名
    formatterType(row, column, cellValue) {
      var str = "";
      if (cellValue === "1") {
        str = "图文资讯";
      } else if (cellValue === "2") {
        str = "视频资讯";
      } else if (cellValue === "3") {
        str = "投票资讯";
      }
      return str;
    },
    // 获取列表数据
    getData() {
      const that = this;
      that.loadingList = true;
      const param = {
        userId: "1",
        title: that.title,
        type: that.type,
        status: "0",
        currentPage: that.currentPage,
        showCount: that.showCount
      };
      /* that.$axios
        .post(
          "/infoArticle/cms/article/getNotPublishList",
          param,
          that.getConfigCom()
        )
        .then(response => {
          const data = response.data;
          if (data.errorCode === "0000") {
            // 交易成功
            that.articleList = data.responseJson.articleList;
            that.totalResult = data.responseJson.totalResult;
          } else {
            that.$message.error(data.errorMessage);
          }
          that.loadingList = false;
        })
        .catch(error => {
          console.log(error);
          that.$message.error(this.POST_errMsg);
          that.loadingList = false;
        }); */
    },
    // 根据条件查询列表
    search() {
      this.currentPage = 1;
      this.getData();
    },
    handleEdit(index, row) {
      console.log(row);
    },
    handleDelete(index, row) {
      console.log(row);
    },
    delAll() {
      const self = this;
      const length = self.multipleSelection.length;
      let str = "";
      self.del_list = self.del_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += self.multipleSelection[i].id + " ";
      }
      self.$message.error("删除了" + str);
      self.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style scoped lang="scss">
.title{
  padding: 10px;
  p{padding: 10px 0}
  .label{
    font-weight: 600;
  }
}
</style>