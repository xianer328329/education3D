<template>
	<div>
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li class="NO_Auth"  @click="shrink(0,$event)"  authName="al_energyregulation_home_baseInfo" authDesc="基础信息">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition 
				enter-active-class="animated fadeInRight"	
				leave-active-class="animated fadeOutRight"
				
			>
			<back-box class="SKRINK SKRINK1"  v-show="showSKRINK[0]">
					<ul class="clearFix">
						<li class="divbase">
								<p class="textsize">134万</p>
								<p>建筑面积m²</p>
						</li>	
						<li class="divbase">
								<p class="textsize">21182</p>
								<p>占地面积<small style="font-size:0.7rem">（亩）</small></p>
						</li>
						<li class="divbase">
								<p class="textsize">21092</p>
								<p>师生人数</p>
						</li>	
						<li class="divbase">
								<p class="textsize">夏热冬冷</p>
								<p>建筑热分工区</p>
						</li>	
						<li class="divbase">
								<p class="textsize">1092</p>
								<p>碳排指标</p>
						</li>	
						<li class="divbase">
								<p class="textsize">--</p>
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
		name: 'BasicInformation',
		data() {
			return {
				showSKRINK:[false],
				data:[],//基本信息数组
			}
		},
		mounted: function() {
		
			//this.getbaseInfo();//获取基本信息
			
		},
		methods: {

			getbaseInfo() {
				this.$axios.post('/traffic/life/baseInfo/' + UNITID).then((res) => {
						this.data=res.data.data||[];
				})
			},// TODO  没有校园生活接口 2019-2-14
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			}
		},
	}
</script>

<style>
	
</style>