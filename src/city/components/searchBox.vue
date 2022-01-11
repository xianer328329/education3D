<template>
	<div class="Z-BseekB">
		<back-box class="Z-Bseek clearFix">
			<i class="el-icon-search fl"></i>
			<el-input class="fr search" placeholder="区域搜索" v-model="filterText" @focus="opentree"></el-input>
		</back-box>
		<el-tree class="filter-tree" :data="data" @node-click="NodeClick" :props="defaultProps" :filter-node-method="filterNode" ref="tree" v-show="tree"></el-tree>
	</div>

</template>

<script>
	/* eslint-disable */
	export default {
		name: 'searchBox',
		data() {
			return {
				tree: false,
				filterText: '',
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
		},
		mounted: function() {
			this.closetree();
			this.getlistCountryAreaInfo();
			this.$emit("BoxData", null);
		},
		methods: {
			NodeClick(row) {
				if(row.id != 2370 && row.id != 1) {
					this.$router.push({
						path: "/districtIndex",
					});
					//window.location.href = '/city.html#/districtIndex';
				} else if(row.id == 2370) {
					this.$router.push({
						path: "/citylevel",
					});
					//window.location.href = '/city.html#/citylevel';
				};
				this.$emit("BoxData", row);
				//this.city.$emit('fun', row);
			},
			getlistCountryAreaInfo() {
				var zx = this;
				this.$axios.post('/highclouds/cloud/listCountryAreaInfo', {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res|| [];
						data.forEach((value) => {
							value.label = value.countyName;
							value.id = value.countyId;
							value.pageFlag = "1";
							value.children = value.province;
							value.province.forEach((item) => {
								item.label = item.provinceName;
								item.id = item.provinceId;
								item.pageFlag = "1";
								item.children = item.city;
								item.city.forEach((resp) => {
									resp.pageFlag = "2";
									resp.label = resp.cityName;
									resp.id = resp.cityId;
								});
							});
						});
						zx.data = res;
						if(window.location.hash == "#/districtIndex") {
							var arr = [];
							zx.data.forEach((item) => {
								arr.push(item.children[0]);
							});
							zx.data = arr;
						}
					});
			},
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			opentree() {
				this.tree = true;
			},
			closetree() {
				var _this = this;
				$(".Z-BseekB").mouseleave(function() {
					_this.tree = false;
					$('.search input').blur()
				})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.Z-BseekB {
		margin-top: 20px;
		float: right;
		position: absolute;
		z-index: 9990;
		right: 27px;
		top: 0px;
		/*z-index: 9990;*/
	}
	
	.Z-Bseek {
		width: 306px;
		height: 40px;
	}
	
	.Z-Bseek i {
		width: 40px;
		height: 40px;
		color: #cccfd2;
		font-size: 28px;
		padding-top: 7px;
		box-sizing: border-box;
		margin-left: 10px;
	}
	
	.Z-Bseek .search {
		width: 83%;
	}
	
	.Z-BseekB .filter-tree {
		margin-top: 6px;
		z-index: 9999999999 !important;
		background: #002037;
		border: 1px solid rgba(49, 133, 156, 0.5)
	}
</style>
<style>
	.Z-Bseek .search .el-input__inner {
		background: none;
		border: none;
		color: #cccfd2;
		font-size: 18px;
	}
	
	.Z-BseekB .filter-tree {
		height: 394px;
	}
	
	.Z-BseekB .filter-tree .el-tree-node__label {
		font-size: 18px;
		color: #cccfd2;
	}
	
	.Z-BseekB .filter-tree .el-tree-node__content:hover {
		background: #052D48;
	}
	
	.Z-BseekB .filter-tree .el-tree-node__label:hover {
		color: #75CBF2;
	}
	
	.Z-BseekB .el-tree-node__expand-icon {
		font-size: 18px;
	}
	
	.Z-BseekB .el-tree-node:focus>.el-tree-node__content {
		background: #052D48;
		color: #75CBF2;
	}
</style>