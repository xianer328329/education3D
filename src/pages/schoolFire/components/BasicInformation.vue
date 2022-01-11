<template>
	<div>
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li  class="NO_Auth"  @click="shrink(0,$event)"  authName="al_schoolfire_fire_fire_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]">
					<ul class="clearFix">
						<li class="divbase">
							<p class="textsize">{{list.superviseGrade}}</p>
							<p>监管等级</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.smallStation}}</p>
							<p>微型消防站</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.buildingCount}}</p>
							<p>建筑</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.alarmDevice}}</p>
							<p>报警主机</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.evacuationCase}}</p>
							<p>疏散箱</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.extinguisher}}</p>
							<p>灭火器</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.fireHydrant}}</p>
							<p>消火栓</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{list.monitorNode}}</p>
							<p>监测节点</p>
						</li>
						<li class="divbase singular">
							<p class="textsize">{{list.joinDate}}</p>
							<p>接入时间</p>
						</li>
					</ul>

				</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showSKRINK:[false],
				list: {
					alarmDevice: "--", //报警主机
					buildingCount: "--", //建筑
					evacuationCase: "--", //疏散箱
					extinguisher: "--", //灭火器
					fireHydrant: "--", //消火栓
					joinDate: "--", //接入时间
					monitorNode: "--", //监测节点
					smallStation: "--", //微型消防站
					superviseGrade: "--" //监管等级
				}
			}
		},
		mounted: function() {
			this.getbaseInfo(); //获取基本信息
		},
		methods: {
			getbaseInfo() {
				this.$axios.post('/fire/fire/baseInfo').then((res) => {
					var data = res || {};
					this.list.alarmDevice = data.alarmDevice
					this.list.buildingCount = data.buildingCount
					this.list.evacuationCase = data.evacuationCase
					this.list.extinguisher = data.extinguisher
					this.list.fireHydrant = data.fireHydrant
					this.list.joinDate = data.joinDate
					this.list.monitorNode = data.monitorNode
					this.list.smallStation = data.smallStation
					this.list.superviseGrade = data.superviseGrade
				})
			},
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style>

</style>