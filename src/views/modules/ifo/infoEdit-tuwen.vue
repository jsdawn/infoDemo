<template>
  <div>
    <div class="box">
      <div class="box-main">
        <p class="input-item">
          <el-input size="small" :maxlength='64' placeholder="标题（最多64字）" v-model="title"></el-input>
        </p>
        <p class="input-item">
          <el-input size="small" :maxlength='64' placeholder="作者（最多64字）" v-model="authorName"></el-input>
        </p>
        <quill-editor ref="infoQuillEditor" v-model="content" :options="editorOption"></quill-editor>
      </div>
    </div>
    <el-card class="box-side">
      <p style="color: #409EFF">
        封面↓
        <span v-show="imageUrl" class="rt" style="cursor: pointer;color: #E6A23C;" @click="imageUrl=''">清除</span>
      </p>
      <p style="font-size: 12px;color: gray;margin: 10px 0;">大图片建议尺寸：900像素*500像素 (点击更换封面)</p>
      <div class="avatar-uploader" @click="dialogCover = true">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" title="更换封面">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div class="btn-box">
        <el-upload class="upload-demo" ref="txtupload" :disabled="showfile" :action="attachmentApi" :data="attachmentParam" :headers="upHeaders" :before-upload='beforeUpload' :on-success='upScuccess' :on-error='upError' :on-remove="handleRemove" :file-list="fileList">
          <el-button size="small" type="primary" :loading="showfile">上传附件</el-button>
          <div slot="tip" class="el-upload__tip">上传附件不超过200M</div>
        </el-upload>
        <p style="margin-top: 30px;">
          <el-button size="small" type="warning" style="width: 80px;">预览</el-button>
        </p>
        <p>
          <el-button size="small" type="primary" style="width: 80px;" :loading="showfile||saveing" @click="save">保存</el-button>
        </p>

      </div>
    </el-card>
    <!--编辑器的-->
    <el-dialog title="图片素材" custom-class="pic-dialog" :visible.sync="dialogVisible" width="650px">
      <pic-material @click-pic="getUrl"></pic-material>
    </el-dialog>
    <!--封面的-->
    <el-dialog title="图片素材" custom-class="pic-dialog" :visible.sync="dialogCover" width="650px">
      <pic-material @click-pic="getImageUrl"></pic-material>
    </el-dialog>
  </div>

</template>

