<template>
	<div>
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li  class="NO_Auth"  @click="shrink(0,$event)"   authName="al_schoollife_traffic_life_baseinfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition  enter-active-class="animated fadeInRight"	 leave-active-class="animated fadeOutRight" >
				<back-box class="SKRINK SKRINK1"  v-show="showSKRINK[0]">
						<ul class="clearFix">
							<li class="divbase">
									<p class="textsize">{{data.cardTerminal}}</p>
									<p>刷卡终端</p>
							</li>	
							<li class="divbase">
									<p class="textsize">{{data.studentCount}}</p>
									<p>持卡学生</p>
							</li>
							<li class="divbase">
									<p class="textsize">{{data.teacherCount}}</p>
									<p>持卡教职工</p>
							</li>	
							<li class="divbase">
									<p class="textsize">{{data.joinDate}}</p>
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
				data:{
					cardTerminal:"--",//刷卡终端
					studentCount:"--",//持卡学生
					teacherCount:"--",//持卡教职工
					joinDate:"--"//接入时间
				},
			}
		},
		mounted: function() {
			//this.shrink();
			this.getbaseInfo();//获取基本信息
			
		},
		methods: {

			getbaseInfo() {
				this.$axios.post('/traffic/life/baseInfo/' + UNITID).then((res) => {
					var data=res
						if(data){
							this.data.cardTerminal=initData(data.cardTerminal)
							this.data.studentCount=initData(data.studentCount)
							this.data.teacherCount=initData(data.teacherCount)
							this.data.joinDate=initData(data.joinDate)
						}
				})
			},
			// TODO  没有校园生活接口 2019-2-14
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style>
	
</style>