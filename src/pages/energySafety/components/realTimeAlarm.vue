<template>
	<div class="h-container fire">
		<div class="h-section h-section2">
			<h4 class="boxtitle">实时告警</h4>
			<el-table  :data="lists" class="h-table" stripe max-height="410" >
			    <el-table-column prop="deviceCode" label="设备ID" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column prop="buildName" label="楼宇" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column prop="position" label="位置" :show-overflow-tooltip="true">
			    	<!--<template slot-scope="scope">
			    		{{scope.row.position}}
			    	</template>-->
			    </el-table-column>
			    <el-table-column prop="alarmCount" label="次数" width="80" class="Z-numberf" :show-overflow-tooltip="true"> </el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	var mTime;
	export default {
		data(){
			return {
				lists:[]
			}
		},
		mounted(){
			this.getFault();
		},
		methods:{
			//设备故障TOP10(最近90天)
			getFault(){
				var vm=this;
				this.$axios.post('fire/operation/deviceFaultTopN').then(function(res){
					vm.lists=(res.data.data.faultList).slice(0,8);
				})
			},
		}
	}
</script>

<style scoped="scoped">
.boxtitle{
	color:#75CBF2;
}
.h-container{
	position: relative;
}

.h-tip{
	margin-top: -3px;
}
.h-tip span{
	font-size: 14px;
	color: #00FFFF;
	margin-left: 10px;
}
.h-tip *{
	vertical-align: middle;
}
.h-tip span i{
	display: inline-block;
	width: 14px;
	height: 10px;
	background: red;
	border-radius: 2px;
	margin-right: 4px;
}
.h-tip span b{
	font-size: 24px;
	color: #00FFFF;
	margin-left: 3px;
}
.h-title{
	margin-bottom: 10px;
}

.h-content{
	position: relative;
}
.h-time-c{
	top: 0px !important;
	right: 0px !important;
}
.h-text-overflow{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 16px;
}
</style>
