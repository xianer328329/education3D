<template>
	<div class="h-container">
		<div class="shrinkNav" id="shrinkNav" @click.stop="">
			<ul>
				<li class="haveData" :class="{active:showSKRINK.a}" @click="shrink(1)">基础信息</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
			<back-box class="SKRINK SKRINK1" v-show="showSKRINK.a" @click.stop="">
				<img class="imgsccap" src="../../../../static/images/Education/baseinfo.png"/>
			</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
					showSKRINK:{
					a:false,
					//b:false,
				},
				info: {}
			}
		},
		mounted: function() {
			this.getInfo();
		},
		methods: {
			//获取基础信息
			getInfo() {
				var vm = this;
				this.$axios.post('working/monitor/baseInfo')
					.then(function(res) {
						vm.info = res.data.data;
					})
			},
			shrink(index) {
				if(index==1){
					//this.showSKRINK.b=false;
					this.showSKRINK.a=!this.showSKRINK.a;
				}
				var _this = this
				$(document).click(function(e) {
					var target = $(e.target);
					if(!target.is('#shrinkNav *') && !target.is('#SKRINKBox *')) {
						_this.showSKRINK.a = false
					}
				})
			}
		},
	}
</script>

<style lang="stylus" scoped="scoped">
</style>