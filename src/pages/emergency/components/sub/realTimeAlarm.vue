<template>
	<div class="realTimeAlarm">
		<ul class="event-list" @scroll="scroll" ref="events" v-if="lists.length>0">
			<li v-for="(item,index) in lists" :key="index" :class="{active:list.uuid==item.uuid}" @click="list=item">
				<i class="new-type" v-if="item.isReade==0||item.isReade==null"></i>
				<span class="index">{{index+1}}</span>
				<span class="time text-overflow" :title="item.callTime">{{item.callTime}}</span>
				<span class="phone text-overflow" :title="item.callNumber">{{item.callNumber}}</span>
				<!--<img src="../../../../../static/images/emergency/edit.png" class="h-icon" @click.stop="edit(2,item)"/>-->
				<img src="../../../../../static/images/emergency/play_small.png" class="h-icon" @click="play(item)"/>
				<el-dropdown placement="bottom" trigger="click">
					<img src="../../../../../static/images/emergency/down.png" class="h-icon small"/>
				    <el-dropdown-menu class="h-drop" slot="dropdown">
					    <el-dropdown-item><span class="nextli bule" @click="handelalarm(2,item)">误报</span></el-dropdown-item>
					    <el-dropdown-item><span class="nextli yell" @click="edit(3,item)">归档</span></el-dropdown-item>
				    </el-dropdown-menu>
				</el-dropdown>
			</li>
		</ul>
		<p class="h-empty" v-else>暂无数据</p>
		<div class="mt25 ml35 mr40">
			<a class="alarmBtn emergency-btn" @click="edit(1,{})"><img  src="../../../../../static/images/emergency/pen.png"/>新增突发事件</a>
			<a class="alarmBtn blue-btn fr " @click="lookRecord">查看历史记录>></a>
		</div>
		
		<div class="el-message-box__wrapper" style="z-index: 2007;" v-if="curr==2" @click="curr=''">
			<div class="el-message-box">
				<div class="el-message-box__header">
					<div class="el-message-box__title">
						<span>提示</span>
					</div>
					<button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="curr=''"><i class="el-message-box__close el-icon-close"></i></button>
				</div>
				<div class="el-message-box__content">
					<div class="el-message-box__status el-icon-warning"></div>
					<div class="el-message-box__message">
						<p>确认是否继续该操作?</p>
					</div>
				</div>
				<div class="el-message-box__btns">
					<button type="button" class="el-button el-button--default el-button--small" @click.stop="curr=''">
						<span>取消</span>
					</button>
			        <button type="button" class="el-button el-button--default el-button--small el-button--primary " @click.stop="handle">
			        	<span>确定</span>
			        </button>
				</div>
			</div>
		</div>
        
		<playAudio ref="play"></playAudio>
		<inputEmergency ref="emergency" @refresh="refresh"></inputEmergency>
		<historyRecord ref="historyRecord"></historyRecord>
	</div>
</template>

