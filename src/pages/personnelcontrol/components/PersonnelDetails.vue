<template>
	<div class="">
		<el-table :data="lists" stripe height="25rem" v-loading="loading">
			<el-table-column prop="staffname" label="姓名" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="deptname" label="所在班级"> </el-table-column>
			<el-table-column prop="lasttime" label="刷卡时间">
				<template slot-scope="scope">{{scope.row.lasttime?scope.row.lasttime:'--'}}</template>
			</el-table-column>
			<el-table-column prop="deviceName" label="地点"></el-table-column>
		</el-table>
		<page :pager="tableData" @pageChange="changePage"></page>
	</div>
</template>

<script>
	import page from './page.vue'
	export default {
		components: {
			page, //分页
		},
		data() {
			return {
				timer:'',
				lists: [],
				loading: false,
				tableData: {
					total: 0,
					pageSize: 10,
					currentPage: 1
				},
				userdetailTime: '',
				userdetailval: '',
				userdetailindex: '',
				userdetailtype: '',
			}
		},
		mounted() {
			var _this = this;
			this.bus.$off('userdetailData').$on('userdetailData', function(Time, val, index, type) {
				_this.userdetailTime = Time;
				_this.userdetailval = val;
				_this.userdetailindex = index;
				_this.userdetailtype = type;
				_this.tableData={
					total: 0,
					pageSize: 10,
					currentPage: 1
				};
				_this.getloseUserCountDetails();
			});
		},
		methods: {
			getloseUserCountDetails() {
				var _this = this;
				this.loading = true;
				this.timer=Date.now();
				((timer)=>{
					if(this.userdetailindex == 1) {
						var params = new FormData();
						params.append("lostType", this.userdetailTime)
						params.append('schoolYear', this.userdetailval)
						params.append('unitUuid', UNITID)
						params.append('currentPage', this.tableData.currentPage)
						params.append('pageSize', this.tableData.pageSize)
						this.$axios.post('/traffic/people/loseUserCountDetails/'+UNITID, params).then((res)=> {
							if(timer!=_this.timer)return;
							_this.tableData.total = res.total;
							_this.lists = res.rows;
							_this.$nextTick(function() {
								_this.loading = false;
							})
						});
					} else if(this.userdetailindex == 2) {
						var params = new FormData();
						params.append("lostType", this.userdetailTime)
						params.append('deptname', this.userdetailval)
						params.append('unitUuid', UNITID)
						params.append('currentPage', this.tableData.currentPage)
						params.append('pageSize', this.tableData.pageSize)
						this.$axios.post('/traffic/people/loseUserAnalyDeptDetails/'+UNITID, params).then(function(res) {
							if(timer!=_this.timer)return;
							_this.tableData.total = res.total;
							res.rows.forEach((item)=>{
								item.lasttime=item.lastusetime
							})
							_this.lists = res.rows;
							_this.$nextTick(function() {
								_this.loading = false;
							})
						});
					} else if(this.userdetailindex == 3) {
						var params = new FormData();
						params.append("topType", this.userdetailTime)
						params.append('deptname', this.userdetailval)
						params.append('unitUuid', UNITID)
						params.append('nightType', this.userdetailtype)
						params.append('currentPage', this.tableData.currentPage)
						params.append('pageSize', this.tableData.pageSize)
						this.$axios.post('/traffic/people/nightInOutTopNDetails/'+UNITID, params).then(function(res) {
							if(timer!=_this.timer)return;
							_this.tableData.total = res.total;
							res.rows.forEach((item)=>{
								item.lasttime=item.lastusetime
							})
							_this.lists = res.rows;
							_this.$nextTick(function() {
								_this.loading = false;
							})
						});
					}
				})(this.timer)

			},
			changePage(page) {
				this.tableData = $.extend(this.tableData, JSON.parse(page));
				this.getloseUserCountDetails();
			},
		}
	}
</script>

<style>

</style>
