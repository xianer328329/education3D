<template>
	<div class="module">		
		<div class="section-left">
			<back-box class="border-anim">
				<BasicInformation></BasicInformation>
				<campuslife authName="al_schoollife_traffic_life_lifeanalyze" authDesc="校园生活" class="NO_Auth"></campuslife>
			</back-box>
			<back-box class="border-anim">
				<Eat authName="al_schoollife_traffic_life_eat" authDesc="就餐" class="NO_Auth"></Eat>
			</back-box>
			<back-box class="border-anim">
				<AnomalyDetection authName="al_schoollife_anomalydetection" authDesc="异常检测" class="NO_Auth"></AnomalyDetection>
			</back-box>			
		</div>
		<div class="section-bottom">
			<back-box class="border-anim">
				<ConsumptionRatio authName="al_schoollife_traffic_life_feedevice" authDesc="消费占比" class="NO_Auth"></ConsumptionRatio>
			</back-box>
			<back-box class=" border-anim">
				<BorrowingAnalysis authName="al_schoollife_traffic_life_previewanaly" authDesc="借阅分析" class="NO_Auth"></BorrowingAnalysis>
			</back-box>
			<back-box class="border-anim">
				<propensity-consume authName="al_schoollife_traffic_life_weektrend" authDesc="就餐消费倾向" class="NO_Auth"></propensity-consume>
				<!--<EatAnalysis></EatAnalysis>-->
			</back-box>
		</div>
	</div>
</template>

<script>
	import campuslife from './components/campuslife'
	import Eat from './components/Eat'
	import AnomalyDetection from './components/AnomalyDetection'
	import LifePayment from './components/LifePayment'
	import BorrowingAnalysis from './components/BorrowingAnalysis'
	import EatAnalysis from './components/EatAnalysis'
	import BasicInformation from './components/BasicInformation'
	import ConsumptionRatio from './components/ConsumptionRatio'
	import PropensityConsume from './components/propensityConsume'
	export default {
		name: 'SchoolLife',
		components: {//引入模块
			campuslife,//校园生活
			Eat, //就餐
			AnomalyDetection,//异常检测
			LifePayment,//生活缴费   
			BorrowingAnalysis, //借阅分析
			EatAnalysis,//就餐分析
			BasicInformation,//基础信息
			ConsumptionRatio,//消费占比
			PropensityConsume,//就餐消费倾向
		},
		mounted: function() {
		}
	}
</script>

<style lang="stylus" scoped>

</style>