<template>
	<el-form label-width="100px" :model="tableData" ref="form">
		<el-form-item label="布控车辆" class="is-required" prop="plates">
			<el-input v-model="tableData.carPlates"></el-input>
			<!--<el-input v-model="tableData.plates" @blur="blurCarCard" @keyup.native.enter="addCarCard" ref="car" placeholder="例:渝123456">
	     	<el-button slot="append" icon="el-icon-plus" @click="addCarCard"></el-button>
	     </el-input>
	     <a v-for="(item,index) in cars" class="plates">
	     	<span>{{item}}</span>
	     	<el-button  icon="el-icon-close" @click="cars.splice(index,1)"></el-button>
	     </a>-->
		</el-form-item>
		<el-form-item label="布控描述" class="is-required h-textarea-c" prop="controlDesc">
			<el-input type="textarea" maxlength="100" :autosize="{ minRows: 3,maxRows: 3}" v-model="tableData.controlDesc">
			</el-input>
			<span class="append">{{tableData.controlDesc.length}}/100</span>
		</el-form-item>
		<el-form-item label="布控时长" class="is-required h-time-c1" prop="time">
			<el-select v-model="time" filterable allow-create default-first-option placeholder="请选择" :popper-append-to-body="false">
				<el-option v-for="item in times" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<label class="h-tip">最长不超过360天(单位:天)</label>
		</el-form-item>
		<el-form-item label="布控范围" class="is-required range">
			<div class="h-dropdown-c" @click.stop="dropdown">
				<el-button slot="append" icon="el-icon-arrow-down"></el-button>
			</div>
			<ul class="sel-scope">
				<li v-for="(item,index) in scopes">
					<span>{{item.label}}</span>
					<el-button icon="el-icon-close" @click="delScope(item,index)"></el-button>
				</li>
			</ul>
			<div v-show="show" class="range-c" @click.stop="">
				<div class="tree">
					<el-tree :data="areas" show-checkbox node-key="id" ref="tree" :default-expanded-keys="[areas.length>0?areas[0].id:0]" :default-checked-keys="[unitid]">
					</el-tree>
				</div>
				<div class="text-center">
					<el-button size="mini" @click="show=false">取消</el-button>
					<el-button size="mini" type="primary" @click="changeArea">确定</el-button>
				</div>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button @click="closeModal">取消</el-button>
			<el-button type="primary" @click="addControl" :loading="loading">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				unitid: UNITID,
				show: false, //显示布控范围下拉
				tableData: {
					plates: '',
					carPlates: '', //车牌
					controlDesc: '', //描述
					startTime: new Date(), //开始时间
					endTime: 0, //结束时间
					scopeUnit: 0, //布控范围
				},
				cars: [],
				scopes: [],
				time: 1, //布控时长
				times: [1, 7, 30, 90, 180, 360], //监控时长选项
				areas: [],
				loading:false
			}
		},
		mounted() {
			var vm = this;
			this.getScope();
			$('body').click(function(e) {
				if(vm.show) {
					vm.show = false
				}
			});
		},
		methods: {
			blurCarCard() {
				if(this.tableData.plates == '') {
					return;
				}
				this.cars.push(this.tableData.plates);
				this.tableData.plates = '';
			},
			//添加车牌
			addCarCard() {
				this.$refs.car.focus();
				if(this.tableData.plates == '') {
					return;
				}
				this.cars.push(this.tableData.plates);
				this.tableData.plates = '';
			},
			//添加布控
			addControl() {
				var vm = this;
				if(isNaN(vm.time * 1)||vm.time=='') {
					vm.$message.error('布控时长应为数字');
					return;
				}
				var sDate = new Date();
				sDate.setDate(sDate.getDate() + (vm.time * 1));
				vm.tableData.endTime = sDate;
				var scopes = [];
				this.scopes.forEach(function(value) {
					scopes.push(value.id)
				});
				vm.tableData.scopeUnit = scopes.join(',');
				//				vm.tableData.carPlates=this.cars.join(',');

				for(var i in vm.tableData) {
					if(vm.tableData[i] == '' && i != 'plates') {
						this.$message({
							message: '信息填写不完整',
							type: 'warning'
						});
						return;
					}
				}
				vm.loading=true;
//				vm.tableData.scopeUnit += ',' + UNITID;
				this.$axios.post('traffic/pass/initiateControl/' + UNITID, vm.tableData).then(function(res) {
					var data = res;
					if(data.code == 200) {
						vm.$message({
							message: '操作成功',
							type: 'success'
						});
						vm.resetForm();
					} else {
						vm.$message.error(data.mess);
					}
					vm.loading=false;
				})
			},
			//获取布控范围
			getScope() {
				var vm = this;
				this.$axios.post('traffic/pass/listAreaInfo').then(function(res) {
					var data = res,
						citys = [];
					//合并同一个区的
					data.forEach(function(value, index) {
						var obj = {
							id: value.cityUuid,
							label: value.cityName,
							provinceUuid: value.provinceUuid,
							provinceName: value.provinceName
						}
						var children = [];
						children.push({
							id: value.unitUuid,
							label: value.unitName,
						});
						for(var i = index + 1, length = data.length; i < length; i++) {
							if(value.cityUuid == data[i].cityUuid) {
								if(data[i].unitUuid == UNITID) { //禁用本单位
									children.push({
										id: data[i].unitUuid,
										label: data[i].unitName,
										disabled: true,
									});
								} else {
									children.push({
										id: data[i].unitUuid,
										label: data[i].unitName,
									});
								}
								data.splice(i, 1);
								length--;
								i--;
							}
						}
						obj.children = children;
						citys.push(obj);
					});
					//合并同一个省
					var provinces = [];
					citys.forEach(function(value, index) {
						var obj = {
							id: value.provinceUuid,
							label: value.provinceName,
						}
						var children = [];
						children.push(value);
						for(var i = index + 1, length = citys.length; i < length; i++) {
							if(value.provinceUuid == citys[i].provinceUuid) {
								children.push(citys[i]);
								citys.splice(i, 1);
								length--;
								i--;
							}
						}
						obj.children = children;
						provinces.push(obj);
					});
					vm.areas = provinces;

				})
			},
			changeArea() {
				this.show = false;
				var arr = this.$refs.tree.getCheckedNodes(true),
					scopes = [];
				arr.forEach(function(value) {
					scopes.push(value);
				});
				this.scopes = scopes;
			},
			//显示布控下拉菜单
			dropdown() {
				this.show = !this.show;
			},
			delScope(item, index) {
				this.scopes.splice(index, 1);
				this.$refs.tree.setChecked(item.id, false, true)
			},
			//重置表单数据
			resetForm() {
				var vm = this;
				this.$refs.form.resetFields();
				this.scopes = [];
				var nodes = vm.$refs.tree.getCheckedKeys();
				for(var i in nodes) {
					this.$refs.tree.setChecked(nodes[i], false, true);
				}
				this.closeModal();
				this.bus.$emit('getControl');
			},
			closeModal() {
				this.bus.$emit('closeModal');
			}
		}
	}
