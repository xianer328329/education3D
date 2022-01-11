<template>
	<div class="fl">
		<img title="设置实时告警" src="../../static/images/header/enable_real_alarm.png" v-if="enableRealAlarm==1"  @click.stop="switchIsEnableRealAlarm"/>
		<img title="设置实时告警" src="../../static/images/header/disable_real_alarm.png" v-else  @click.stop="switchIsEnableRealAlarm"/>
		<transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
			<div class="realAlarmConfig flex flex-column"  v-loading="loading" v-show="show" @click.stop="">
				<p class="subtitle">地图实时告警开启设置</p>
				<div class="content flex1  flex flex-column">
					<el-switch  v-model="all" inactive-text="全部"  active-value="1" inactive-value="0"  class="all" @change="toggleAll"></el-switch>
					<div class="scroll flex1">
						<div class="section"  v-for="(value,k) in config" :key="k" v-if="value.count">
							<p class="type">{{value.name}}</p>
							
							<el-switch  v-model="item.alarmVale" :inactive-text="item.alarmName" active-value="1" inactive-value="0" v-for="(item,k1) in value.child" :key="k1">{{item.alarmVale}}</el-switch>
						</div>
					</div>
				</div>
				<div class="footer-btn">
					<a @click="saveConfig">保存</a>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				show:false,
				loading:false,
				modules:[],//模块
				enableRealAlarm:1,//是否启用实时告警，默认启用  1：有部分启用的推送 ，2全部禁用,				
				all:'1',
				config:{
					al_emergency_home_alarminfo:{
						name:'消防',
						child:{}
					},
					al_emergency_home_shelter:{
						name:'方舱',
						child:{}
					},
					al_emergency_home_monitorinfo:{
						name:'安防',
						child:{}
					},
					al_emergency_traffic_pass_trafficinfo:{
						name:'车辆',
						child:{}
					},
				}
			}
		},
		watch:{
			config:{
				handler(newvalue){
					var all='1';
					for(var k in this.config){
						for(var k1 in this.config[k].child){
							var value=this.config[k].child[k1];
							if(value.alarmVale==='0')all='0'
						}
					}
					this.all=all;
				},
				deep:true
			}
		},
		mounted() {
			$(document).on('click',()=>{
				this.show=false;
			});
			this.init();
		},
		methods:{
			async init(){
				this.modules=await this.getModule();
				this.getConfig();
			},
			getConfig(){
				this.loading=true;
				this.$axios.post(process.env.API_OHTTPH+'yhgl/user/dGetNowAlarmSet',{},()=>{
					this.loading=false;
				}).then(res=>{
					this.loading=false;
					var data=res||[];
					if(data.length>0){
						var config=JSON.parse(data[0].paramsValue||'[]');
						config.forEach(item=>{
							for(var k in this.config){
								for(var k1 in this.config[k].child){
									var value=this.config[k].child[k1];
									if(item.alarmUuid==value.alarmUuid){
										value.alarmVale=item.alarmVale;
										value.alarmType=item.alarmType;
									}
									
								}
							}
						})	
					}				
					this.updateRealAlarmConfig();
				})
			},
			saveConfig(){
				this.loading=true;
				var paramsValue=[];				
				for(var k in this.config){
					for(var k1 in this.config[k].child){
						var value=this.config[k].child[k1];
						paramsValue.push({
							alarmUuid:value.uuid,
							alarmName:value.paramsNote,
							alarmVale:value.alarmVale
						})
					}
				}
				var params={
					paramsValue:JSON.stringify(paramsValue)
				}
				this.$axios.post(process.env.API_OHTTPH+'yhgl/user/dupdateNowAlarmSet',params,(data,mess)=>{
					this.loading=false;
					this.$message.error(mess);
					this.getModuleSuccess();
					this.getConfig();
				}).then(res=>{
					this.loading=false;
					this.$message.success('保存成功');
					this.updateRealAlarmConfig();
				})
			},
			updateRealAlarmConfig(){
				var config={},enableRealAlarm=2;
				for(var k in this.config){
					for(var k1 in this.config[k].child){
						var value=this.config[k].child[k1];
						if(value.alarmVale==='1'){
							config[value.alarmType]=true;
							enableRealAlarm=1;
						}
					}
				}
				if(Object.keys(realAlarmConfig).length==0){
					realAlarmConfig={all:false};
				}else{
					realAlarmConfig=config;
				}
				this.enableRealAlarm=enableRealAlarm;
			},
			getModule(){
				this.loading=true;
				this.all='1';
				var parameter={
					// paramsName:"al_emergency_home_monitorinfo",
					pageName:"/emergency"
				}
				return this.$axios.post("/home/dGetAccessModule", parameter,()=>{
					this.loading=false;
				}).then(res=>{
					this.modules=res||[];
					this.getModuleSuccess();
					return this.modules;	
				});
			},
			getModuleSuccess(){
				this.modules.forEach((item,i)=>{
					for(var k in this.config){
						this.config[k].count=this.config[k].count||0;
						if(item.paramsName.indexOf(k)>-1){
							this.config[k].count++;
							this.$set(this.config[k].child,item.uuid,{
								...item,
								alarmUuid:item.uuid,
								alarmName:item.paramsNote,
								alarmVale:'1'
							})
						}
					}
				})
			},
			toggleAll(){
				for(var k in this.config){
					for(var k1 in this.config[k].child){
						var value=this.config[k].child[k1];
						value.alarmVale=this.all;
					}
				}
			},
			switchIsEnableRealAlarm(){//切换是否启用实时告警
				this.show=!this.show;
				// this.init();
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	img{
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 0.3rem;
		cursor: pointer;
	}
	.realAlarmConfig{
		position: fixed;		
		z-index: 3;
		width: 12.5rem;
		top: 2.75rem;
		right: 1rem;
		bottom: 0px;
		margin-bottom: 1.042%;
		background: #001526;
		border: 1px solid #256283;
		
		.subtitle{
			line-height: 2.1rem;
			background: #004d81;
			text-align: center;
			color: #fdfeff;
		}
		.content{
			padding: 1rem 0px 0px  0.6rem;
			overflow: hidden;
		}
		.footer-btn{
			background: #002037;
			a{
				display: block;
				width: 6.6rem;
				line-height: 1.75rem;
				background: #008bdb;
				border-radius: 2px;
				text-align: center;
				color: #FFFFFF;
				margin: 1.25rem auto;
				cursor: pointer;
			}
		}
	}
</style>
<style lang="scss">
	.realAlarmConfig{
		.scroll{
			overflow: auto;
		}
		.section{
			margin-left: 0.5rem;
			margin-bottom: 0.5rem;
			.type{
				display: flex;
				color: #4E91AE;
				align-items: center;
				margin-bottom: 0.5rem;
				&:after{
					content: '';
					flex: 1;
					border-top: 1px dashed #0A3142;
					margin-left: 0.45rem;
				}
			}
		}
		.el-switch{
			display: block;
			text-align: right;
			margin-right: 0.6rem;
			&+.el-switch{
				margin-top: 1rem;
			}
			&.all{
				margin-bottom: 1rem;
			}
			&.el-switch.is-checked .el-switch__core{
				border-color:#15334C;
				background-color:#00FFFF;
				&::after{
					left: 100%;
					margin-left: -0.8rem;
				}
			}
			.el-switch__label{
				color: #43B6F5 !important;
				span{
					font-size: 0.8rem;
				}
			}
			.el-switch__core{
				width: 1.4rem !important;
				border-radius: 0.45rem;
				height: 0.8rem;
				background: #092b45;
				border: 1px solid #224664;
				box-sizing: content-box;
				&:after{
					width: 0.8rem;
					height: 0.8rem;
					top: 0;
					left: 0;
					background-color:#008BDB;
				}
			}
		}
	}
	
</style>
