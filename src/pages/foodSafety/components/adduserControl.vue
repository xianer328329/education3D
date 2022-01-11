<template>
	<el-form label-width="100px" :model="tableData" class="h-upload-form" ref="form">
		<el-form-item label="人员头像" class="is-required">
			<el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"  :before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-form-item>
		<el-form-item label="人员名称" class="is-required" prop="plates">
			<el-input v-model="tableData.controlName"></el-input>
		</el-form-item>
		<el-form-item label="布控描述" class="is-required h-textarea-c" prop="controlDesc">
			<el-input type="textarea" maxlength="100" :autosize="{ minRows: 3,maxRows: 3}" v-model="tableData.controlDesc">
			</el-input>
			<span class="append">{{tableData.controlDesc.length}}/100</span>
		</el-form-item>
		<el-form-item label="布控时长" class="is-required h-time-c1" prop="time">
			<el-select v-model="time" filterable allow-create default-first-option placeholder="请选择" :clearable="true" :popper-append-to-body="false">
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
					<el-tree :data="areas" show-checkbox node-key="id" ref="tree" :default-expanded-keys="[areas.length>0?areas[0].id:0]">
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
			<el-button type="primary" @click="addControl">确定</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				show: false, //显示布控范围下拉
				imageUrl: '',
				tableData: {
					plates: '',
					controlName: '', //车牌
					controlDesc: '', //描述
					startTime: new Date(), //开始时间
					endTime: 0, //结束时间
					scopeUnit: 0, //布控范围
				},
				files: '', //上传的图片文件
				cars: [],
				scopes: [],
				time: 1, //布控时长
				times: [1, 7, 30, 90, 180, 360], //监控时长选项
				areas: [],
			}
		},
		mounted() {
			var vm = this;
			this.getScope();
			this.bus.$off('claerimg').$on('claerimg', function() {
				vm.imageUrl = '';
			});
			$('body').click(function(e) {
				if(vm.show) {
					vm.show = false
				}
			});
		},
		methods: {
			beforeAvatarUpload(file) {
				var vm=this;
				const isJPG =['image/jpeg','image/jpg','image/png','image/gif'].indexOf(file.type);
				const isLt2M = file.size / 1024 / 1024 < 1;
				if(isJPG==-1) {
					this.$message.error('上传头像图片只能是 jpg,jpeg,png,gif格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 1MB!');
				}
				
//				var windowURL = window.URL || window.webkitURL;
//				this.imageUrl = windowURL.createObjectURL(file);
				
				var fileReader=new FileReader();
				fileReader.onload=function(e){
					vm.imageUrl =e.target.result;
				}
				fileReader.readAsDataURL(file);
				this.files = file;
				return false;
			},
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
				if(isNaN(vm.time * 1)) {
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

				for(var i in vm.tableData) {
					if(vm.tableData[i] == '' && i != 'plates') {
						this.$message({
							message: '信息填写不完整',
							type: 'warning'
						});
						return;
					}
				}
				vm.tableData.scopeUnit+=','+UNITID;
				var st = new Date(this.tableData.startTime);
				this.tableData.startTime = st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate() + ' ' + st.getHours() + ':' + st.getMinutes() + ':' + st.getSeconds();
				
				var et = new Date(this.tableData.endTime);
				this.tableData.endTime = st.getFullYear() + '-' + (et.getMonth() + 1) + '-' + et.getDate() + ' ' + et.getHours() + ':' + et.getMinutes() + ':' + et.getSeconds();

				var params = new FormData();
				params.append("imgFile", this.files)
				params.append('controlName', this.tableData.controlName)
				params.append('controlDesc', this.tableData.controlDesc)
				params.append('scopeUnit', this.tableData.scopeUnit)
				params.append('startTime', this.tableData.startTime)
				params.append('endTime', this.tableData.endTime)
//				console.log(params)
				this.$axios.post('monitor/initiateControl/' + UNITID, params).then(function(res) {
					var data = res.data;
					vm.$message({
						message: '操作成功',
						type: 'success'
					});
					vm.resetForm();
				})
			},
			//获取布控范围
			getScope() {
				var vm = this;
				this.$axios.post('traffic/pass/listAreaInfo').then(function(res) {
					var data = res.data.data.data,
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
      						label:value.unitName,
						});
						for(var i = index + 1, length = data.length; i < length; i++) {
							if(value.cityUuid == data[i].cityUuid) {
								children.push({
									id: data[i].unitUuid,
									label: data[i].unitName,
								});
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
				this.bus.$emit('getjointControl');
			},
			closeModal() {
				this.bus.$emit('closeFooddialog');
			}
		}
	}
</script>

<style lang="stylus" scoped="scoped">
	.boxtitle {
		color: #75CBF2;
	}
	
	.h-content {
		margin-top: 40px;
	}
	
	.fr {
		float: right;
		margin-top: 10px;
	}
	
	.fr a {
		display: inline-block;
		text-align: center;
		width: 110px;
		cursor: pointer;
		line-height: 32px;
		background: rgba(4, 120, 183, 1);
		border-radius: 2px;
		font-size: 14px;
		color: white;
	}
	
	.section {
		width: 50%;
		float: left;
	}
	
	.section ul {
		width: 202px;
		margin: auto;
		margin-top: -10px;
	}
	
	.section li {
		line-height: 44px;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		font-size: 14px;
		color: #999999;
		padding: 0px 15px;
		margin-bottom: 4px;
		cursor: pointer;
	}
	
	.section .number {
		float: right;
		font-size: 22px;
	}
	
	.yellow * {
		color: #FFCC00;
	}
	
	.blue * {
		color: #00FFFF;
	}
	
	.section.right li {
		line-height: 70px;
	}
	
	.h-title {
		width: 169px;
		height: 30px;
		border: 1px solid rgba(0, 255, 255, 0.5);
		border-radius: 2px;
		margin: auto;
		text-align: center;
	}
	
	.h-title h4 {
		display: inline-block;
		font-size: 16px;
		color: #75CBF2;
		text-align: center;
		margin-top: -30px;
		background: rgb(2, 26, 44);
		padding: 0px 2px;
	}
	
	.h-title h4 b {
		font-size: 22px;
		color: #00FFFF;
		margin: 0px 5px;
	}
	
	.h-title * {
		vertical-align: middle;
	}
	
	.h-tip {
		color: #31859C;
		font-size: 14px;
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
		height: 270px;
		overflow: auto;
		margin-bottom: 30px;
		margin-right: -30px;
	}
	
	.range-c {
		position: absolute;
		left: 0px;
		top: 50px;
		right: 0px;
		background: #002037;
		border: 1px solid rgba(117, 203, 242, 1);
		border-radius: 2px;
		z-index: 1;
		padding: 15px;
	}
	
	.el-tree {
		background: transparent;
	}
	
	.h-dropdown {
		padding: 10px 0px 6px 0px;
		background: #004E81;
		border: 1px solid #00FFFF;
	}
	
	.h-dropdown .el-dropdown-menu__item {
		padding: 0px 15px;
		margin-bottom: 4px;
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
		padding: 11px;
    	border-radius: 0px;
	}
	
	.plates {
		display: inline-block;
		position: relative;
		color: white;
		border: 1px solid #004E81;
		padding: 0px 20px;
		margin-top: 15px;
		border-radius: 5px;
		margin-right: 20px;
		font-size: 14px;
	}
	
	.plates span {
		font-size: 14px;
	}
	
	.plates .el-button {
		border: none;
		outline: none;
		color: #fff;
		position: absolute;
		right: -14px;
		top: -14px;
		padding: 5px 5px;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
	}
	
	.h-textarea-c {
		position: relative;
	}
	
	.append {
		position: absolute;
		right: 8px;
		bottom: -5px;
		color: #75CBF2;
	}
	
	.sel-scope {
		margin-top: 13px;
		max-height: 200px;
		overflow: auto;
	}
	
	.sel-scope li {
		background: #00192B;
		font-size: 14px;
		color: #75CBF2;
		padding: 0px 13px;
		border-radius: 4px;
		position: relative;
		margin-bottom: 4px;
	}
	
	.sel-scope li span {
		font-size: 15px;
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
		padding: 12px 10px;
	}
</style>