<template>
  <div class="material">
    <el-tabs>
      <el-tab-pane label="图片">
        <el-upload v-if="isAuth('ifo:resource:add')" class="upload-demo" name="file1" ref="upload" multiple :limit="5" :disabled="showfile" :action="imageUpApi" :headers="imageHeaders" :show-file-list="showfile" :on-exceed="exLimit" :before-upload='beforeUpload' :on-success='upScuccess' :on-error='upError'>
          <el-button size="small" type="primary" :loading="showfile">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传gif/jpg/png/jpeg文件，且不超过5M</div>
        </el-upload>

        <div class="grid-wrap" v-loading="loadingPicList">
          <p class="no-data" v-show="picList.length===0">暂无数据</p>
          <div class="item" v-for="val in picList" :key="val.id">
            <div class="pic" @click="bigImg(val.imageUrl)">
              <img v-lazy="val.imageUrl" title="点击预览大图">
            </div>
            <div class="tool-icon">
              <i v-if="isAuth('ifo:resource:delete')" class="el-icon-delete" @click="delImg(val.id)"></i>
            </div>
          </div>
        </div>
        <div style="margin-top: 5px;text-align: right;" v-if="totalResult>0">
          <el-pagination background layout="prev, pager, next, jumper" :page-size="showCount" :total="totalResult" :current-page="currentPage" @current-change="pageChange">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="视频">
        <el-upload v-if="isAuth('ifo:resource:add')" class="upload-demo" name="video1" ref="VDupload" :disabled="VDshowfile" :action="videoUpApi" :headers="videoHeaders" :data="videoUpParam" :show-file-list="VDshowfile" :before-upload='VDbeforeUpload' :on-success='VDupScuccess' :on-error='VDupError'>
          <el-button size="small" type="primary" :loading="VDshowfile">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp4视频文件，且不超过200M</div>
        </el-upload>
        <div class="grid-wrap" v-loading="loadingVDList">
          <p class="no-data" v-show="videoList.length===0">暂无数据</p>
          <div class="item" v-for="val in videoList" :key="val.id">
            <div class="pic" @click="bigVD(val.videoCoverUrl,val.videoUrl)">
              <img :src="val.videoCoverUrl">
              <div class="bgplay"></div>
            </div>
            <div class="tool-title">
              <p>{{val.videoName}}</p>
            </div>
            <div class="tool-icon">
              <i v-if="isAuth('ifo:resource:upd')" @click="VDnameUpd(val.id,val.videoName)" style="margin-right: 18px;" class="el-icon-edit"></i>
              <i v-if="isAuth('ifo:resource:delete')" @click="delVideo(val.id)" class="el-icon-delete"></i>
            </div>
          </div>
        </div>
        <div style="margin-top: 5px;text-align: right;" v-if="VDtotalResult>0">
          <el-pagination background layout="prev, pager, next, jumper" :page-size="showCount" :total="VDtotalResult" :current-page="VDcurrentPage" @current-change="VDpageChange">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--对话框-->
    <el-dialog title="查看图片" custom-class="dialog-img-box" :visible.sync="dialogImg">
      <div class="dialog-img">
        <img :src="dialogImgSrc" />
      </div>
    </el-dialog>
    <el-dialog title="播放视频" custom-class="dialog-img-box" :visible.sync="dialogVD" :before-close="beforeClose">
      <div class="dialog-img" v-html="VDstr" id="videoBox"></div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getImageList,
  imageRemove,
  videoList,
  videoRemove,
  videoUpdate
} from "@/utils/api";
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
      showCount: 12, // 每页条数

      loadingVDList: false,
      VDnum: 0,
      VDshowfile: false, // 上传列表
      videoList: [], // 视频列表
      dialogVD: false,
      VDcurrentPage: 1, // 当前页，分页
      VDtotalResult: 0, // 总条数，分页
      loadingVideo: false,
      VDstr: ""
    };
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id;
      }
    },
    imageHeaders() {
      let token = this.$cookie.get("token");
      return { token: token };
    },
    imageUpApi() {
      return this.$http.adornUrl("/cms/image/imageUp");
    },
    imageUpParam() {
      const obj = {};
      return obj;
    },
    videoHeaders() {
      let token = this.$cookie.get("token");
      return { token: token };
    },
    videoUpApi() {
      return this.$http.adornUrl("/cms/video/videoUp");
    },
    videoUpParam() {
      const obj = {};
      return obj;
    }
  },
  created() {},
  mounted() {
    this.getPicList();
    this.getVideoList();
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
    },
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
    },
    // 监听视频播放是否改变
    VDstr(val, oldval) {
      const that = this;
      setTimeout(function() {
        const video = document.getElementById("video");

        var load = (video.onloadstart = that.$loading({
          target: "#videoBox",
          text: "视频加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        }));
        video.oncanplaythrough = that.$nextTick(() => {
          load.close();
        });
      }, 200);
    }
  },
  methods: {
    // 图片分页
    pageChange(val) {
      this.currentPage = val; // 获取点击的页数
      this.getPicList();
    },
    // 删除图片
    delImg(id) {
      const that = this;
      that
        .$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          //确认删除
          const paramdel = {
            id: id
          };
          //删除图片
          let res = await imageRemove(paramdel);
          if (res.code === 0) {
            that.picList = that.picList.filter(o => o.id !== id);
            that.totalResult--;
            if (that.picList.length === 0) {
              that.currentPage = 1;
              that.getPicList();
            }
            that.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(() => {
          //取消删除
        });
    },
    // 获取图片列表
    async getPicList() {
      const that = this;
      that.loadingPicList = true;
      let param = {
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
    // 查看大图
    bigImg(picSrc) {
      this.dialogImg = true;
      this.dialogImgSrc = picSrc;
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
    },

    /** *****视频*******/
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
      console.log(res);
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
    // 播放视频
    bigVD(VDCoverUrl, VDSrc) {
      this.dialogVD = true;
      this.loadingVideo = true;
      this.VDstr =
        '<video id="video" height="350" controls autoplay poster="' +
        VDCoverUrl +
        '" style="max-width: 100%;max-height: 100%;">' +
        '<source src="' +
        VDSrc +
        '" type="video/mp4"> 您的浏览器不支持 video 标签,请升级最新版本或更换浏览器。</video>';
    },
    // 关闭视频播放
    beforeClose(done) {
      const video = document.getElementById("video");
      video.pause();
      done();
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
    },
    // 修改视频名称
    VDnameUpd(id, name) {
      const that = this;
      this.$prompt(name, "修改视频名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "输入修改的名称",
        inputPattern: /^[\S][\s\S]{0,19}$/,
        inputErrorMessage: "名称1~20个字符，开头不允许为空格"
      })
        .then(async ({ value }) => {
          const paramupdname = {
            id: id,
            name: value
          };
          let res = await videoUpdate(paramupdname);
          console.log(res);
          if (res.code === 0) {
            // 交易成功
            that.getVideoList();
            that.$message({
              type: "success",
              message: "修改成功!"
            });
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    // 删除视频
    delVideo(id) {
      const that = this;
      that
        .$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const paramdel = {
            id: id
          };
          let res = await videoRemove(paramdel);
          if (res.code === 0) {
            that.videoList = that.videoList.filter(o => o.id !== id);
            that.VDtotalResult--;
            if (that.videoList.length === 0) {
              that.VDcurrentPage = 1;
              that.getVideoList();
            }
            // 交易成功
            that.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped="scoped">
.upload-demo {
  position: relative;
  margin-bottom: 15px;
}

.show-type {
  position: absolute;
  right: 40px;
  top: 20px;
}

.show-type i {
  font-size: 21px;
  padding: 4px;
  cursor: pointer;
}

.grid-wrap {
  margin-top: 10px;
  min-height: 40px;
}

.grid-wrap .item {
  display: inline-block;
  text-align: center;
  position: relative;
  height: 180px;
  width: 162px;
  margin: 0 19px 12px 0;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.grid-wrap .item .pic {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.grid-wrap .item .pic:hover .bgplay {
  display: block;
}

.grid-wrap .item .pic img {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 30px;
  left: 0;
  right: 0;
}

.grid-wrap .item .pic .bgplay {
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(../../../assets/img/playicon.png);
  background-repeat: no-repeat;
  background-position: 56px 43px;
  cursor: pointer;
}

.grid-wrap .item .tool-title {
  text-align: center;
  position: absolute;
  bottom: 30px;
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

.grid-wrap .item .tool-icon {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #f4f5f6;
}

.grid-wrap .item .tool-icon i {
  cursor: pointer;
  padding: 0 5px;
}
/*列表*/

.grid-wrap .item-list {
  padding: 20px 0;
  line-height: 1;
  font-size: 14px;
  color: #777;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 100;
}

.grid-wrap .item-list .item-list-wrap {
  display: inline-block;
  width: 100%;
  margin-bottom: 0;
  position: relative;
}

.grid-wrap .item-list .item-list-wrap .image {
  position: relative;
  float: left;
  width: 124px;
  height: 80px;
  overflow: hidden;
}

.grid-wrap .item-list .item-list-wrap .image .bgplay {
  display: none;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url(../../../assets/img/playicon.png);
  background-repeat: no-repeat;
  background-position: 36px 16px;
  cursor: pointer;
}

.grid-wrap .item-list .item-list-wrap .image:hover .bgplay {
  display: block;
}

.grid-wrap .item-list .item-list-wrap .image img {
  width: 100%;
  min-height: 100%;
  -webkit-transition: all 0.5s ease-out 0.1s;
  -moz-transition: all 0.5s ease-out 0.1s;
  transition: all 0.5s ease-out 0.1s;
}

.grid-wrap .item-list .item-list-wrap .bone {
  margin: 0 0 20px 150px;
}

.bone .title-bone {
  margin-top: -6px;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.8;
  font-weight: 700;
  display: block;
  color: #333333;
}

.bone .abstract-bone {
  line-height: 2;
}

.bone .operate-bone {
  line-height: 2;
  position: absolute;
  bottom: -8px;
}

.bone .operate-bone span {
  padding: 5px;
  margin-right: 5px;
  cursor: pointer;
}

.el-dialog .dialog-img {
  width: 100%;
  text-align: center;
}

.el-dialog .dialog-img img {
  max-width: 100%;
}
</style>