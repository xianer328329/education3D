<template>
	<div id="">
		<!--录入突发事件和事件进展-->
		<el-dialog title="" center  class="emergency-modal history-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="800px">
			<div class="left">
				<el-form label-position="left" label-width="5rem" :inline="true" @submit.native.prevent>
					<el-form-item label="突发事件" >
						 <div class="h-self-select">
					    	<el-input placeholder="请输入内容" clearable v-model="keywords" @keyup.enter.native="getEvents">
							    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
						   </el-input>
					    </div>	   
					</el-form-item>
				</el-form>
				
				<div class="calendar-c">
					<calendar @refresh="refresh" @changeDate="changeDate" :events="events" v-if="curr!=''&&showDate" :key="curr+showDate"></calendar>
				</div>
				
				<p class="event-list-title" v-show="showDate">当日突发事件列表</p>
				
				<ul class="event-list" :class="{'searchlist':!showDate}" v-if="eventsList&&eventsList.length>0">
					<li v-for="(item,index) in eventsList" :key="index" :class="{active:list.uuid==item.uuid}" @click="list=item">
						<span class="index">{{index+1}}</span>
						<span class="time" :title="item.alarmTime">{{item.title}}</span>
					</li>
				</ul>
				<p class="empty empty1" v-else>暂无数据</p>
			</div>
			<div class="right">
				<div class="right-c">
					<template v-if="list">
						<p class="event-title">{{list.title}}</p>
						<ul class="h-EV-ul">
							<li>
								<label>死亡人数</label><i class="colorred fl">{{list.deadNum}}</i><span class="mr10 fl">人</span>
								<label>受伤人数</label><i class="coloryellow fl">{{list.injuredNum}}</i><span class="fl">人</span>
							</li>
							<li>
								<label>事件类型 </label><span>{{list.typeIds | changeType}}</span>
							</li>
							<li>
								<label>涉及人员 </label><span>{{list.involvePeoples | changePeople}}</span>
							</li>
							<li>
								<label>涉及人数</label><span> {{list.involveNum}}</span>
							</li>
							<li>
								<label>事发时间</label><span>{{list.eventTime}}</span>
							</li>
							<li>
								<label>事发地点</label><span>{{list.address}}{{list.addressRange}}</span>
							</li>
							<li>
								<label>是否启动过应急预案</label><span>{{list.planUuid?'是':'否'}}</span>
							</li>
							<template  v-if="list.planUuid">
								<li>
									<label>应急预案名称</label><span>{{list.plan.planName||'未获取到预案名称'}}</span>
								</li>
								<li>
									<label>应急预案启动时间</label><span>{{list.plan.planTime}}</span>
								<li>
									<label>应急预案终止时间</label><span>{{list.plan.finishedTime||'--'}}</span>
								</li>
								<li>
									<label>应急处理时长</label><span>{{list.plan | getHour(state)}}</span>
								</li>
							</template>
							<li>
								<label>事件描述</label><span>{{list.eventDesc||'无事件描述'}}</span>
							</li>
							<li>
								<label>相关录音</label>
								<ul class="video-list inline" v-if="list.soundList&&list.soundList.length>0">
							    	<li v-for="item in list.soundList">
							    		<span>>>{{item.callTime}}</span>
							    		<img src="../../../../../static/images/emergency/play_small.png" class="h-icon" @click="play(item)"/>
							    	</li>
							    </ul>
							    <span v-else>暂无</span>
							</li>
							<li>
								<label>处理结果</label><span v-if="list.status==1&&list.recordList&&list.recordList.length>0">{{list.recordList[0].recordDesc||'无'}}</span><span v-else>无</span>
							</li>
						</ul>
					</template>
					<p class="empty" v-else>暂无数据</p>
					
					<p class="event-list-title">处理过程记录</p>
					
					<template v-if="list">
						<el-collapse v-model="activeName" class="event-collapse" v-if="list.recordList&&list.recordList.length>0">
							<!--:class="{'noDrop':index%2==0}"-->
						  <el-collapse-item :name="index" v-for="(item,index) in list.recordList" :key="index" >
						  	<template slot="title">
						  		<span class="fr tip" v-if="list.status==1&&index==0">处理完成</span>
								<div class='title' :title="item.alarmTime">{{item.recordTime}}</div>
							</template>
						  	<div class="content">{{item.recordDesc||'无描述'}}</div>
						  </el-collapse-item>
						</el-collapse>
						<p class="empty empty1" v-else>暂无数据</p>
					</template>
					<p class="empty empty1" v-else>暂无数据</p>
				</div>
			</div>
		</el-dialog>
		<playAudio ref="play"></playAudio>
	</div>
