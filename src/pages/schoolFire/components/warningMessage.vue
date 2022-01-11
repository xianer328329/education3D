<template>
	<div class="schoolFire alarmMes">
		<h4 class="mdTitle">当日告警</h4>
		<div class="h-progress">
			<div>
				<span class="h-fr">
					<b class="Z-numberf">{{list.nowDeviceUntreated}}</b>
					<i>/</i>
					<i class="Z-numberf">{{list.nowDeviceAlarm}}</i>
				</span>
				<label class="h-fl">当日设施告警</label>
				<div class="progress-c">
					<div class="progress-bar" :style="{width:this.device+'%'}"></div>
				</div>

			</div>
			<div>
				<span class="h-fr">
					<b class="Z-numberf">{{list.nowManageUntreated}}</b>
					<i>/</i>
					<i class="Z-numberf">{{list.nowManageAlarm}}</i>
				</span>
				<label class="h-fl">当日管理告警</label>
				<div class="progress-c">
					<div class="progress-bar" :style="{width:this.manage+'%'}"></div>
				</div>
			</div>
		</div>
		<ul class="total">
			<li class="hikClick" @click="operate(1)">
				<div>
					<p class="Z-numberf">{{list.nowUntreatedAlarm}}</p>
					<span>当日未处理</span>
				</div>
			</li>
			<li class="hikClick" @click="operate(2)">
				<div>
					<p class="Z-numberf">{{list.expireUntreated}}</p>
					<span>逾期未处理</span>
				</div>
			</li>
			<li class="hikClick" @click="operate(3)">
				<div>
					<p class="Z-numberf">{{list.allUntreated}}</p>
					<span>未处理总数</span>
				</div>
			</li>
		</ul>
		<h-sub></h-sub>
	</div>
</template>

<script>
	/* eslint-disable */
	import hSub from './sub.vue';
	export default {
		name: 'warningMessage',
		components: {
			hSub, //弹窗
		},
		data() {
			return {
				intervalid: null, //定时器
				list: {
					nowDeviceUntreated:'--',
					nowDeviceAlarm:'--',
					nowManageUntreated:'--',
					nowManageAlarm:'--',
					nowUntreatedAlarm:'--',
					expireUntreated:'--',
					allUntreated:'--',
				},
				nowDate: Date.now().valueOf(),
				device: "", //实施告警率
				manage: "" //管理告警率
			}
		},
		methods: {
			alarmInfo() { //告警信息请求接口
				this.$axios.post('/fire/fire/alarmInfo', {
						emulateJSON: true
					})
					.then(this.alarmInfoSucc)
			},
			alarmInfoSucc(res) { //告警信息接收函数
				this.list = res;
				if(this.list.nowDeviceAlarm) {
					this.device = (this.list.nowDeviceUntreated / this.list.nowDeviceAlarm) * 100
				} else {
					this.device = 0
				}
				if(this.list.nowManageAlarm) {
					this.manage = (this.list.nowManageUntreated / this.list.nowManageAlarm) * 100
				} else {
					this.manage = 0
				}

			},
			//弹窗
			operate(i) {
				this.bus.$emit('getSchoolFire', i);
			},
		},
		mounted: function() {
			var _this = this;
			this.alarmInfo()
			this.intervalid = setInterval(() => {
				setTimeout(function() {
					_this.alarmInfo();

				}, 0)
			}, 10000)

		},
		beforeDestroy: function() {
			clearInterval(this.intervalid)
		},
	}
</script>

<style lang="stylus" scoped="scoped">
	.total li div {
		cursor: pointer;
	}
</style>
<style>
	.schoolFire.alarmMes .h-right-dialog {
		right: -10px;
	}
</style>