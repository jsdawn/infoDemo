<template>
	<div class="table">
		<div class="handle-box">
			<el-button v-if="isAuth('ifo:infoEdit:delete')" type="danger" size="mini" icon="delete" class="handle-del" @click="delAll" v-show="showType=='list'">批量删除</el-button>
			<span class="box-icon">
        <el-tooltip content="卡片视图" placement="top">
          <i class="el-icon-menu" @click="toType('chart')"></i>
        </el-tooltip>
        <el-tooltip content="列表视图" placement="top">
          <i class="el-icon-tickets" @click="toType('list')"></i>
        </el-tooltip>
      </span>
			<div class="handle-right rt">
				<span class="item">
          <label>标题：</label>
          <el-input size="mini" v-model="title" placeholder="标题" class="handle-input"></el-input>
        </span>
				<span class="item">
          <label>类型：</label>
          <el-select size="mini" v-model="type" placeholder="类型" class="handle-select">
            <el-option key="" label="全部" value=""></el-option>
            <el-option key="1" label="图文资讯" value="1"></el-option>
            <el-option key="2" label="视频资讯" value="2"></el-option>
            <el-option key="3" label="投票资讯" value="3"></el-option>
          </el-select>
        </span>
				<el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
				<el-dropdown v-if="isAuth('ifo:infoEdit:add')" style="margin-left: 10px;" @command="handleCommand">
					<el-button size="mini" type="primary">
						新建资讯
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="ifo-infoEdit-tuwen">图文资讯</el-dropdown-item>
						<el-dropdown-item command="ifo-infoEdit-video">视频资讯</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<el-table v-loading="loadingList" v-show="showType=='list'" :data="articleList" size="small" header-cell-class-name="tableheader" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="title" label="标题" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="authorName" label="作者" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="updateDate" label="更新时间" width="200">
			</el-table-column>
			<el-table-column prop="type" label="类型" width="120" :formatter="formatterType">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button v-if="isAuth('ifo:infoEdit:upd')" type="text" size="small" @click="togoUpdInfo(scope.row)">编辑</el-button>
					<el-button v-if="isAuth('ifo:infoEdit:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
				title: "",
				type: "",
				currentPage: 1, // 当前页，分页
				totalResult: 0, // 总条数，分页
				showCount: 10, // 每页条数
				articleList: [{
					id: "23450",
					title: "年后大家的反馈",
					authorName: "千月君",
					updateDate: "2018-06-08",
					type: "1"
				}], // 资讯列表
				multipleSelection: [], // 选择列表
				del_list: []
			};
		},
		created() {},
		mounted() {
			// this.getData();
		},
		computed: {
			//获取打开的菜单标签
			mainTabs: {
				get() {
					return this.$store.state.common.mainTabs;
				},
				set(val) {
					this.$store.commit("common/updateMainTabs", val);
				}
			},
			tuwenId: {
				get() {
					return this.$store.state.info.tuwenId;
				},
				set(val) {
					this.$store.commit("info/updateTuwenId", val);
				}
			},
			videoId: {
				get() {
					return this.$store.state.info.videoId;
				},
				set(val) {
					this.$store.commit("info/updateVideoId", val);
				}
			}
		},
		methods: {
			// 切换视图
			toType(val) {
				this.showType = val;
			},
			// tabs, 删除tab
			removeTabHandle(tabName) {
				console.log(tabName);
				var newTabs = this.mainTabs.filter(item => item.name !== tabName);
				if(newTabs.length >= 1) {
					this.mainTabs = newTabs;
				} else {
					this.menuActiveName = "";
					this.$router.push({
						name: "home"
					});
				}
			},
			// 新建资讯跳转相应编辑页面
			handleCommand(command) {
				//先删除tab标签，再进入编辑，做到刷新作用
				if(command === "ifo-infoEdit-tuwen") {
					this.tuwenId = "";
				} else if(command === "ifo-infoEdit-video") {
					this.videoId = "";
				}
				this.removeTabHandle(command);
				this.$nextTick(() => {
					this.$router.push({
						name: command
					});
				});
			},
			togoUpdInfo(row) {
				//前往修改图文资讯
				let command = "";
				if(row.type === "1") {
					command = "ifo-infoEdit-tuwen";
				} else if(row.type === "2") {
					command = "ifo-infoEdit-video";
				}
				this.tuwenId = row.id;
				this.removeTabHandle(command);
				this.$nextTick(() => {
					this.$router.push({
						name: command
					});
				});
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData();
			},
			// 格式化类型type中文名
			formatterType(row, column, cellValue) {
				var str = "";
				if(cellValue === "1") {
					str = "图文资讯";
				} else if(cellValue === "2") {
					str = "视频资讯";
				} else if(cellValue === "3") {
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

				/* if (data.errorCode === "0000") {
				  // 交易成功
				  that.articleList = data.responseJson.articleList;
				  that.totalResult = data.responseJson.totalResult;
				} else {
				  that.$message.error(data.errorMessage);
				} */
				that.loadingList = false;
			},
			// 根据条件查询列表
			search() {
				this.currentPage = 1;
				this.getData();
			},
			handleDelete(index, row) {
				console.log(row);
			},
			delAll() {
				const self = this;
				const length = self.multipleSelection.length;
				let str = "";
				self.del_list = self.del_list.concat(self.multipleSelection);
				for(let i = 0; i < length; i++) {
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
<style scoped>

</style>