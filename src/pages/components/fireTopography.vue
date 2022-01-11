<template>
	<el-dialog class="fireTopography-c self-define-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="67rem" center>
	   <h1 class="title">消防拓扑图</h1>
	   <div class="graph-scroller" ref="scroller" v-loading="loading">
			<div id="fireTopography" ref="fireTopography" ></div>
	   </div>
	  
	</el-dialog>

</template>

<script>
	var chart;
	export default {
		name: 'fireTopography',
		data() {
			return {
				curr:'',
				lists:[],
				datas:[],
				loading:true,
			}
		},
		mounted: function() {
			
		},
		methods: {
			//获取列表
			getLists(){
				var vm=this;
				this.loading=true;
				vm.$axios.post('fire/fire/build',{}).then((res)=>{
					var builds=res.buildList,arr=[];
					vm.lists=builds;
					builds.forEach(function(value,index){
						value.name=value.buildName;
						value.collapsed=true;
						value.dataIndex=index;
						if(value.deviceCount>0){
							value.itemStyle={
								borderColor:'transparent',
	                    		color: '#0ff',
	                       }
						}
						value.children=[];
					});
					var obj={
						name:UNITName,
						collapsed:false,
						symbolSize:fontSize*0.9,
						isRoot:true,
						itemStyle:{
							borderColor:'transparent',
                    		color: '#FF9900',
                        },
                        label:{
//                  		color: '#FF9900',
                    		fontSize:fontSize*0.8,
                    		rotate:0,
	                        'position':'right',
                        },
                        emphasis:{
	                    	label: {
	                            rotate:0,
	                            'position':'right',
		                    },
	                    },
						children:builds
					}
					vm.datas=[obj];
					vm.initGraphy(vm.datas);					
					vm.loading=false;
				})
			},
			//初始化图表
			initGraphy(data){
				var vm=this;
				vm.$nextTick(function(){
					chart=echarts.init(vm.$refs.fireTopography);
					chart.setOption(vm.getOption(data));
					allCharts.push(chart);
					chart.off('click');
					chart.on('click',function(e){
						vm.clickHandler(e.data)
					});
					vm.dispatchAction();
				})
			},
			dispatchAction(){
				try{
					this.$nextTick(function(){
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
				var obj=vm.lists[data.dataIndex];
				if(obj){
					obj.collapsed=obj.isRoot?false:!obj.collapsed;
					if(obj.hasDevice==undefined&&obj.isDevice==undefined){
						vm.getDevices(data,function(devices){	
							obj.hasDevice=true;
							obj.children=obj.children.concat(devices);
							chart.setOption({
								series:[{
									data:vm.datas
								}]
							});
							vm.dispatchAction();
						});
					}else{
						vm.dispatchAction();
					}
				}
			},
			//获取设备
			getDevices(e,callback){
				var vm=this;
				var params={
					buildName:e.buildName
				}
				vm.$axios.post('fire/fire/bulidDevices',params).then(function(res){
					var data=res.deviceList||[];
					data.forEach(function(value){
						value.name=value.typeName+'-'+value.count;
						value.isDevice=true;
						value.symbol="image://"+require('../../../static/images/map/c5on.png');
						value.symbolSize=[fontSize,fontSize];
						value.label={
                            fontSize: 0.6*fontSize,
		                };
					});
					callback(data);
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
				            name:'消防拓扑图',
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
	                            fontSize: fontSize*0.7,
		                    },
				            lineStyle: {
		                        color: '#004e81',
		                        width: 1,
		                        curveness:0.2,
		                        type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
		                    },
		                  	leaves:{//未展开的节点
		                  		itemStyle: {
                            		borderColor:'transparent',
                            		color: 'red',
                                },
		                  	},
		                  	emphasis:{
		                  		lineStyle: {
			                        color: 'red',
			                    },
		                  	},
				            data: data
				        }
				    ]
				}
			},
			show(type){
				this.curr=type;
				if(chart){
					return;
				}
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
	.graph-scroller,#fireTopography{
		width: 65rem;
		height: 45rem;
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
	.fireTopography-c{
		.el-dialog{
			margin-top: 2rem !important;			
			position: absolute !important;
			right: 27% !important;
			.el-dialog__header{
				padding: 0px !important;
			}
		}
	}
</style>