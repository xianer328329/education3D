<template>
	<transition leave-active-class="animated slideOutDown fast" enter-active-class="animated slideInUp">
		<div class="searchForPictures-dialog" v-show="curr">
			<img src="../../../../static/images/emergency/searchForPictures/arrow.png" class="close" @click="close"/>
			<component :is="componentName" class="component" :curr="curr" :row="row" @searchCallback="searchCallback"></component>
		</div>
	</transition>
</template>

<script>
	import upload from './upload.vue'
	import historyLists from './historyLists.vue'
	export default{
		data(){
			return{
				curr:'',
				timer:"",
				row:{},
				componentName:''
			}
		},
		components:{
			upload,
			historyLists
		},
		methods:{
			show(type,componentName,row){
				if(componentName==this.componentName&&type==this.curr){
					this.close();
					return;
				}
				this.curr=type;//1是以图搜图 2历史记录列表
				this.row=row;
				this.componentName='';
				this.$nextTick(()=>{
					this.componentName=componentName;
				})
			},
			searchCallback(params){
				this.show(params.type,params.componentName,params.search)
			},
			close(){
				this.curr='';
			}
		}
	}
</script>

<style lang="scss">
	.searchForPictures-dialog{
		position: fixed;
		bottom: 3.35rem;
		top: 2.5rem;
		right: 1rem;
		width: 24.25rem;
		background: #002037;
		border: 1px solid #256080;
		z-index: 102;
		padding: 1rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.close{
			position: absolute;
			right: 0.2rem;
			top: 0.2rem;
			width: 0.9rem;
			padding:0.2rem;
			cursor: pointer;
		}
		.component{
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}
</style>

<style lang="scss">
	.searchForPictures{
		.results{
			// position: relative;
			overflow: auto;
			margin-right: -1rem;
			.container{
				width: 22.25rem;
				.item{
					background-color: #002B4A;
					border-radius: 4px;
					position: relative;
					cursor: pointer;
					.faceUrl{
						width: 100%;
						height: 11rem;
					}
					.content{
						padding: 0.5rem;
						p{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: #4D91B0;
							font-size: 0.8rem;
							min-height: 1em;
							&+p{
								margin-top: 0.2rem;
							}
						}
					}
				}
				&.card{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					.item{
						width: 10.7rem;
						margin-bottom: 1rem;
					}
				}
				&.lists{
					.item{
						margin-bottom: 0.5rem;
						.faceUrl{
							position: absolute;
							left: 0;
							top: 0;
							bottom: 0;
							width: 5rem;
							height: auto;
						}
						.content{
							margin-left: 5rem;
						}
					}
				}
			}
			.searchForPictures-loading{
				text-align: center;
				position: absolute;
				z-index: 1;
				top: 50%;
				left: 0;
				right: 0;
				margin-top: -3rem;
				img{
					width: 5.3rem;
					margin:0 auto 1rem;
					animation: searchForPictures-rotate 1s steps(12) infinite;
				}
				p{
					color: #74D4FF;
				}
				
			}
		}
		@keyframes searchForPictures-rotate{
			0%{
				transform: rotate(0deg);
			}
			
			100%{
				transform: rotate(360deg);
			}
		}
	}
</style>
