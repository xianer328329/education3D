<template>
	<div class="microMap-floor">
		<template v-if="floors.length>0">
			<a class="prev" @click="prev"></a>
			<a v-for="(item,index) in floors" :key="index" :class="{'active':nowLevel==item.floorIndex}" @click="setLevel(item.floorIndex)">{{item.name}}</a>
			<a class="next" @click="next"></a>
		</template>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				floors:[],
				maxLevel:0,
				minLevel:0,
				nowLevel:0,
			}
		},
		props:['vectorMap'],
		mounted(){
			if(this.vectorMap){
				this.bindZoom();
			}
		},
		methods:{			
			bindZoom(){
				var vm=this;
				this.vectorMap.on('moveend',function(e){
					var zoom=vm.vectorMap.getZoom();
					if(zoom>=18){						
						setTimeout(()=>{
							var floor=e.target.floorComponent;
							vm.maxLevel=floor.maxLevel*1;
							vm.minLevel=floor.minLevel*1;
							vm.nowLevel=floor.nowLevelIndex*1;
							if(vm.maxLevel==vm.minLevel)vm.floors=[];
							else{							
								vm.floors=[];
								vm.getLevel();
							}
						})
					}else{
						vm.floors=[];
					}
				})
			},
			getLevel(){//转换楼层显示格式
				var arr=[];
				for(var i=this.minLevel;i<=this.maxLevel;i++){
					if(i<0)var name='B'+(-1*i)
					else var name=(i+1)+'F'
					arr.push({
						floorIndex:i,
						name:name
					});
				}
				var startIndex=this.nowLevel+this.minLevel-2;
				if(startIndex<0){
					startIndex=0
				}else{
					if(this.maxLevel-this.nowLevel<2){
						startIndex=this.maxLevel-this.minLevel-4;
						if(startIndex<0)startIndex=0;
					}
				}
						
				var start=this.nowLevel+this.minLevel-2;
				var arr1=arr.slice(startIndex,this.nowLevel-this.minLevel);
				var arr2=arr.slice(this.nowLevel-this.minLevel,5+(this.nowLevel-this.minLevel)-arr1.length);
				this.floors=(arr1.concat(arr2)).reverse();
			},
			prev(){//上一层
				if(this.nowLevel<this.maxLevel){
					this.setLevel(++this.nowLevel);
				}
			},
			next(){//下一层
				if(this.nowLevel>this.minLevel){
					this.setLevel(--this.nowLevel);
				}
			},
			setLevel(level){//切换楼层
				this.nowLevel=level;
				this.getLevel();
				this.vectorMap.setLevel(level);
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.microMap-floor{
		position: absolute;
		right: 10px;
		bottom: 120px;
		z-index: 3;
		box-shadow: 0 0 0 2px rgba(0,0,0,.1);
		border-radius: 4px;
		overflow: hidden;
		a{
			display: block;
			width: 29px;
			height: 29px;
			background-size: 100% 100% !important;
			transform-origin: center;
			text-align: center;
			line-height: 29px;
			background-color:white;
			cursor: pointer;
			color: #666;
			font-size: 14px;
			user-select: none;
			&.prev{
				background: url(../../../../static/images/d205_03.png) no-repeat center;
				transform: rotate(90deg);
			}
			&.next{
				background: url(../../../../static/images/d205_03.png) no-repeat center;
				transform: rotate(-90deg);
			}
			&.active{
			   background: #0a99f1;
			   color: #fff;
			}
		}
	}
</style>
