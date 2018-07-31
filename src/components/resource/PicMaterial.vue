<template>
  <div class="picMaterial">
    <el-upload class="upload-demo" name="file1" ref="upload" multiple :limit="5" :disabled="showfile" :action="imageUpApi" :data="imageUpParam" :headers="upHeaders" :show-file-list="showfile" :on-exceed="exLimit" :before-upload='beforeUpload' :on-success='upScuccess' :on-error='upError'>
      <el-button size="mini" type="primary" :loading="showfile">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传gif/jpg/png/jpeg文件，且不超过5M</div>
    </el-upload>
    <div class="grid-wrap" v-loading="loadingPicList">
      <p class="no-data" v-if="picList.length==0">暂无数据</p>
      <div class="item" v-for="val in picList" :key="val.id">
        <div class="pic" @click="clickPic(val.imageUrl)">
          <img v-lazy="val.imageUrl">
        </div>
      </div>
    </div>
    <p class="page" v-if="totalResult>0">
      <el-pagination layout="total,prev, pager, next,jumper" :page-size="showCount" :total="totalResult" :current-page="currentPage" @current-change="pageChange">
      </el-pagination>
    </p>

  </div>
</template>
<script>
import { getImageList } from "@/utils/api";
export default {
  data() {
    return {
      loadingPicList: false,
      num: 0, // 传图完成个数
      showfile: false, // 上传列表
      picList: [], // 图片列表
      dialogImg: false,
      dialogImgSrc: "",
      currentPage: 1, // 当前页，分页
      totalResult: 0, // 总条数，分页
      showCount: 12 // 每页条数
    };
  },
  computed: {
    // 上传头部
    upHeaders() {
      let token = this.$cookie.get("token");
      return { token: token };
    },
    imageUpApi: function() {
      return this.$http.adornUrl("/cms/image/imageUp");
    },
    imageUpParam: function() {
      const obj = {};
      return obj;
    }
  },
  created() {},
  mounted() {
    this.getPicList();
  },
  watch: {
    // 监听图片是否上传全部
    num(val, oldval) {
      if (oldval === 1 && val === 0) {
        const that = this;
        setTimeout(function() {
          that.showfile = false;
          that.$refs.upload.clearFiles(); // 清空已上传的文件读条列表
          // 重新查询第一页图片
          that.currentPage = 1;
          that.getPicList();
        }, 1000);
      }
    }
  },
  methods: {
    clickPic(src) {
      this.$emit("click-pic", src);
    },
    // 图片分页
    pageChange(val) {
      this.currentPage = val; // 获取点击的页数
      this.getPicList();
    },
    // 获取图片列表
    async getPicList() {
      const that = this;
      that.loadingPicList = true;
      const param = {
        currentPage: this.currentPage,
        showCount: this.showCount
      };
      let res = await getImageList(param);
      if (res.code === 0) {
        // 交易成功
        that.picList = res.picList;
        that.totalResult = res.totalResult;
      } else {
        that.$message.error(res.msg);
      }
      that.loadingPicList = false;
    },
    // 图片超过上传个数
    exLimit(files, fileList) {
      this.$message.error("最多能同时上次5个文件");
      return false;
    },
    // 图片上传之前调取的函数
    beforeUpload(file) {
      // 验证文件的格式
      const filename = file.name;
      var re = /(.[.]gif)$|(.[.]jpg)$|(.[.]png)$|(.[.]jpeg)$/i;
      if (!re.test(filename)) {
        const errorinfo = "只支持gif,jpg,png,jpeg格式文件，请重新上传。";
        this.$notify.error({
          title: "错误",
          message: errorinfo + "( 错误：" + file.name + " )"
        });
        return false; // 停止上传
      } else if (file.size / 1024 > 5 * 1024) {
        // 验证文件的大小
        const errorinfo = "文件必须小于5M,图片太大 ";
        this.$notify.error({
          title: "错误",
          message: errorinfo + "( 错误：" + file.name + " )"
        });
        return false; // 停止上传
      }
      this.showfile = true;
      this.num++;
    },
    // 上传图片成功
    upScuccess(respon, file, fileList) {
      const that = this;
      this.num--;
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
    // 上传图片失败
    upError(err, file, fileList) {
      this.num--;
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
</style>