<template>
	<el-dialog class="topography-c self-define-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="70%" center>	  
	  <h1 class="title">安防拓扑图</h1>
	 <!-- <el-table :data="statNums" class="statNums">
		  <el-table-column prop="gun" label="枪机"></el-table-column>
		  <el-table-column prop="halfBall" label="半球"></el-table-column>
		  <el-table-column prop="ball" label="球机"></el-table-column>
	  </el-table> -->
	  <div class="graph-scroller" ref="scroller" v-loading="loading">
	  	 <div id="topography" ref="topography"></div>
	  </div>
	</el-dialog>

</template>

<script>
	var chart,count=0;
	export default {
		name: 'topography',
		data() {
			return {
				curr:'',
				statNums:[],//摄像头类型统计
				lists:[],
				datas:[],
				loading:true,
			}
		},
		mounted: function() {
			this.getStatNums();
		},
		methods: {
			getStatNums(){
				this.$axios.post('home/getCameraTypeNumber',{}).then(res=>{
					this.statNums=res?[res]:[];
				})
			},
			//获取列表
			getLists(){
				var vm=this;
				this.loading=true;
				vm.$axios.post('home/listAllMonitoringOrg',{}).then(async (res)=>{
					vm.lists=res;
					var data=vm.lists,lists=[];
					for(var i=0;i<data.length;i++){
						var value=data[i],state=true;
						for(var j=0;j<data.length;j++){
							var item=data[j];
							if(value.primaryDirectoryId==item.subdirectoryDirectoryId&&value.subdirectoryDirectoryId!=item.subdirectoryDirectoryId){
								state=false;	
							}
						}
						if(state){//没有父节点的元素
							value.dataIndex=i;
							lists.push(value);
						}
					}
					//2019-07-10start 新写
					var trees=[],root={};
					lists.forEach(function(value){
						var state=true;
						trees.forEach(function(item){
							if(value.primaryDirectoryId==item.primaryDirectoryId){
								state=false;
							}
						});
						if(state){
							trees.push(value);
						}
					});
					// console.log(trees)
					if(trees.length>0){
						if(trees.length>1){
							root={
								isRoot:true,
								children:[],
								"subdirectoryDirectoryName": 'sub',
								"subdirectoryDirectoryCode":-101,
								"count":0,
								"primaryDirectoryId":-100,
								"primaryDirectoryName": UNITName,
								"primaryDirectoryCode": -100,
								"subdirectoryDirectoryId":-101,
								"dataIndex": -2,
							}
							lists.forEach(function(item){
								item.primaryDirectoryId=-101;
								item.primaryDirectoryCode=-101;
							});
							lists=[root];
						}else{
							var value=trees[0];
							root={
								isRoot:true,
								children:[],
								"subdirectoryDirectoryName": value.primaryDirectoryId,
								"subdirectoryDirectoryCode":value.primaryDirectoryCode,
								"count": 0,
								"primaryDirectoryId":value.primaryDirectoryId,
								"primaryDirectoryName": value.primaryDirectoryName,
								"primaryDirectoryCode": value.primaryDirectoryCode,
								"subdirectoryDirectoryId":value.primaryDirectoryId,
								"dataIndex": -1
							}
							await vm.getCamera(root,(cameras)=>{
								root.count=cameras.length;
								vm.packageCameras(root,cameras,root.dataIndex);
							});
							lists=[root];
						}
					}else{
						lists=[];
					}
					//2019-07-10end
					
					lists.forEach(function(value,index){
						value.depth=0;
						value.children=value.children.concat(vm.changeData(data,value,value.name));
						value.name=value.primaryDirectoryName;	
						value.countName=value.name;
						value.name+='/'+value.deviceCount;
						count=count+value.children.length;
						value.collapsed=false;
						value.symbolSize=0.9*fontSize,
						value.itemStyle={							
                    		borderColor:'transparent',
                    		color: '#FF9900',
                        }
						value.label={
							// color: '#FF9900',
                    		fontSize:0.8*fontSize,
                    		rotate:0,
	                        'position':'right',
                        }
						value.emphasis={
	                    	label: {
	                            rotate:0,
	                            'position':'right',
		                    },
	                    };
						// console.log(value)
					});
					vm.datas=lists;					
					if(lists.length>0){
						vm.initGraphy(lists);
					}
					vm.loading=false;
				})
			},
			changeData(data,value,name){
				var vm=this;
				var children=[],total=value.count*1;
				for(var i=0;i<data.length;i++){
					var item=data[i];
					if(item.primaryDirectoryId==value.subdirectoryDirectoryId&&item.subdirectoryDirectoryId!=value.subdirectoryDirectoryId){												
						var subIndex=item.subdirectoryDirectoryName.indexOf(name);
						if(subIndex==-1){
							item.name=item.subdirectoryDirectoryName;
						}
						else{
							item.name=item.subdirectoryDirectoryName.substring(subIndex+name.length);
						}
						item.collapsed=true;
						item.dataIndex=i;
						item.depth=value.depth+1;
						item.children=vm.changeData(data,item,name);	
						item.countName=item.name;					
						item.name+='/'+item.deviceCount;
						
						total+=item.deviceCount*1;
						if(item.children.length>0||item.count>0){
							item.itemStyle={
								borderColor:'transparent',
	                    		color: '#0ff',
	                        }
						}
						children.push(item);
					}
				}
				value.deviceCount=total||value.count;
				return children;
			},
			//初始化图表
			initGraphy(data){
				var vm=this;
				vm.$nextTick(function(){
					chart=echarts.init(vm.$refs.topography);
					chart.setOption(vm.getOption(data));
					allCharts.push(chart);
					chart.off('click');
					chart.on('click',function(e){
						vm.clickHandler(e.data)
					});
					// vm.clickHandler(vm.datas[0]);
					vm.dispatchAction();
				})
			},
			downplay(){
				try{
					chart.dispatchAction({
					    type: 'downplay',
					})
				}catch(e){
					console.log('高亮失败')
				}
			},
			dispatchAction(){
				try{
					this.$nextTick(function(){
						this.downplay();
						chart.dispatchAction({
						    type: 'highlight',
						    seriesIndex:0,
						    dataIndex:1,
						})
					})
				}catch(e){
					console.log('高亮失败')
				}
			},
			//处理点击事件
			clickHandler(data){
				var vm=this;
				var obj=vm.lists[data.dataIndex]||data;
				if(obj){
					obj.collapsed=obj.isRoot?false:!obj.collapsed;
					if(obj.hasCamera==undefined&&obj.isCamera==undefined){
						vm.getCamera(data,(cameras)=>{
							vm.packageCameras(obj,cameras,data.dataIndex);
						});
					}else if(obj.isRoot==undefined){
						if(obj.children.length>0){
							if(obj.collapsed){
								count=count-obj.children.length;
							}else{
								count=count+obj.children.length;							
							}
							vm.resizeChart();
						}
					}
				}				
			},
			packageCameras(obj,cameras,dataIndex){
				var vm=this;
				obj.hasCamera=true;
				obj.children=obj.children.concat(cameras);
				if(dataIndex!=-1){
					if(cameras.length>0){
						count=count+cameras.length;
						vm.resizeChart();
					}else{	
						vm.dispatchAction();
					}
				}
			},
			resizeChart(){
				var vm=this;
				try{
					var w=count*8;
					vm.$refs.topography.style.height=w+'px';
					vm.$refs.topography.style.width=w+'px';
					vm.$refs.scroller.scrollTop=(vm.$refs.scroller.scrollHeight-vm.$refs.scroller.offsetHeight)/2;
					vm.$refs.scroller.scrollLeft=(vm.$refs.scroller.scrollWidth-vm.$refs.scroller.offsetWidth)/2;
					chart.setOption({
						series:[{
							data:vm.datas
						}]
					});		
								
					chart.resize();
					
					chart.clear();
					chart.setOption(vm.getOption(vm.datas));
					vm.dispatchAction();
				}catch(e){
					console.log(e.message)
				}
			},
			//获取摄像头
			getCamera(e,callback){
				var vm=this;
				return new Promise((resolve,reject)=>{
					var params={
						subdirectoryDirectoryCode:e.subdirectoryDirectoryCode
					}
					vm.$axios.post('home/listAllMonitoringDevice',params,(data,mess)=>{
						vm.$message.error(mess);
						callback([]);
						resolve([]);
					}).then(function(res){
						var data=res||[];
						data.forEach(function(value){
							value.name=value.devieName;
							value.isCamera=true;
							value.symbol="image://"+require('../../../static/images/map/c4on.png');
							value.symbolSize=[fontSize,fontSize];
							value.label={
	                          fontSize: fontSize*0.8,
			                };
						})
						callback(data);
						resolve(data);
					})
				})
			},
			getOption(data){
				return {
				    tooltip: {
			            trigger: 'item',
			            triggerOn: 'mousemove',
			       },
				    series : [
				        {
				            name:'安防拓扑图',
				            type:'tree',
				            roam:true,
				            initialTreeDepth: 20,
				            layout: 'radial',
				            symbol: 'circle',
				            symbolSize: fontSize*0.5,
				            itemStyle: {
                            	normal:{
                            		borderColor:'transparent',
                            		color:'#004e81'
                            	}
                            },
				            label: {
		                        color: '#c0c0ce',
	                            fontSize: fontSize*0.8,
								formatter:function(params){
									var name=[];
									name.push(params.data.countName||params.name);
									if(!params.data.isCamera){
										name.push('{a|/'+params.data.deviceCount+'}')
									}
									return name.join('')
								},
								rich:{
									a:{			
										fontSize: fontSize*0.8,			
										color:'#00ff7f',
										align:'left',
										fontFamily:'DIN Medium'
									},
								}
		                   },
				            lineStyle: {
		                        color: '#004e81',
		                        width: 1,
		                        curveness:0.2,
		                        type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
		                   },		                  	
				           data:data
				        }
				    ]
				}
			},
			show(type){
				this.curr=type;
				if(chart){
					this.$nextTick(()=>{
						chart.resize();
						this.dispatchAction()
					})
					return;
				}
				count=0;
				this.getLists();
			},
			close(){
				this.curr='';
				this.$emit('close');
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
	#topography{
		width:100%;
		height: 100%;
		min-width: 100%;
		min-height:100%;
		z-index: 1;
	}
	.title{
	    font-size: 1rem;
	    overflow: hidden;
	    position: relative;
	    padding-left: 0.7rem;
		position: absolute;
		left: 1rem;
		top: 0.7rem;
		z-index: 10;
		color: white;
		&:before{
			content: "";
			position: absolute;
			left: 0;
			height: 1rem;
			width: 0.3rem;
			top: 50%;
			margin-top: -0.5rem;
			background: #0ff;
		}
	}
</style>

<style lang="scss">
	.topography-c{
		.el-dialog{
			margin-top: 2% !important;
			margin-bottom: 2% !important;
			position: absolute !important;
			right: 27% !important;
			height: 94%;
			display: flex;
			flex-direction: column;
			.el-dialog__header{
				padding: 0px !important;
			}
			.el-dialog__body{
				flex: 1;
				overflow: hidden;
			}
			.graph-scroller{
				width: 100%;
				height: 100%;
				overflow: auto;
				position: relative;
				z-index: 2;
			}
			.statNums{
				width: 12rem;
				position: absolute;
				right: 0.6rem;
				top: 2rem;
				z-index: 5;
				th,col{
					width: 4rem !important;
				}
				.el-table__header,.el-table__body{
					width: 100% !important;
				}
			}
		}
	}
</style>