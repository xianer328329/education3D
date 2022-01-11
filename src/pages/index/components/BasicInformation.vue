<template>
	<div>
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li class="NO_Auth"  @click="shrink(0,$event)" authName="al_index_home_baseInfo" authDesc="基础信息">基础信息</li>
				<!--<li class="NO_Auth padding-top"  @click="shrink(1,$event)" authName="al_index_home_asset" authDesc="资产">资产</li>
				<li class="NO_Auth padding-top"   @click="shrink(2,$event)" authName="al_index_home_orientation" authDesc="迎新">迎新</li>
				<li class="NO_Auth padding-top"  @click="shrink(3,$event)"  authName="al_index_home_leaveschool" authDesc="离校">离校</li>-->
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]">
					<ul class="clearFix">
						<li class="divbase" v-for="(value, key) in list">
							<p class="textsize">{{value}}</p>
							<p>{{key}}</p>
						</li>
					</ul>
				</back-box>
			</transition>
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK2" v-show="showSKRINK[1]">
					<Assets></Assets>
					<!--<img src="../../../../static/images/capital.jpg" width="100%"/>-->
				</back-box>
			</transition>
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK3" v-show="showSKRINK[2]">
					<newborn></newborn>
					<!--<img src="../../../../static/images/welcome.png" width="100%" />-->
				</back-box>
			</transition>
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK4" v-show="showSKRINK[3]">
					<LeavingSchool></LeavingSchool>
					<!--<img src="../../../../static/images/leave.png" width="100%" />-->
				</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	var oTher = 0;
	import Assets from './BasicInformationPage/Assets'
	import newborn from './BasicInformationPage/newborn'
	import LeavingSchool from './BasicInformationPage/LeavingSchool'
	export default {
		name: 'BasicInfor',
		components: {
		Assets,
		newborn,
		LeavingSchool
		},
		data() {
			return {
				showSKRINK:[false,false,false,false],
				list: {
					"校区": "--",
					"师生": "--",
					"面积(亩)": "--",
					"建筑": "--",
					"监管等级": "--",
					"避难场所(处)": "--",
					"应急发电(台)": "--",
					"微型消防站": "--",
					"消防主机": "--",
					"消防监测节点": "--",
					"摄像头": "--",
					"报警柱": "--",
					"车辆进出口": "--",
					"车辆违法监测点": "--",
					"门禁": "--",
					"刷卡终端": "--",
					"能耗监测终端": "--",
					"危化监控终端": "--",
					"监控实验室": "--",
					"实验室监控终端": "--",

				}
			}
		},
		mounted: function() {
			this.baseInfo();
		},
		methods: {
			baseInfo() {
				var _this=this;
				this.$axios.post('home/baseInfo', {
						emulateJSON: true
					})
					.then(this.baseInfoSucc);
			},
			baseInfoSucc(res) {
				var data = res;
				/*
				this.list.能耗检测终端
				this.list.监控实验室
				this.list.实验室监控终端
				data.foodSafetySystemCount//食品安全监管
				=data.accessControlCount;
				//this.list.危化监控终端=data.riskControlSystem;
				*/
				var peopleCount=parseInt(data.studentEquivnum)+parseInt(data.teacherEquivnum)
				this.list['面积(亩)'] = initData(data.acreage);
				this.list['应急发电(台)'] = initData(data.alternatorCount);
				this.list.建筑 = initData(data.buildingCount);
				this.list.校区 = initData(data.campusCount);
				this.list['避难场所(处)'] = initData(data.emergencyPlaceCount);
				this.list['师生'] = initData(peopleCount);
				this.list.消防监测节点 = initData(data.probePointCount);
				this.list.监管等级 = initData(data.riskGrade);
				this.list.车辆进出口 = initData(data.vehicleChannel);
				this.list.摄像头 = initData(data.videoSurveillance);
				this.list.车辆违法监测点 = initData(data.violationPoint);
				this.list.报警柱 = initData(data.alarmColumn);
				this.list.消防主机 = initData(data.fireCount);
				this.list.门禁 = initData(data.doorGuard);
				this.list.刷卡终端 = initData(data.cardTerminal);
				this.list.微型消防站 =initData(data.miniFireStation);

			},
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style lang="stylus" scoped>
	
</style>