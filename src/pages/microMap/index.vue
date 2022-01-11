<template>
	<div class="microMap">
		<div id="microMap"></div>
		<floor ref="floor" :vectorMap="vectorMap"></floor>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				vectorMap:''
			}
		},
		components:{
			floor:()=>import('./components/floor.vue')
		},
		mounted(){
			this.$nextTick(()=>{
				creeper.VectorMap.token= "dGlhbmxvbmdrZWppOmFjODg2YzhmODA5NjMyNjE0ZDEzMmVlZDdmZGQzMzI3";
				this.vectorMap = new creeper.VectorMap('microMap', config.wmapId, config.mapBaseUrl);
				this.vectorMap.on('load',()=>{
					this.addControl();
					this.addMarker();
					this.vectorMap.setBearing(0)
				})
			})
		},
		methods:{
			addControl(){//添加地图控件
				var nav = new creeper.NavigationControl({visualizePitch:true});
				this.vectorMap.addControl(nav, 'bottom-right');				
				this.vectorMap.addControl(new creeper.FullscreenControl({container: document.querySelector('body')}));
			},
			addMarker(){//添加marker
				this.vectorMap.on('click',(e)=>{
					var popupOffsets = {
						'top': [0, 0],
						'top-left': [0,0],
						'top-right': [0,0],
						'bottom': [0, -10],
					};
					var popup = new creeper.Popup({offset: popupOffsets, className: 'my-class'});
					popup.setLngLat(e.lngLat);
					popup.setHTML('<h1>1111</h1>');
					
			
					var marker = new creeper.Marker({color:'red'})
					.setLngLat(e.lngLat)
					.setPopup(popup)
					.addTo(this.vectorMap)
				})
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.microMap{
		height: 100%;
		position: relative;
	}
	#microMap{
		height: 100%;
	}
</style>
