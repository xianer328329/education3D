<template>
	<div  class="hikVideo">
		<iframe :src="src"  frameborder="no" ref="hikVideo"></iframe>
	</div>
</template>

<script>
	// 海康视频插件播放
	export default{
		data(){
			return {
				showvideo: false,
				src:'',	
			}
		},
		props:{
			list:{}
		},
		mounted() {
			$(window).resize(()=>{
				this.triggerEvent('resize');
			})
			this.bus.$on('cutHik',(data)=>{
				this.triggerEvent(data.type,data);
			})
		},
		beforeDestroy() {
			this.init(false);
			this.bus.$off('cutHik');
		},
		methods:{
			init(type){
				// if(!this.type)this.triggerEvent('destroy');
				this.src=type?'static/js/hik/demo_window_simple_preview.html':'';
				if(type){
					this.$nextTick(()=>{
						if(this.$refs.hikVideo){
							this.$refs.hikVideo.onload=()=>{
								this.triggerEvent('init');
							};
						}
					})
				}
			},
			triggerEvent(type,data){
				var vm=this;
				let hikVideo=this.$refs.hikVideo;
				if(hikVideo){
					hikVideo&&hikVideo.contentWindow.postMessage({
					  action:type,    // 告诉子页面一些初始值，包括浏览器视窗高度与宽度、iframe偏离文档的位置、iframe相对视窗的位置
					  msg: '父页面容器尺寸变化',
					  iframeOffset: {// iframe偏离文档的位置
						left: hikVideo.getBoundingClientRect().left,  
						top: hikVideo.getBoundingClientRect().top  
					  },
					  scaleConfig:{},
					  list:vm.list,
					  cut:data||{},
					  config:JSON.parse(vm.list.deviceRstp||'{}')
					}, '\*');   // '\*'表示跨域参数，请结合自身业务合理设置
				}
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.hikVideo,iframe{
		width: 100%;
		height: 100%;
		border: 1px solid #4f4f4f;
		box-sizing: border-box;
	}
</style>