</script>

<style lang="stylus" scoped="scoped">	
	.el-form{
		padding-left:0px !important;
	}
	.h-tip {
		color: #31859C;
		font-size: 0.7rem;
	}
	
	.h-select {
		width: 100%;
	}
	
	.range {
		position: relative;
	}
	
	.tree {
		overflow: hidden;
	}
	
	.tree .el-tree {
		height: 13.5rem;
		overflow: auto;
		margin-bottom: 1.5rem;
		margin-right: -1.5rem;
	}
	
	.range-c {
		position: absolute;
		left: 0px;
		top: 2.5rem;
		right: 0px;
		background: #002037;
		border: 1px solid rgba(117, 203, 242, 1);
		border-radius: 2px;
		z-index: 1;
		padding: 0.75rem;
	}
	
	.el-tree {
		background: transparent;
	}
	
	.h-dropdown {
		padding: 0.5rem 0px 0.3rem 0px;
		background: #004E81;
		border: 1px solid #00FFFF;
	}
	
	.h-dropdown .el-dropdown-menu__item {
		padding: 0px 0.75rem;
		margin-bottom: 0.2rem;
	}
	
	.h-dropdown .el-dropdown-menu__item:focus,
	.el-dropdown-menu__item:not(.is-disabled):hover {
		background: transparent;
	}
	
	.h-dropdown-c {
		background: #00365C;
		border: none;
		color: #eeeeee;
		text-align: right;
		cursor: pointer;
	}
	
	.h-dropdown-c .el-button {
		border: none;
		outline: none;
		background-color: #004E81;
		color: #75CBF2;
		padding: 0.55rem;
		border-radius: 0px;
	}
	
	.plates {
		display: inline-block;
		position: relative;
		color: white;
		border: 1px solid #004E81;
		padding: 0px 1rem;
		margin-top: 0.75rem;
		border-radius: 5px;
		margin-right: 1rem;
		font-size: 0.7rem;
	}
	
	.plates span {
		font-size: 0.7rem;
	}
	
	.plates .el-button {
		border: none;
		outline: none;
		color: #fff;
		position: absolute;
		right: -0.7rem;
		top: -0.7rem;
		padding: 0.25rem 0.25rem;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
	}
	
	.h-textarea-c {
		position: relative;
	}
	
	.append {
		position: absolute;
		right: 0.4rem;
		bottom: -0.25rem;
		color: #75CBF2;
	}
	
	.sel-scope {
		margin-top: 13px;
		max-height: 200px;
		overflow: auto;
	}
	
	.sel-scope li {
		background: #00192B;
		font-size: 0.7rem;
		color: #75CBF2;
		padding: 0px 0.65rem;
		border-radius: 4px;
		position: relative;
		margin-bottom: 0.2rem;
	}
	
	.sel-scope li span {
		font-size: 0.75rem;
	}
	
	.sel-scope li .el-button {
		position: absolute;
		right: 0px;
		top: 0px;
		bottom: 0px;
		border: none;
		outline: none;
		background: #002C4B;
		color: #75CBF2;
		padding: 0.6rem 0.5rem;
	}
</style>
<style>
	.el-checkbox__input.is-disabled .el-checkbox__inner {
		border: 1px solid #75CBF2;
		background: transparent;
	}
	
	.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
		background: transparent;
	}
	
	.h-dropdown .popper__arrow::after {
		border-bottom-color: #004E81 !important;
	}
	
	.h-dropdown .popper__arrow {
		border-bottom-color: #00FFFF !important;
	}
	
	.h-time-c1 .el-select-dropdown {
		position: absolute !important;
		left: 0px !important;
		right: 0px !important;
		top: 2.1rem !important;
	}
</style>