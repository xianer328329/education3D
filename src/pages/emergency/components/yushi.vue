<template>
	<div class="yushi iframe">
		<iframe :src="src"  frameborder="no" ref="yushiVideo"></iframe>
	</div>
</template>

<script>
	import { Loading } from 'element-ui';
	export default{
		name:'yushi',//宇视视频播放
		data(){
			return{
				src:'',
			}
		},
		props:{
			list:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		mounted() {
			var vm=this;
		},
		methods:{
			init(type){//true显示，false隐藏
				this.src=type?'static/js/yushi/app/demo.html':'';
				if(type){
					this.$nextTick(()=>{
						if(this.$refs.yushiVideo){
							this.$refs.yushiVideo.onload=()=>{
								this.triggerEvent('init');
							};
						}
					})
				}
			},
			triggerEvent(type){
				var vm=this;
				let yushiVideo=this.$refs.yushiVideo;
				if(yushiVideo){
					yushiVideo&&yushiVideo.contentWindow.postMessage({
					  action:type,    // 告诉子页面一些初始值
					  msg:'通知子页面',
					  list:vm.list
					}, '\*');   // '\*'表示跨域参数，请结合自身业务合理设置
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.iframe,iframe{
		width: 100%;
		height: 100%;
	}
</style>