</template>

<script>
	var timer;
	import playAudio from './playAudio.vue';
	import calendar from './calendar.vue';
	export default {
		name: 'historyRecord',//历史记录
		components:{
			calendar,//日历
			playAudio,//录音
		},
		data(){
			return{
				curr:'',
				keywords:'',//搜索关键字
				eventsList:[],
				events:[],//事件列表(下拉框)
				list:'',//当前选中事件
				activeName:[],
				currEvent:'',
				selDate:{},
				showDate:true,
				state:false,
			}
		},
		mounted(){
			var vm=this;
			this.getEvents();
		},
		methods:{
			search(){
				var vm=this;
				if(vm.showDate&&vm.keywords==''){
					return;
				}
				vm.getEvents();
			},
			//获取突发事件列表
			getEvents(){
				var vm=this;
				var params=new FormData();
				if(vm.keywords==''){
					vm.showDate=true;
					for (var i in vm.selDate){
						params.append(i,vm.selDate[i])
					}
				}else{
					vm.showDate=false;
					params.append('title',vm.keywords);
				}
				this.$axios.post('contingency/event/list', params).then((res) => {
					var data= res.eventList || [];
					if(!vm.showDate){
						this.eventsList=data;
					}else{
						this.events=data;	
					}
					if(data.length>0){
						vm.list=this.eventsList[0]
					}else{
						vm.list=''
					}
				})
			},
			//选择日期
			refresh(selDate){
				var vm=this;
				vm.selDate=selDate;
				vm.getEvents();
			},
			//切换日期
			changeDate(lists){
//				console.log(JSON.stringify(lists))
				this.eventsList=lists;
				if(lists.length>0){
					this.list=lists[0]
				}else{
					this.list=''
				}
			},
			//播放
			play(item){
				item.transcripts_url=item.transcriptsUrl;
				this.$refs.play.autoPlay(1,item);
			},
			close(){
				this.curr='';
				this.keywords='';
				this.list='';
				this.showDate=true;
			}
		},
		filters:{
			changeType(typeIds){
				var typeLits=[{
					name:'火情',
					type:1,
				},{
					name:'危化/ 爆炸',
					type:2,
				},{
					name:'设备损坏',
					type:3,
				},{
					name:'食品/中毒 ',
					type:4,
				},{
					name:'斗殴/伤人',
					type:5,
				},{
					name:'跳楼/自残',
					type:6,
				},{
					name:'公共安全',
					type:7,
				},{
					name:'其他',
					type:8,
				}];
				if(typeIds){
					var Ids=typeIds.split(','),arr=[];
					Ids.forEach(function(value){
						typeLits.forEach(function(item){
							if(item.type==value){
								arr.push(item.name);
							}
						});
					});
					return arr.join('、');	
				}
				return ''			
			},
			changePeople(typeIds){
				var typeLits=[{
					name:'学生',
					type:1
				},{
					name:'教师',
					type:2
				},{
					name:'社会人员',
					type:3
				}];
				if(typeIds){
					var Ids=typeIds.split(','),arr=[];
					Ids.forEach(function(value){
						typeLits.forEach(function(item){
							if(item.type==value){
								arr.push(item.name);
							}
						});
					});
					return arr.join('、');
				}
				return ''		
			},
			getHour(item,state){
				var timestart=new Date();
				if(item.finishedTime){
					timestart=new Date(Date.parse(item.finishedTime.replace(/-/g,"/"))).getTime()
				}
				var timeend =  new Date(Date.parse(item.planTime.replace(/-/g,"/"))).getTime();
				return Math.floor((timestart-timeend)/1000/3600/24)+'天'+Math.floor((timestart-timeend)/1000/3600%24)+'小时'+Math.floor((timestart-timeend)/1000/60%60)+'分钟'+Math.ceil((timestart-timeend)/1000%60)+'秒';
			},
		},
	}
