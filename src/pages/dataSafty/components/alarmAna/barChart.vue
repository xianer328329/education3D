<template>
	<div class="h-container">
		<div class="section">
			<h4 class="mdTitle">楼宇告警 TOP5</h4>
			<div class="bar-c">
				<div v-for="(item,i) in buildList[index]" class="block vertical-middle-c" v-if="buildList.length>0&&item.count>0" :key="'build'+i">
					<div class="vertical-middle">
						<span :title="item.name">{{item.name}}</span>
						<div class="barBg">
							<div class="bar" :style="{width:(buildMax[index]>0?(item.count/buildMax[index]*100):0)+'%'}"><b :title="item.count">{{item.count}}</b></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="section">
			<h4 class="mdTitle">网管工作站告警 TOP5</h4>
			<div class="bar-c">
				<div v-for="(item,i) in boxList[index]" class="block vertical-middle-c" v-if="boxList.length>0&&item.count>0" :key="'box'+i">
					<div class="vertical-middle">
						<span :title="item.name">{{item.name}}</span>
						<div class="barBg">
							<div class="bar" :style="{width:(boxMax[index]>0?(item.count/boxMax[index]*100):0)+'%'}"><b :title="item.count">{{item.count}}</b></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: '',//告警分析
		data(){
			return{
				buildList:[],
				boxList:[],
				buildMax:[0,0,0,0],
				boxMax:[0,0,0,0],
			}
		},
		props:{
			'buildData':{
				type:Array,
				'default':[]
			},
			'boxData':{
				type:Array,
				'default':[]
			},
			'index':{
				type:Number,
				'default':0
			}
		},
		watch:{
			buildData(newvalue){
				var arr=[],moveArr=[],accessArr=[],lineArr=[];
				newvalue.forEach(item=>{
					arr.push({
						name:item.buildName,
						count:item.count,
					});
					if(item.count>this.buildMax[0]){
						this.buildMax[0]=item.count;
					}
					
					accessArr.push({
						name:item.buildName,
						count:item.accessCount,
					});
					if(item.accessCount>this.buildMax[1]){
						this.buildMax[1]=item.accessCount;
					}
					
					lineArr.push({
						name:item.buildName,
						count:item.lineCount,
					});
					if(item.lineCount>this.buildMax[2]){
						this.buildMax[2]=item.lineCount;
					}
					
					moveArr.push({
						name:item.buildName,
						count:item.moveCount,
					});
					if(item.moveCount>this.buildMax[3]){
						this.buildMax[3]=item.moveCount;
					}
				});
				
				arr.sort(function(a,b){
					return b.count-a.count;
				});
				accessArr.sort(function(a,b){
					return b.count-a.count;
				});
				lineArr.sort(function(a,b){
					return b.count-a.count;
				});
				moveArr.sort(function(a,b){
					return b.count-a.count;
				});
				this.buildList=[arr,accessArr,lineArr,moveArr];
			},
			boxData(newvalue){
				var arr=[],moveArr=[],accessArr=[],lineArr=[];
				newvalue.forEach(item=>{
					arr.push({
						name:item.deviceName,
						count:item.count,
					});
					if(item.count>this.boxMax[0]){
						this.boxMax[0]=item.count;
					}
					
					accessArr.push({
						name:item.deviceName,
						count:item.accessCount,
					});
					if(item.accessCount>this.boxMax[1]){
						this.boxMax[1]=item.accessCount;
					}
					
					lineArr.push({
						name:item.deviceName,
						count:item.lineCount,
					});
					if(item.lineCount>this.boxMax[2]){
						this.boxMax[2]=item.lineCount;
					}
					
					moveArr.push({
						name:item.deviceName,
						count:item.moveCount,
					});
					if(item.moveCount>this.boxMax[3]){
						this.boxMax[3]=item.moveCount;
					}					
				});
				arr.sort(function(a,b){
					return b.count-a.count;
				});
				accessArr.sort(function(a,b){
					return b.count-a.count;
				});
				lineArr.sort(function(a,b){
					return b.count-a.count;
				});
				moveArr.sort(function(a,b){
					return b.count-a.count;
				});
				this.boxList=[arr,accessArr,lineArr,moveArr];
			}
		},
		mounted: function() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.section{
		float: left;
		width:50%;
		padding-right: 1.25rem;
		box-sizing: border-box;
		height: 100%;
		.bar-c{
			line-height: 0.8rem;
			height: calc(100% - 2rem);
			/*overflow: hidden;*/
			&.fl{
				margin-right: 0.5rem;
			}
			.block{
				height: 20%;
				max-height: 2.5rem;
			}
			span,b{
				display: block;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				width: 5rem;
			}
			span{
				display: inline-block;
				color:#75CBF2 ;
				font-size: 0.8rem;
				text-align: right;
				float: left;
			}
			.barBg{
				margin-left: 5.5rem;
				margin-right: 3.5rem;
				.bar{
					width: 0px;
					height: 0.8rem;
					background: #22B1D4;
					position: relative;
					b{
						position: absolute;
						font-weight: normal;
						color: #00FFFF;
						font-size: 0.9rem;
						margin-left: 0.5rem;
						width: 3.5rem;
						left: 100%;
						top: 0%;
					}
				}
				
			}
		}
	}
</style>