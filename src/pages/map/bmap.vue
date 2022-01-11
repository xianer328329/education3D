<template>
	<div class="h-container h-map-container">
		<div class="title"><img src="../../../static/images/log3.png" alt="" /></div>
		<div class="hainan"><img src="../../../static/images/hain.png" alt="" /><i>南海诸岛</i></div>
		<div class="h-map-btn">
			<!--<a @click="operate(0)" v-if="curr!=0">地球</a>
			<a @click="operate(1)" v-if="curr==2">中国</a>
			<a @click="operate(2)" v-if="curr==2">重庆</a>-->
		</div>
	 	<!--<earth class="earth" :class="{'h-show':curr==0}" v-if="curr==0"></earth>-->
	 	<china  class="earth" :class="{'h-show':curr==1}"></china>
	 	
	</div>
</template>

<script>
//	import earth from './components/earth.vue';
	import china from './components/china.vue';
	export default {
		data(){
			return {
				curr:1,
				state:true,
			}
		},
		components:{
//			earth,
			china,
			
		},
		mounted(){
			/*var vm=this;
			var mapIndex=sessionStorage.getItem('mapIndex')||1;
			this.curr=mapIndex>2?1:mapIndex;
			this.$nextTick(function(){
				vm.state=this.curr==2;
			})
			this.$root.evtHub.$on('changeIndex',function(i){
				vm.curr=i;
				vm.state=vm.curr==2;
			});*/
		},
		methods:{

		}
	}
</script>

<style lang="scss" scoped="scoped">
/*头部*/
.h-container .title{position:absolute; top:18px; left:27px;z-index:19;}
.h-container .title img{float:left;width:100%;height:100%}
.h-container{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	bottom: 0px;
	z-index: 99999999;
}
.hainan{
	position:absolute;
	bottom:70px;
	right:673px;
	z-index:19;
	width:73px;
	height:105px;
}
.hainan i{
	color:#fff;
	font-size:14px;
	position:absolute;
	bottom:0px;
	left:12px;
}
.earth{
	width: 1920px;
	height: 100%;
	transform-origin:center;
	transform: scale(0);
	position: absolute;
	left: 0px;
	top: 0px;
	z-index: 1;
	opacity: 0;
	transition: all 1s linear;
	background: #08304a;
}

.h-map-btn{
	position: absolute;
	right: 15px;
	bottom: 0px;
	z-index: 3;
	a{
		display: block;
	    padding:5px 20px;
	    font-size: 20px;
	    color: #fff;
	    box-shadow: 0 0 10px #fff;
	    background: -webkit-linear-gradient(#ff9500, #010000 70%);
	    background: linear-gradient(#ff9500, #010000 70%);
	    border-radius: 4px;
	    cursor: pointer;
	    margin-bottom: 15px;
	}
}
.h-show{
	transform: scale(1);
	z-index: 2;
	opacity: 1;
}
.china>div{
	background: #08304a !important;
}
</style>