</script>
<style lang="scss" scoped>
	.w265{
		width: 265px;
	}
	.empty{
		font-size: 1rem;
		text-align: center;
		line-height: 20rem;
	}
	.empty1{
		line-height: 5rem;
	}
	.left,.right{
		display: inline-block;
		width: 50%;
		box-sizing: border-box;
		padding:1rem 1.25rem;
		vertical-align: top;
		height: 600px;
		overflow: hidden;
		&.left{
			border-right: 1px solid rgba(74,172,219,1);
			.event-list-title{
				line-height:1.35rem;
				font-size: 0.8rem;
				color: #0ff;
				background:rgba(10,63,94,0.28);
				border:1px solid rgba(11,11,11,0.28);
				text-align: center;
				margin: 0.5rem 0px;
			}
			.event-list{
				max-height: 150px;
				overflow: auto;
				box-sizing: border-box;
				overflow-x: visible;
				&.searchlist{
					max-height:520px;
				}
				li{
					border-bottom:1px solid #014674;
					padding-bottom: 5px;
					margin-bottom: 0.4rem;
					white-space: nowrap;
					position: relative;
					cursor: pointer;
					&.active{
						border-bottom:1px solid #ED7703;
					}
					*{
						display: inline-block;
						color: #4AACDB;
						vertical-align: middle;
					}
					.index{
						width:1rem;
						height: 1rem;
						line-height:1rem;
						background:#00243D;
						border:1px solid #24698B;
						border-radius:2px;
						text-align: center;
						font-size: 0.7rem;
						margin-right: 0.6rem;
					}
					.time{
						font-size: 0.8rem;
						display: inline-block;
						width: 280px;
					}
					.h-icon{
						width: 20px;
						height: 20px;
						padding: 0px 5px;
						cursor: pointer;
						&.small{
							width:18px;
							height: 12px;
							padding-bottom: 3px;
						}
					}
					.new-type {
						background: url(../../../../../static/images/new2.png) no-repeat center;
						position: absolute;
						top: -5px;
						left: -20px;
						width: 30px;
						height: 15px;
					}
					.imgselect {
						display: flex;
						margin-top: 6px;
					}			
				}
			}
		}
		&.right{	
			padding-right: 0px;		
			.right-c{
				padding-right: 25px;
				height: 100%;
				overflow: auto;
			}
			.event-title{
				color: #0ff;
				font-size: 16px;
				text-align: center;
				line-height: 40px;
				margin-bottom: 12px;
			}
			.event-list-title{
				line-height:1.35rem;
				font-size: 0.8rem;
				/*color: #0ff;*/
				color:#75CBF2;
				background:rgba(10,63,94,0.28);
				border:1px solid rgba(11,11,11,0.28);
				text-align: center;
				margin: 1rem 0px;
			}
		}
	}
	.video-list{
		li{
			margin-bottom: 5px;
			padding: 0px;
			*{
				line-height: normal;
				display: inline-block;
			}
			span{
				
			}
			img{
				width: 20px;
				height: 20px;
				padding: 0px 5px;
				cursor: pointer;
			}
		}
	}
</style>

<style lang="scss">
	.history-modal.emergency-modal{
		.el-dialog{
			background: #021A2C;
			.el-dialog__header{
				padding: 0px;
			}
			.el-dialog__body{
				font-size: 0px;
				padding: 0px !important;
				overflow: hidden;
				.el-form{
					text-align: center;
					.el-form-item{
						margin-bottom: 0px;
						margin-right: 0px;
						.el-form-item__label{
							font-size: 0.8rem;
						}
					}
				}
				.calendar-c{
					margin-top: 0.5rem;
				}
				.el-collapse-item__header{
					display: block;
					position: relative;
					.tip{
						/*display: none;*/
						font-size: 16px;
						color: #00FFFF;
						background: #021A2C;
						position: relative;
						z-index: 1;
					}
					.el-icon-arrow-right{
						position: absolute;
						right: 0px;
						top: 0px;
					}
				}
				.noDrop{
					.tip{
						display: block;
					}
					.el-icon-arrow-right{
						display: none;
					}
				}
			}
		}
	}
</style>