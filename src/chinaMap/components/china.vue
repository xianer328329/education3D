<template>
	<div class="h-container">
		<div class="china" ref="china"></div>
		<chinaAside></chinaAside>
	</div>
</template>

<script>
	/* eslin -disable */
	import mapPoints from '../data-gl/chinaArea.js';
	import china from '../data-gl/china.js';
	import chinaAside from './chinaAside.vue';
	export default {
		data() {
			return {

			}
		},
		components: {
			chinaAside
		},
		mounted() {
			this.$nextTick(function() {
				this.initChina();
			});
		},
		methods: {
			initChina() {
				var vm = this;
				var chinaCharts = echarts.init(vm.$refs.china);

				echarts.registerMap('chinaMap', mapPoints);

				chinaCharts.setOption(vm.getOption());

				chinaCharts.on('click', function(params) {
					if(params.name == '重庆') {
						vm.$router.push({
							path: "/citylevel",
						});
					}
					//					else{
					//						alert('暂未接入');
					//						return false;
					//					}
				})
			},
			getOption() {
				var vm = this,
					data = [];
				mapPoints.features.forEach(item => {
					var obj;
					if(item.properties.name == '重庆') {
						obj = {
							name: item.properties.name,
							value: 90,
							itemStyle: {
								color: '#195aae'
							}
						}
					} else {
						obj = {
							name: item.properties.name,
							value: 0
						}
					}
					data.push(obj);
				})
				return {
					//				    bmap:china.bmap,
					color: ['gold', 'aqua', 'lime'],
					backgroundColor: 'transparent',
					title: {
						left: 'center',
						textStyle: {
							color: '#fff'
						}
					},
					tooltip: {
						trigger: 'item',
						textStyle: {
							fontSize: 16
						},
						formatter: function(params) {
							if(params.name == '重庆') {
								return params.name
							}
							return params.name + ' 暂未接入'
						}
					},
					geo: {
						map: 'chinaMap',
						show: false,
						zoom: 1.2,
						roam: true,
					},
					//				    visualMap: {
					//				        show: false,
					//				        min: 0,
					//				        max: 100,
					//				        left: 'left',
					//				        top: 'bottom',
					//				        text: ['高', '低'], // 文本，默认为数值文本
					//				        calculable: true,
					//				        seriesIndex: [0],
					//				        inRange: {
					//				            color: ['#072941','#051E32'] //#051E32
					//				        }
					//				    },
					series: [{
						name: 'MAP',
						type: 'map',
						zoom: 1.2,
						//	                    roam:true,
						mapType: 'chinaMap',
						selectedMode: 'single', //是否允许选中多个区域
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: false
							}
						},
						itemStyle: {
							//	                    	areaColor:'#072941',
							//	                    	borderColor:'#49BFE2',
							borderColor: '#31859c',
							areaColor: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: '#081b61' // 0% 处的颜色
								}, {
									offset: 1,
									color: '#091137' // 100% 处的颜色
								}],
							}
						},
						emphasis: {
							itemStyle: {
								//	                    		areaColor:'#051E32',
								areaColor: '#14205e',
								borderColor: '#0ff'
							}
						},
						data: data
					}].concat(china.chinaData)
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.h-container {
		width: 100%;
		height: 100%;
		background: url(../data-gl/asset/bgcover.png) no-repeat center;
		background-size: cover;
	}
	
	.china {
		width: 1400px;
		height: 100%;
	}
	
	.china>div {
		background: #08304a !important;
	}
</style>