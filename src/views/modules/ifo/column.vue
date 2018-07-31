<template>
  <div class="column">
    <div class="column-tree">
      <h4 class="title">栏目管理</h4>
      <el-tree :data="data" :props="defaultProps" node-key="id" :expand-on-click-node="false" @node-click="handleColumn"></el-tree>
    </div>
    <div class="column-main">

      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane v-if="isAuth('ifo:column:upd')" label="修改栏目" name="upd"></el-tab-pane>
        <el-tab-pane v-if="isAuth('ifo:column:add')" label="新增栏目" name="add"></el-tab-pane>
      </el-tabs>

      <el-form class="column-form" ref="columnForm" :model="columnForm" label-width="80px">
        <el-form-item label="上级栏目" prop="parentName">
          <el-popover ref="columnListPopover" placement="bottom-start" trigger="click">
            <el-tree :data="data" :props="defaultProps" node-key="id" :expand-on-click-node="false" @node-click="selectColumn"></el-tree>
          </el-popover>
          <el-input v-model="columnForm.parentName" v-popover:columnListPopover :readonly="true" placeholder="点击选择"></el-input>
        </el-form-item>
        <el-form-item label="栏目名称" prop="name">
          <el-input class="name" v-model="columnForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input class="textarea" type="textarea" v-model="columnForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="num">
          <el-input type="number" v-model="columnForm.num"></el-input>
          <span class="help-inline">栏目的排列顺序</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-radio-group v-model="columnForm.show">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
          <span class="help-inline">是否在导航中显示该栏目</span>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isAuth('ifo:column:add') || isAuth('ifo:column:upd')" type="primary" @click="save">保存</el-button>
          <el-button v-if="activeName==='upd'" type="warning" @click="del">删除</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
      columnForm: {
        parentId: "",
        parentName: "",
        name: "",
        desc: "",
        num: "",
        show: true
      },
      data: [
        {
          id: 1,
          name: "一级 1",
          children: [
            {
              id: 2,
              name: "二级 1-1二级 1-1二级 1-1",
              children: [
                {
                  id: 3,
                  name: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          id: 4,
          name: "一级 2"
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    if (this.isAuth("ifo:column:add")) {
      //如果有新增权限-默认选择新增
      this.activeName = "add";
    } else if (this.isAuth("ifo:column:upd")) {
      this.activeName = "upd";
    } else {
      this.activeName = "";
    }
  },
  computed: {},
  methods: {
    handleColumn(data) {
      console.log(data);
      this.columnForm.name = data.name
    },
    selectColumn(data) {
      this.columnForm.parentId = data.id;
      this.columnForm.parentName = data.name;
    },
    tabClick(tab, event) {},
    save() {
      console.log(this.columnForm);
    },
    del() {
      this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetForm() {
      console.log(this.$refs.columnForm);
      this.$refs.columnForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
$tree-width: 300px;
.column-tree {
  position: absolute;
  top: 0;
  left: 15px;
  bottom: 15px;
  width: $tree-width;
  border-right: 10px solid #f1f4f5;
  padding: 20px;
  .title {
    margin-bottom: 10px;
  }
}
.column-main {
  margin-left: $tree-width;
}
.help-inline {
  color: #aaaaaa;
  margin-left: 20px;
}
.column-form {
  margin-top: 15px;
  .el-form-item {
    .el-input {
      width: 250px;
    }
    .textarea {
      width: 350px;
    }
    .el-radio + .el-radio {
      margin-left: 20px;
    }
  }
}
</style>


