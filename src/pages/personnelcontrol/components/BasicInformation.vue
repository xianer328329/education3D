<template>
	<div>
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li  class="NO_Auth"  @click="shrink(0,$event)"  authName="al_personnelcontrol_traffic_people_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="showSKRINK[0]">
					<ul class="clearFix">
						<li class="divbase">
							<p class="textsize">{{doubleGuard}}</p>
							<p>双向门禁</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{singleGuard}}</p>
							<p>单向门禁</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{teacherCount}}</p>
							<p>持卡教职工</p>
						</li>
						<li class="divbase">
							<p class="textsize">{{studentCount}}</p>
							<p>持卡学生</p>
						</li>
						<li class="divbase singular">
							<p class="textsize">{{joinDate}}</p>
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

				showSKRINK: [false],
				teacherCount:'--', //教师数量
				studentCount:'--', //学生数量
				doubleGuard:'--', //双向门禁
				singleGuard:'--', //单向门禁
				joinDate: '--', //接入时间
			}
		},
		mounted: function() {
			
			this.getbaseInfo(); //获取基本信息
		},
		methods: {
			getbaseInfo() {
				this.$axios.post('traffic/people/baseInfo/'+UNITID).then((res) => {
						var data = res|| [];
						this.singleGuard = data.singleGuard;
						this.doubleGuard = data.doubleGuard;
						this.teacherCount = data.teacherCount;
						this.studentCount = data.studentCount;
						this.joinDate = data.joinDate;
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