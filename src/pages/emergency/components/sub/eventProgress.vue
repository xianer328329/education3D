<template>
	<div>
		<div class="scroll-c">
			<ul class="h-EV-ul">
				<li>
					<label>死亡人数</label><i class="colorred fl">{{currEvent.deadNum}}</i><span class="mr10 fl">人</span>
					<label>受伤人数</label><i class="coloryellow fl">{{currEvent.injuredNum}}</i><span class="fl">人</span>
				</li>
				<li>
					<label>事件类型 </label><span>{{currEvent.typeIds | changeType}}</span>
				</li>
				<li>
					<label>涉及人员 </label><span>{{currEvent.involvePeoples | changePeople}}</span>
				</li>
				<li>
					<label>涉及人数</label><span> {{currEvent.involveNum}}</span>
				</li>
				<li>
					<label>事发时间</label><span>{{currEvent.eventTime}}</span>
				</li>
				<li>
					<label>事发地点</label><span>{{currEvent.address}}{{currEvent.addressRange}}</span>
				</li>
				<li>
					<label>事件描述</label><span>{{currEvent.eventDesc||'无事件描述'}}</span>
				</li>
				<li>
					<label>相关录音</label>
					<ul class="video-list inline" v-if="currEvent.soundList.length>0">
				    	<li v-for="item in currEvent.soundList">
				    		<span>>>{{item.callTime}}</span>
				    		<img src="../../../../../static/images/emergency/play_small.png" class="h-icon" @click="play(item)"/>
				    	</li>
				    </ul>
				    <span v-else>暂无录音</span>
				</li>
			</ul>
			
			<div class="clearfix event-title">
				<span>事件进展</span>
				<a  @click="edit(4,currEvent)">添加事件进展</a>
			</div>
			<el-collapse v-model="activeName" class="event-collapse">
			  <el-collapse-item :name="index" v-for="(item,index) in currEvent.recordList" :key="index">
			  	<template slot="title">
					<div class='title' :title="item.name">{{item.recordTime}}</div>
				</template>
			  	<div class="content">{{item.recordDesc||'无描述'}}</div>
			  </el-collapse-item>
			</el-collapse>
		</div>
		
		<div class="text-center mt25">
			<template  v-if="currEvent.planUuid">
				<div class="alarmBtn emergency-btn big" v-if="currEvent.status==0" @click="isFinish=true">终止预案</div>
			</template>
			<div class="alarmBtn success-btn big" @click="isFinish=true" v-else-if="currEvent.status!=1">处理完成</div>
		</div>
		
		<!--处理完成-->
		<el-dialog title="录入处理结果" center  class="emergency-modal" :modal-append-to-body="false" :visible="isFinish" :before-close="close" width="31rem">
			<el-form label-position="right" label-width="0px" >
				<el-form-item label="">
					<div class="has-length">
				    	 <el-input v-model="recordDesc" type="textarea" :autosize="{ minRows: 5, maxRows: 7}" placeholder="请输入处理结果" maxlength="500"> </el-input>
				    	<span>{{recordDesc.length}}/500</span>
				   </div>	   
				</el-form-item>			
			</el-form>
			<div class="mt25">
				<a class="alarmBtn success-btn big fr" @click="completedEvent">处理完成</a>
			</div>
		</el-dialog>
		
		<inputEmergency ref="emergency" @refresh="refresh"></inputEmergency>
		<playAudio ref="play"></playAudio>
	</div>
</template>

<script>
	import playAudio from './playAudio.vue';
	import inputEmergency from './inputEmergency.vue';
	export default {
		name: 'eventProgress',//事件进展
		components:{
			playAudio,//录音
			inputEmergency
		},
		props:{
			currEvent:Object
		},
		data(){
			return{
				isFinish:false,
				activeName:[],
				recordDesc:'',
			}
		},
		mounted(){
			var vm=this;
		},
		methods:{
			//处理完成
			completedEvent(){
				var vm=this;
				if(vm.recordDesc==''){
					vm.$message({
						message:'请输入处理结果',
						type: 'warning'
					});
					return;
				}
				var params={
					recordDesc:vm.recordDesc,
					uuid:vm.currEvent.uuid
				};
				this.$axios.post('contingency/event/completedEvent', params).then((res) => {
					var data=res;
//					if(data.code==1){
						vm.$message({
							message:'处理完成',
							type: 'success'
						});
						vm.close();
						vm.$emit('refresh');
//					}else{
//						vm.$message({
//							message:data.mess,
//							type: 'warning'
//						});
//					}
				})
			},
			//编辑
			edit(type,item){
				this.$refs.emergency.editEvent(type,item);
			},
			//播放
			play(item){
				item.transcripts_url=item.transcriptsUrl;
				this.$refs.play.autoPlay(1,item);
			},
			refresh(){
				this.$emit('refresh','keep');
			},
			close(){
				this.isFinish=false;
				this.recordDesc='';
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
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.event-title{
		margin-top: 1.5rem;
		span{
			font-size: 0.8rem;
			color:  #75CBF2;
		}
		a{
			font-size: 0.8rem;
			color: #ED7703;
			float: right;
			cursor: pointer;
			border-bottom: 1px solid #ED7703;
		}
	}
	.video-list{
		li{
			margin-bottom: 0.25rem;
			padding: 0px;
			*{
				line-height: normal;
				display: inline-block;
			}
			span{
				
			}
			img{
				width: 1rem;
				height: 1rem;
				padding: 0px 0.25rem;
				cursor: pointer;
			}
		}
	}
	.scroll-c{
		max-height: 25rem;
		overflow: auto;
		margin-right: -2rem;
		padding-right: 1.75rem;
	}
</style>
