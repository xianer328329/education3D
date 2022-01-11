<template>
	<div class="h-container alarmAna">
		<h4 class="mdTitle">告警分析</h4>
		<lineChart class="section" @getInfo="operate" :lists="lineData"></lineChart>
		<pieChart class="section" :lists="pieData" @changeBar="changeBar"></pieChart>
		<barChart class="bar" :buildData="buildData" :boxData="boxData" :index="index"></barChart>
	</div>
</template>

<script>
	import lineChart from './alarmAna/lineChart.vue';
	import pieChart from './alarmAna/pieChart.vue';
	import barChart from './alarmAna/barChart.vue';
	export default {
		name: '',//告警分析
		components: {//引入模块
			lineChart,
			pieChart,
			barChart
		},
		data(){
			return{
				lastDate:'',
				lineData:[],
				pieData:[],
				buildData:[],
				boxData:[],
				index:0,
			}
		},
		mounted: function() {
			
		},
		methods:{
			getInfo(type,lastDate){
				var vm=this;
				var params={
					unitUuid:UNITID,
					queryType:type==1?'day':'month'
				}
				this.$axios.post('box/statistics/calarmAnalysis',params).then(function(data){
					if(lastDate==vm.lastDate){
						vm.lineData=data.histogramList||[];
						vm.pieData=data.pieList||[];
						vm.buildData=data.buildList||[];
						vm.boxData=data.boxList||[];
					}
				})
			},
			operate(type){
				this.lastDate=Date.now();
				this.getInfo(type,this.lastDate);
			},
			//改变bar数据
			changeBar(index){
				this.index=index;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.section{
		float: left;
		width: 25%;
		position: relative;
		top: -1.6rem;
		z-index: 1;
		height: 100%;
	}
	.bar{
		float: left;
		width: 50%;
		position: relative;
		top: -1.1rem;
		height: 100%;
	}
</style>