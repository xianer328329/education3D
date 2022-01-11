<template>
	<div class="module">
		<div class="section-left">
			<back-box class="border-anim">
				<BasicInformation></BasicInformation>
				<energ-accumulated authName="al_energyregulation_accumulated" authDesc="本年累计" class="NO_Auth"></energ-accumulated>
			</back-box>
			<back-box class="border-anim">
				<energy-analyze authName="al_energyregulation_analyze" authDesc="能耗分析" class="NO_Auth"></energy-analyze>
			</back-box>
			<back-box class="border-anim">
				<Energy-Consumptiontop authName="al_energyregulation_consumptiontop" authDesc="建筑能耗排名TOP5" class="NO_Auth"></Energy-Consumptiontop>
			</back-box>
		</div>
		<div class="section-bottom half-bottom">
			<back-box class="border-anim">
				<water-electricity authName="al_energyregulation_waterelectricity" authDesc="本年分项能耗分析" class="NO_Auth"></water-electricity>
			</back-box>			
		</div>
	
	</div>
</template>

<script>
	import EnergyConsumptiontop from './components/energyconsumptionTop'
	import BasicInformation from './components/BasicInformation'
	import EnergAccumulated from './components/accumulated'
	import EnergyAnalyze from './components/EnergyAnalyze'
	import waterElectricity from './components/waterElectricity'
	
	export default {
		name: 'EnergyRegulation',
		components: {//引入模块
			BasicInformation,//基础信息
			EnergAccumulated,//本年累计
			EnergyAnalyze,//能耗分析
			waterElectricity,//电水气暖
			EnergyConsumptiontop,//建筑能耗TOP5
		},
		mounted: function() {
		}
	}
</script>

<style lang="stylus" scoped>
	
</style>