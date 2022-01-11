<template>
	<el-dialog title="抓拍图片" center  class="emergency-modal snapPictures-modal" :modal-append-to-body="false" :modal="false" :visible="curr!=''" :before-close="close" width="45rem">
		<!--<el-carousel :interval="5000" arrow="always">
		    <el-carousel-item v-for="item in srcList" :key="item">
		       <el-image  :src="item" :preview-src-list="srcList" class="picture"></el-image>
		    </el-carousel-item>
	    </el-carousel>-->
	    <p class="simi alignRight" v-if="row.status=='isFaceControl'"><span class="fl">布控对象：{{row.faceName}}</span>{{row.alarmDesc}}%</p>
	    <div class="img-loop-container">
	    	<div class="item" v-for="(item,index) in srcList" :key="index">
	    		<el-image :src="item" :preview-src-list="loopImgs" class="picture" @click="preview([item])"></el-image>
	    		<span v-if="row.status=='isFaceControl'">{{index==srcList.length-1?'目标图片':'抓拍图片'}}</span>
	    	</div>
	    </div>
	</el-dialog>
</template>

<script>
	export default {
		name: 'playImg',
		data(){
			return{
				curr:'',
				row:{},
				prefix:process.env.IMG_URL,
				srcList:[],
				loopImgs:[],//大图缩放
			}
		},
		mounted(){
			var vm=this;
		},
		methods:{		
			autoPlay(item){
				var vm=this;
				vm.curr=1;
				vm.row=Object.assign({},item);
				vm.srcList=[];
				vm.loopImgs=[];
				try{
					if(item.imgurl){
						var arr=JSON.parse(item.imgurl||'[]'),lists=[];
						if(arr.length>0){
//							var imgs=arr[0].split(',');
							arr.forEach(value=>{
								if(value){
									lists.push(vm.prefix+value);
								}
							})
						}
					}
					if(item.status=='isFaceControl'){
						lists.push(vm.prefix+item.blackImg);
					}
					vm.srcList=lists;
					vm.loopImgs=Object.assign([],lists);
				}catch(e){
					console.log(e.message)
				}
			},
			preview(item){
				this.loopImgs=item;
			},
			close(){
				var vm=this;
				this.curr='';
			}
		}
	}
</script>

<style lang="scss">
	.snapPictures-modal{
		.el-dialog__body{
			min-height: 26rem;
			max-height: 37.5rem;
			overflow: auto;
		}
		.alignRight{
			text-align: right;
			margin-bottom: 1rem;
			min-height: 1.2rem;
		}
		.el-carousel{
			margin-top: 0px;
			.el-carousel__container{
				height: 30rem;
			}
			.el-carousel__item{
				background: rgba(255,255,255,0.1);
				text-align:center; 
				&:after{
					content: '';
					display: inline-block;
					height: 100%;
					vertical-align: middle;
				}
				.picture{
					display: inline-block;
				    max-width: 99%;
				    max-height: 100%;
				    vertical-align: middle;
				    .el-image__error{
				    	background: transparent;
				    }
				}
			}
		}
		.img-loop-container{
			display: flex;
			align-items: center;
			flex-flow: wrap;
		}
		.item{
			flex: 1;
			flex-basis: 10rem;
			flex-shrink: 0;
			position: relative;
			&+.item{
				margin-left: 0.5rem;
			}
			.el-image{
				/*height: 506px;*/
				width: 100%;
				overflow: auto;
				.el-image__error{
					background: transparent;
				}
			}
			span{
				position: absolute;
				right: 0.5rem;
				bottom: 0.5rem;
				color: white;
			}
		}
	}	
</style>