<script>
import { quillEditor } from "vue-quill-editor";
import picMaterial from "@/components/resource/PicMaterial.vue";
export default {
  data() {
    return {
      // 附件上传
      showfile: false, // 正在上传，是否显示上传列表
      fileList: [], // 上传附件列表
      // 内容编辑
      saveing: false,
      dialogVisible: false, // 编辑器选择图片素材对话框
      dialogCover: false, // 封面选择图片素材对话框
      title: "", // 标题
      authorName: "", // 作者
      content: "", // 内容
      imageUrl: "", // 封面路径
      // 配置编辑器
      addRange: "", // 编辑器光标
      editorOption: {
        placeholder: "输入内容...",
        modules: {
          toolbar: [
            ["bold"],
            ["blockquote"],
            [
              {
                header: 2
              }
            ],
            [
              {
                list: "ordered"
              },
              {
                list: "bullet"
              }
            ],
            [
              {
                size: ["small", false, "large"]
              }
            ],
            [
              {
                color: []
              },
              {
                background: []
              }
            ],
            [
              {
                align: []
              }
            ],
            ["clean"],
            ["link", "image"]
          ],
          history: {
            delay: 1000,
            maxStack: 500,
            userOnly: true
          }
        }
      }
    };
  },
  computed: {
    upHeaders() {
      let token = this.$cookie.get("token");
      return { token: token };
    },
    attachmentApi: function() {
      return this.$http.adornUrl("/cms/attachment/attachmentUp");
    },
    attachmentParam: function() {
      const obj = {};
      return obj;
    },
    tuwenId: {
      get() {
        return this.$store.state.info.tuwenId;
      },
      set(val) {
        this.$store.commit("info/updateTuwenId", val);
      }
    }
  },
  components: {
    quillEditor,
    "pic-material": picMaterial
  },
  created() {
    let id = this.tuwenId;
    console.log(id);
  },
  // 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$nextTick(() => {
      this.$refs.infoQuillEditor.quill
        .getModule("toolbar")
        .addHandler("image", this.imgHandler);
    });

    // 初始化编辑器中文提示
    //			this.initEditorTip();
  },
  methods: {
    Trim(x) {
      return x.replace(/^\s+|\s+$/gm, "");
    },
    // 将选择图片的URL地址插入到编辑器文本中
    imgHandler(state) {
      // 点击图片ICON触发事件
      this.addRange = this.$refs.infoQuillEditor.quill.getSelection();
      this.dialogVisible = true;
    },
    getUrl(url) {
      // 得到路径
      this.insertImg(url);
    },
    insertImg(url) {
      let vm = this;
      if (url !== null && url.length > 0) {
        let value = url;
        // vm.addRange = vm.$refs.infoQuillEditor.quill.getSelection(); //获取光标位置
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.$refs.infoQuillEditor.quill.insertEmbed(
          vm.addRange !== null ? vm.addRange.index : 0,
          "image",
          value
        ); // 调用编辑器的 insertEmbed 方法，插入URL ,Quill.sources.USER
        vm.$refs.infoQuillEditor.quill.setSelection(vm.addRange.index + 1);
      } else {
        this.$message.error("图片插入失败,请重试");
      }
      this.dialogVisible = false;
    },
    // 上传封面
    getImageUrl(url) {
      let vm = this;
      if (url !== null && url.length > 0) {
        // 将选择图片的URL放入封面
        let value = url;
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.imageUrl = value;
      } else {
        this.$message.error("图片插入失败,请重试");
      }
      this.dialogCover = false;
    },
    //* ***********上传附件处理方法
    // 附件上传之前调取的函数
    beforeUpload(file) {
      // 验证文件的格式
      if (file.size / 1024 > 200 * 1024) {
        // 验证文件的大小
        const errorinfo = "文件必须小于200M,图片太大 ";
        this.$notify.error({
          title: "错误",
          message: errorinfo + "( 错误：" + file.name + " )"
        });
        return false; // 停止上传
      }
      this.showfile = true;
    },
    // 上传附件成功
    upScuccess(respon, file, fileList) {
      this.$refs.txtupload.clearFiles(); // 清空已上传的文件读条列表
      this.showfile = false;
      if (respon.code === 0) {
        const fileObj = respon.attachmentInfoList[0];
        this.fileList = [
          {
            name: fileObj.fileName,
            url: fileObj.attachmentPath
          }
        ]; // 显示现在上传的文件
      } else if (respon.code === 401) {
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
      } else {
        this.fileList = [];
        this.$message.error(respon.msg);
      }
    },
    // 上传附件失败
    upError(err, file, fileList) {
      console.log(err);
      this.showfile = false;
      this.$notify.error({
        title: "上传失败",
        message: file.name + " 文件上传失败"
      });
    },
    // 移除附件
    handleRemove(file, fileList) {
      this.$refs.txtupload.clearFiles(); // 清空已上传的文件读条列表
      this.fileList = [];
    },
    // 保存资讯
    save() {
      const that = this;
      // 验证数据
      if (that.Trim(that.title).length === 0) {
        this.$message.error("标题不能为空");
        return false;
      } else if (that.Trim(that.authorName).length === 0) {
        this.$message.error("作者不能为空");
        return false;
      } else if (that.Trim(that.content).length === 0) {
        this.$message.error("内容不能为空");
        return false;
      }

      that.saveing = true;
      var attachmentName = "";
      var attachmentPath = "";
      if (that.fileList.length > 0) {
        attachmentName = that.fileList[0].name;
        attachmentPath = that.fileList[0].url;
      }
      const param = {
        userId: 1,
        id: "1",
        title: that.Trim(that.title),
        authorName: that.Trim(that.authorName),
        imageUrl: that.imageUrl,
        content: that.content,
        attachmentName: attachmentName,
        attachmentPath: attachmentPath
      };
      /* that.$axios
        .post(
          "/infoArticle/cms/article/updateArticle",
          param,
          that.getConfigCom()
        )
        .then(response => {
          const data = response.data;
          if (data.errorCode === "0000") {
            // 交易成功
            console.log(data);
          } else {
            that.$message.error(data.errorMessage);
          }
          that.saveing = false;
        })
        .catch(error => {
          console.log(error);
          that.$message.error(this.POST_errMsg);
          that.saveing = false;
        }); */
    }
  }
};
</script>

<style>
.box {
  position: relative;
  margin-right: 240px;
}

.box-main {
}

.input-item {
  margin-bottom: 10px;
}

.ql-editor {
  max-height: 480px;
  max-height: 58vh;
  min-height: 400px;
}

.ql-editor img {
  max-height: 200px;
  display: block;
  text-align: center;
  margin: 10px auto;
}

.box-side {
  position: fixed;
  top: 90px;
  right: 0;
  bottom: 0;
  width: 230px;
}

.el-card__body {
  padding: 20px 30px;
}

.avatar-uploader {
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
  width: 100%;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 100%;
  min-height: 120px;
  max-height: 200px;
  display: block;
}

.btn-box {
  margin: 80px 0 20px 0;
}

.btn-box p {
  margin: 10px 0;
}
</style>