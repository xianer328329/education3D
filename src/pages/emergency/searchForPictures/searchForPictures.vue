<template>
	<div class="searchForPictures">
		<a class="clickBtn flex1" @click="operate('upload',1)">
			<img src="../../../../static/images/emergency/searchForPictures/personIcon.png" >
			<span>以图搜图</span>
		</a>
		<a class="clickBtn history"  @click="operate('historyLists',2)"><i class="el-icon-search"></i>历史搜索记录</a>
		<dialogTemplate ref="dialogTemplate"></dialogTemplate>
	</div>
</template>

<script>
	import dialogTemplate from './dialogTemplate.vue'
	export default{
		data:()=>{
			return{
				
			}
		},
		components:{
			dialogTemplate
		},
		methods:{
			operate(name,type){
				this.$refs.dialogTemplate.show(type,name,{});
				this.bus.$emit('handleCloseMapPop');
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.searchForPictures{
		position: fixed;		
		bottom: 0px;
		margin-bottom: 1.042%;
		right: 1rem;
		width: 24.25rem;
		z-index: 103;
		display:flex;
		align-items: center;
		height: auto !important;
		a{
			cursor: pointer;
		}
		.clickBtn{
			height:2rem;
			background: #0478b7;
			border-radius: 0.2rem;
			text-align: center;
			color: #fff;
			display:flex;
			align-items: center;
			justify-content: center;
			clip-path: polygon(0 0,100% 0,90% 100%,0 100%);
			position: relative;
			z-index: 103;
			img{
				display: inline-block;
				width: 1.3rem;
				height: 1.3rem;		
				margin-right: 0.2rem;
			}
			span{				
				font-size: 0.8rem;
			}
		}
		.history{
			margin-left: -5%;
			width: 10rem;
			font-size: 0.8rem;
			background:rgba(9,97,144,0.4);
			color: #4586A5;
			clip-path: polygon(15% 0,100% 0,100% 100%,0 100%);
			i{
				margin-right: 3px;
			}
		}
	}
</style>

