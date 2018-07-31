<template>
  <div class="picMaterial">
    <el-upload class="upload-demo" name="video1" ref="VDupload" :disabled="VDshowfile" :action="videoUpApi" :data="videoUpParam" :headers="upHeaders" :show-file-list="VDshowfile" :before-upload='VDbeforeUpload' :on-success='VDupScuccess' :on-error='VDupError'>
      <el-button size="mini" type="primary" :loading="VDshowfile">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传mp4视频文件，且不超过200M</div>
    </el-upload>
    <div class="grid-wrap" v-loading="loadingVDList">
      <p class="no-data" v-if="videoList.length==0">暂无数据</p>
      <div class="item" v-for="val in videoList" :key="val.id">
        <div class="pic" @click="clickPic(val.videoName,val.videoUrl)">
          <img :src="val.videoCoverUrl">
          <div class="bgplay"></div>
          <div class="tool-title">
            <p>{{val.videoName}}</p>
          </div>
        </div>
      </div>
    </div>
    <p class="page" v-if="VDtotalResult>0">
      <el-pagination layout="total,prev, pager, next,jumper" :page-size="showCount" :total="VDtotalResult" :current-page="VDcurrentPage" @current-change="VDpageChange">
      </el-pagination>
    </p>

  </div>
</template>
<script>
import { videoList } from "@/utils/api";
export default {
  data() {
    return {
      loadingVDList: false,
      VDnum: 0,
      VDshowfile: false, // 上传列表
      videoList: [], // 视频列表
      dialogVD: false,
      VDcurrentPage: 1, // 当前页，分页
      VDtotalResult: 0, // 总条数，分页
      showCount: 12, // 每页条数
      loadingVideo: false,
      VDstr: ""
    };
  },
  computed: {
    // 上传头部
    upHeaders() {
      let token = this.$cookie.get("token");
      return { token: token };
    },
    videoUpApi: function() {
      return this.$http.adornUrl("/cms/video/videoUp");
    },
    videoUpParam: function() {
      const obj = {};
      return obj;
    }
  },
  created() {},
  mounted() {
    this.getVideoList();
  },
  watch: {
    // 监听视频是否上传全部
    VDnum(val, oldval) {
      if (oldval === 1 && val === 0) {
        const that = this;
        setTimeout(function() {
          that.VDshowfile = false;
          that.$refs.VDupload.clearFiles(); // 清空已上传的文件读条列表
          // 重新查询第一页视频
          that.VDcurrentPage = 1;
          that.getVideoList();
        }, 1000);
      }
    }
  },
  methods: {
    clickPic(name, src) {
      this.$emit("click-pic", [name, src]);
    },
    exLimit(files, fileList) {
      this.$message.error("最多能同时上次5个文件");
      return false;
    },
    // 视频分页
    VDpageChange(val) {
      this.VDcurrentPage = val; // 获取点击的页数
      this.getVideoList();
    },
    // 获取视频列表
    async getVideoList() {
      const that = this;
      that.loadingVDList = true;
      const paramVD = {
        currentPage: this.VDcurrentPage,
        showCount: this.showCount
      };
      let res = await videoList(paramVD);
      if (res.code === 0) {
        // 交易成功
        that.videoList = res.videoList;
        that.VDtotalResult = res.totalResult;
      } else {
        that.$message.error(res.msg);
      }
      that.loadingVDList = false;
    },
    // 视频上传前处理
    VDbeforeUpload(file) {
      // 验证文件的格式
      const filename = file.name;
      var re = /(.[.]mp4)$/i;
      if (!re.test(filename)) {
        const errorinfo = "只支持mp4格式文件，请重新上传"; // avi,mov,mpeg,mpg,
        this.$notify.error({
          title: "错误",
          message: errorinfo + "( 错误：" + file.name + " )"
        });
        return false; // 停止上传
      } else if (file.size / 1024 > 1024 * 1024) {
        // 验证文件的大小
        const errorinfo =
          "视频必须小于200M,该视频大小为 " +
          parseFloat((file.size / 1024 / 1024).toFixed(2)) +
          "M ";
        this.$notify.error({
          title: "错误",
          message: errorinfo + "( 错误：" + file.name + " )"
        });
        return false; // 停止上传
      }
      this.VDshowfile = true;
      this.VDnum++;
    },
    // 视频上传成功
    VDupScuccess(respon, file, fileList) {
      const that = this;
      this.VDnum--;
      if (respon.code === 401) {
        // 401, token失效
        this.$notify.error({
          title: "token失效",
          message: "token失效，请重新登录"
        });
        setTimeout(function() {
          Vue.cookie.delete("token");
          that.$router.push({ name: "login" }, () => {
            location.reload(); // 刷新页面, 清空整站临时存储数据
          });
        }, 1000);
        return;
      } else if (respon.code !== 0) {
        this.$notify.error({
          title: "上传失败",
          message: respon.msg
        });
      }
    },
    // 视频上传失败
    VDupError(err, file, fileList) {
      this.VDnum--;
      console.log(err);
      this.$notify.error({
        title: "上传失败",
        message: file.name + " 文件上传失败"
      });
    }
  }
};
</script>

<style scoped="scoped">
.picMaterial {
  position: relative;
}

.upload-demo {
  position: relative;
  margin-bottom: 15px;
}

.grid-wrap {
  margin-top: 10px;
  height: 399px;
  overflow: hidden;
}

.grid-wrap .item {
  display: inline-block;
  text-align: center;
  position: relative;
  height: 120px;
  width: 140px;
  margin: 0 11px 5px 0;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.grid-wrap .item:hover {
  border: 1px solid #409eff;
}

.grid-wrap .item:nth-child(4n) {
  margin-right: 0;
}

.grid-wrap .item .pic {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
}

.grid-wrap .item .pic img {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.el-upload__tip {
  float: right;
}

.page {
  text-align: right;
}

.grid-wrap .item .pic:hover .bgplay {
  display: block;
}

.grid-wrap .item .pic .bgplay {
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(../../assets/img/playicon.png);
  background-repeat: no-repeat;
  background-position: 46px 33px;
  cursor: pointer;
}

.grid-wrap .item .tool-title {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  font-size: 13px;
  line-height: 30px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.6);
}

.tool-title p {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>