<script>
	var timer;
	import inputEmergency from './inputEmergency.vue';
	import playAudio from './playAudio.vue';
	import historyRecord from './historyRecord.vue';
	export default {
		name: 'realTimeAlarm',
		components:{
			playAudio,//播放录音
			inputEmergency,//突发事件
			historyRecord,//历史记录
		},
		data(){
			return{
				lists:[],
				list:{},
				curr:-1,
				currentPage:1,
				pageSize:20,
				total:0,
			}
		},
		mounted(){
			var vm=this;
			vm.getList();
		},
		beforeDestroy(){
			clearInterval(timer)
		},
		methods:{
			reload(){
				var vm=this;
				vm.$refs.emergency.curr='';
				vm.$refs.historyRecord.curr='';
				this.currentPage=1;
				vm.getList();
				vm.list={};
			},
			getList() { //获取数据
				var vm=this;
				var params={
					handleStatus:"0",//handleStatus  0未处理  1归档 2 误报
					pageSize:vm.pageSize+'',
					currentPage:vm.currentPage+''
				};
				this.$axios.post('contingency/realTimeAlert/voiceList', params).then((res) => {
					var data=res|| [];
					this.lists= this.currentPage==1?data:this.lists.concat(data);
					this.total=res.total || 0;
					if(this.lists.length>0){
//						this.list=this.lists[0];
						this.$emit('showNew',{index:0,state:true})
					}else{
						this.list={};
						this.$emit('showNew',{index:0,state:false})
					}
				})
			},
			//编辑突发事件
			edit(type,item){
				this.$refs.emergency.editEvent(type,item);
			},
			//播放
			play(item){
				var vm=this;
				this.$refs.play.autoPlay(1,item);
			},			
			handelalarm(curr,item){
				this.curr=curr;
				this.list=item;
			},
			//误报
			handle(){
				var vm=this;
				var params={
					handleStatus:'2',
					uuid:vm.list.uuid
				}
				this.$axios.post('contingency/realTimeAlert/alarmHandle', params).then((res) => {
					var data=res;
					vm.$message({
						message: '操作成功',
						type: 'success'
					});
					vm.getList();
					vm.curr='';
				});
			},
			//查看历史记录
			lookRecord(){
				this.$refs.historyRecord.curr=1;
			},
			refresh(){
				this.currentPage=1;
				this.getList();
			},
			//滚动加载
			scroll(){
				var vm=this;
				var events=vm.$refs.events;
//				console.log(events.scrollHeight-events.scrollTop-events.offsetHeight)
				if(events.scrollHeight-events.scrollTop-events.offsetHeight<=150&&this.currentPage<Math.ceil(this.total/this.pageSize)){
					this.currentPage++;
					this.getList();
				}
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.realTimeAlarm{
		padding-bottom: 25px;
	}
	.h-empty{
	    color: white;
	    text-align: center;
	    margin-top: 55px;
	    padding-bottom: 25px;
	}
	.event-list{
		padding:5px 15px 0px;
		padding-bottom: 0px;
		max-height: 724px;
		/*max-height:200px;*/
		overflow: auto;
		box-sizing: border-box;
		overflow-x: visible;
		li{
			border-bottom:1px solid rgba(1,70,116,1);
			padding-bottom: 3px;
			margin-top: 1rem;
			white-space: nowrap;
			position: relative;
			cursor: pointer;
			&.active{
				border-bottom:1px solid #ED7703;
			}
			*{
				display: inline-block;
				color: #00FFFF;
				vertical-align: middle;
			}
			.index{
				width:1rem;
				height: 1rem;
				line-height:1rem;
				background:rgba(0,36,61,1);
				border:1px solid rgba(36,105,139,1);
				border-radius:2px;
				text-align: center;
				font-size: 0.7rem;
				margin-right: 0.1rem;
			}
			.time{
				font-size: 0.8rem;
				display: inline-block;
				width: 10rem;
			}
			.phone{
				font-size: 0.8rem;
				display: inline-block;
				width:6rem;
				padding-right: 5px;
				text-align: center;
			}
			.h-icon{
				width: 1rem;
				height: 1rem;
				padding: 0.25rem 0.25rem;
				cursor: pointer;
				&.small{
					width:0.9rem;
					height: 0.6rem;
					padding-bottom: 0.2rem;
				}
			}
			.new-type {
				background: url(../../../../../static/images/new2.png) no-repeat center;
				position: absolute;
				top: -0.25rem;
				left: -0.5rem;
				width: 1.5rem;
				height: 0.75rem;
			}
			.imgselect {
				display: flex;
				margin-top: 6px;
			}			
		}
	}
</style>

<style lang="scss">
	.h-drop.el-dropdown-menu{
		 border: 1px solid #0ff;
	     background: #004e81;
	     &.el-popper[x-placement^=bottom] .popper__arrow{
	     	 border-bottom-color:#0ff;
	     	 &:after{
	     	 	 border-bottom-color:#004e81;
	     	 }
	     }
	     .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
			    background-color:transparent;
			    color: #66b1ff;
		}
		.nextli {
			display: inline-block;
			padding: 0.15rem 0px;
			line-height: 1rem;
			width: 3rem;
			text-align: center;
			color: #FFFFFF;
			border-radius: 2px;
			margin: 0.25rem 0px;			
			font-size: 0.7rem;
		}
		
		.bule {
			background: #0478B7;
		}
		
		.yell {
			background: #DB7202;
		}
	}
</style>