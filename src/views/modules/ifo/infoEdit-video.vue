<template>
  <div class="editorVideo">
    <div class="box-main" style="padding-left: 20px;margin-top: 40px;">
      <div class="video-select">
        <div class="no-video" v-show="!videoUrl">
          <img height="80px" src="../../../assets/img/vduploadicon.png" />
          <div class="text">
            <p class="tip">为了提高视频播放质量，建议上传720p（1280x720）或更高分辨率的视频</p>
            <el-button type="primary" size="small" @click="dialogVDCover=true">添加视频</el-button>
          </div>
        </div>
        <div class="has-video" v-show="videoUrl">
          <img src="../../../assets/img/imgokicon.png" />
          <div class="text">
            <p class="succ">视频添加成功</p>
            <div>
              <el-tooltip :content="videoName" placement="top">
                <p class="tip">{{videoName}}</p>
              </el-tooltip>
              <a class="readd" @click="dialogVDCover=true">重新添加</a>
            </div>

          </div>
        </div>

      </div>
      <el-form label-width="122px" label-position="left">
        <el-form-item label="标题">
          <el-input size="small" :maxlength='64' placeholder="标题（最多64字）"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input size="small" :maxlength='64' placeholder="作者（最多64字）"></el-input>
        </el-form-item>
        <el-form-item label="视频简介">
          <el-input type="textarea" :rows="5" :maxlength="10000" placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item label="视频封面">
          <div class="avatar-uploader" @click="dialogCover = true">
            <img v-if="videoCoverUrl" :src="videoCoverUrl" class="avatar" title="更换封面">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="pgc-operate-bar">设置视频封面</div>
          </div>
          <span v-if="videoCoverUrl" style="color: #E6A23C;position: absolute;bottom: 0;left: 180px;cursor: pointer;" @click="videoCoverUrl=''">清除</span>
        </el-form-item>
      </el-form>
      <div class="btngrop">
        <el-button type="primary" size="small">保存</el-button>
        <el-button type="info" plain size="small" @click="toBack">返回</el-button>
      </div>
    </div>

    <!--视频-->
    <el-dialog title="视频素材" custom-class="pic-dialog" :visible.sync="dialogVDCover" width="650px">
      <vd-material @click-pic="getVDUrl"></vd-material>
    </el-dialog>
    <!--封面-->
    <el-dialog title="图片素材" custom-class="pic-dialog" :visible.sync="dialogCover" width="650px">
      <pic-material @click-pic="getCoverUrl"></pic-material>
    </el-dialog>
  </div>
</template>

<script>
import vdMaterial from "@/components/resource/VDMaterial.vue";
import picMaterial from "@/components/resource/PicMaterial.vue";
export default {
  data() {
    return {
      dialogCover: false,
      dialogVDCover: false,
      videoName: "",
      videoUrl: "",
      videoCoverUrl: ""
    };
  },
  components: {
    "pic-material": picMaterial,
    "vd-material": vdMaterial
  },
  methods: {
    toBack() {
      this.toBackCom();
    },
    // 上传视频封面
    getVDUrl(param) {
      var url = param[1];
      let vm = this;
      if (url != null && url.length > 0) {
        // 将选择视频的URL放入
        let value = url;
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.videoUrl = value;
        // 显示视频名称
        vm.videoName = param[0];
      } else {
        this.$message.error("视频添加失败,请重试");
      }
      this.dialogVDCover = false;
    },
    // 上传封面
    getCoverUrl(url) {
      let vm = this;
      if (url != null && url.length > 0) {
        // 将选择图片的URL放入封面
        let value = url;
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.videoCoverUrl = value;
      } else {
        this.$message.error("图片插入失败,请重试");
      }
      this.dialogCover = false;
    }
  }
};
</script>

<style scoped="scoped">
.editorVideo {
  width: 894px;
  margin: 0 auto;
}

.el-input {
  display: inline-block;
  width: 750px;
}

.el-textarea {
  display: inline-block;
  width: 750px;
}

.avatar-uploader {
  width: 160px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 120px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 160px;
  height: 120px;
  display: block;
}

.pgc-operate-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 26px;
  line-height: 26px;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.6);
  display: inline-block;
  color: #ffffff;
  text-align: center;
}

.video-select {
  border-top: 1px solid #d2d2d2;
  border-bottom: 2px dotted #d2d2d2;
  margin-bottom: 20px;
  padding: 20px 120px;
  overflow: hidden;
  height: 122px;
  box-sizing: border-box;
}

.video-select .no-video > img {
  float: left;
}

.video-select .has-video > img {
  float: left;
  margin-left: 50px;
  margin-top: 15px;
}

.video-select .no-video .text {
  padding-top: 10px;
  color: #909399;
  font-size: 14px;
}

.video-select .has-video .text {
  margin-left: 120px;
  padding-top: 15px;
}

.video-select .has-video .succ {
  margin-bottom: 10px;
}

.video-select .has-video .tip {
  display: inline-block;
  vertical-align: middle;
  max-width: 350px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #999;
  font-size: 14px;
}

.video-select .has-video .readd {
  font-size: 14px;
  color: #409eff;
  margin-left: 15px;
  cursor: pointer;
}

.video-select .no-video .text p {
  padding-bottom: 10px;
}

.btngrop {
  text-align: center;
  padding-top: 10px;
}

.btngrop .el-button {
  width: 120px;
  margin: 0 10px;
}
</style>