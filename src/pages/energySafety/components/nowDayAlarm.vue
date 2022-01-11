<template>
	<div class="h-container alarmMes">
		<div>
			<h4 class="boxtitle">消防告警</h4>
			<div class="h-progress">
				<div>
					<span class="h-fr">
						<b class="Z-numberf">{{list.nowDeviceUntreated}}</b>
						<i>/</i>
						<i class="Z-numberf">{{list.nowDeviceAlarm}}</i>
					</span>
					<label class="h-fl">违规电器</label>
					<div class="progress-c">
						<div class="progress-bar" :style="{'width':bar1Width}"></div>
					</div>
					
				</div>
				<div>
					<span class="h-fr">
						<b class="Z-numberf">{{list.nowManageUntreated}}</b>
						<i>/</i>
						<i class="Z-numberf">{{list.nowManageAlarm}}</i>
					</span>
					<label class="h-fl">漏&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp电</label>
					<div class="progress-c">
						<div class="progress-bar" :style="{'width':bar2Width}"></div>
					</div>
				</div>
				<div>
					<span class="h-fr">
						<b class="Z-numberf">{{list.nowManageUntreated}}</b>
						<i>/</i>
						<i class="Z-numberf">{{list.nowManageAlarm}}</i>
					</span>
					<label class="h-fl">设备离线</label>
					<div class="progress-c">
						<div class="progress-bar" :style="{'width':bar2Width}"></div>
					</div>
				</div>
				<div>
					<span class="h-fr">
						<b class="Z-numberf">{{list.nowManageUntreated}}</b>
						<i>/</i>
						<i class="Z-numberf">{{list.nowManageAlarm}}</i>
					</span>
					<label class="h-fl">其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他</label>
					<div class="progress-c">
						<div class="progress-bar" :style="{'width':bar2Width}"></div>
					</div>
				</div>
			</div>
			<ul class="total">
				<li @click="operate(1)">
					<div>
						<p class="Z-numberf">{{list.nowUntreatedAlarm}}</p>
						<span>当日未处理</span>
					</div>
				</li>
				<li @click="operate(2)">
					<div>
						<p class="Z-numberf">{{list.expireUntreated}}</p>
						<span>逾期未处理</span>
					</div>
				</li>
				<li @click="operate(3)">
					<div>
						<p class="Z-numberf">{{list.allUntreated}}</p>
						<span>未处理总数</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	var mTime;
	export default {
		data(){
			return {
				list:[],//数据
				bar1Width:0,//进度条宽度
				bar2Width:0,//进度条宽度
			}
		},
		components:{
			
		},
		mounted(){
			this.getList();
		},
		methods:{
			//弹窗
			operate(i){
				this.bus.$emit('getFireMaintenance',i);
			},
			//获取数据
			getList(){
				var vm=this;
				var req='fire/operation/alarmInfo';
				this.$axios.post(req).then(function(res){
					vm.list=res.data.data;
					vm.bar1Width=vm.list.nowDeviceAlarm==0?0:((vm.list.nowDeviceUntreated/vm.list.nowDeviceAlarm)*100).toFixed(2)+'%';
					vm.bar2Width=vm.list.nowManageAlarm==0?0:((vm.list.nowManageUntreated/vm.list.nowManageAlarm)*100).toFixed(2)+'%';
				})
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
.h-container{
	&.alarmMes{
		.total{
			bottom: 0px;
			p{
				padding-bottom: 5px;
				margin-bottom: 5px;
			}
		}
		.total li div{
			cursor: pointer;
		}
		.h-progress>div{
			margin-top: 13px;
		}
	}
}

</style>
<style>
.h-container.alarmMes .h-right-dialog{
	right:-10px;
}
</style>