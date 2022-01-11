<template>
	<div>
		<!--录入突发事件和事件进展-->
		<el-dialog :title="title" :close-on-click-modal="false" center  class="inputEmergency emergency-modal" :modal-append-to-body="false" :visible="curr!=''" :before-close="close" width="40rem">
			<!--归档选事件-->
			<div class="clearFix" v-if="curr==3">
				<el-form label-position="right" label-width="6rem" ref="progress" >
					<el-form-item label="关联事件">
						<div class="h-self-select event-select">
					    	<el-select v-model="currEvent" filterable  default-first-option :popper-append-to-body="false" placeholder="" value-key="uuid" @change="changeEvent">
							    <el-option :key="0" :value="0" label="请选择">请选择</el-option>
							    <el-option  v-for="item in events" :key="item.uuid" :label="item.title" :value="item"></el-option>
						   </el-select>
					    </div>
					    <p class="tip">注、若无关联可选事件，请在下面录入新的突发事件</p>
					</el-form-item>
					
				</el-form>
			</div>
			
			<!--突发事件基本信息-->
			<el-form label-position="right" :rules="rules" label-width="6rem" :model="list" ref="eventForm" class="clearFix">
				<!--事件进展-->
				<template v-if="curr==4">
					<el-form-item label="事件进展"  prop="recordDesc">
						<div class="has-length">
					    	 <el-input type="textarea"  v-model="list.recordDesc" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" maxlength="200"> </el-input>
					    	<span>0/200</span>
					   </div>			   
					</el-form-item>
					<el-form-item label="受伤人数" class="is-required half"  prop="injuredNum">
					    <div class="people-num">
					    	<el-input  v-model.number="list.injuredNum" :controls="false"  class="h-input-number"></el-input><span class="unit">人</span>
					    </div>
					</el-form-item>
					<el-form-item label="死亡人数" class="is-required half"  prop="deadNum">
					    <div class="people-num">
					    	<el-input v-model.number="list.deadNum" :controls="false"  class="h-input-number"></el-input><span class="unit">人</span>
					    </div>
					</el-form-item>
				</template>

				<!--折叠面板标题-->
				<el-form-item label="" class="has-desc is-required"  v-if="curr==4||curr==3">
				    <div class="clearFix border-bottom mt30 mb20 text-center" :class="{active:show}">
				    	<!--:class="{'fr':curr==4||curr==3}"-->
						<a class="alarmBtn blue-btn underline"  @click="toggleEvent">{{subTitle}}<i></i></a>
					</div>
				</el-form-item>
				
				<el-form-item label="事件类型" class="has-desc is-required" prop="typeIds" v-show="show">
				    <el-checkbox-group v-model="list.typeIds" >
				      <el-checkbox-button  v-for="(item,index) in typeLits" :label="item.type" :key="item.name" class="check-btn">{{item.name}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="涉及人员" class="has-desc is-required half" prop="involvePeoples" v-show="show">
				    <el-checkbox-group v-model="list.involvePeoples">
				      <el-checkbox-button :label="item.type" :key="item.type" v-for="(item,index) in peopleLists" class="check-btn">{{item.name}}</el-checkbox-button>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="涉及人数" class="is-required half " prop="involveNum" v-show="show">
				    <div class="h-self-select">
				    	<el-select v-model="list.involveNum" class="w136" filterable allow-create default-first-option :popper-append-to-body="false" placeholder="">
						    <el-option  v-for="item in numbers" :key="item.name" :label="item.name" :value="item.value">
						    </el-option>
					   </el-select>
				    </div>
				    <span class="unit">人</span>
				</el-form-item>
				<el-form-item label="受伤人数" class="is-required half" v-if="curr!=4" v-show="show" prop="injuredNum">
				    <div class="people-num">
				    	<el-input  v-model.number="list.injuredNum" :controls="false"  class="h-input-number"></el-input><span class="unit">人</span>
				    </div>
				</el-form-item>
				<el-form-item label="死亡人数" class="is-required half" v-if="curr!=4" v-show="show" prop="deadNum">
				    <div class="people-num">
				    	<el-input v-model.number="list.deadNum" :controls="false"  class="h-input-number"></el-input><span class="unit">人</span>
				    </div>
				</el-form-item>
				<el-form-item label="地点" class="is-required half" prop="address" v-show="show">
				    <!--<div class="h-self-select">
				    	<el-select v-model="list.address" filterable allow-create default-first-option :popper-append-to-body="false" placeholder="">
						    <el-option  v-for="item in places" :key="item.name" :label="item.name" :value="item.name">
						    </el-option>
					   </el-select>
				    </div>-->
				    <div class="h-self-select">
				    	<el-input v-model="list.address" placeholder=""> </el-input>
				    </div>
				    <el-radio-group v-model="list.addressRange" class="addressRange">
				      <el-radio-button label="楼内"  class="check-btn mb-none">楼内</el-radio-button>
				      <el-radio-button label="附近" class="check-btn mb-none">附近</el-radio-button>
				    </el-radio-group>
				</el-form-item>
				
				<el-form-item label="事件时间" class="is-required" prop="eventTime" v-show="show">
				   <el-date-picker v-model="list.eventTime" :picker-options="pickerOptions" type="datetime" :editable="false" placeholder="" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
				</el-form-item>
				
				<el-form-item label="关联录音"  v-show="show">
				    <div class="h-self-select  vertical-bottom">
				    	<el-select id="audios" v-model="list.sounds" clearable filterable  default-first-option :popper-append-to-body="false" placeholder=""  value-key="uuid">
				    		<el-option :key="0" :value="0" label="请选择">请选择</el-option>
						    <el-option  v-for="item in audios" :key="item.uuid" :value="item" :label="item.callTime"></el-option>
					   </el-select>
				    </div>
				    <a class="alarmBtn success-btn vertical-bottom" @click="addAudio">添加</a>
				    <ul class="video-list">
				    	<li v-for="(item,index) in selAudios">
				    		<span>>>{{item.callTime}}</span>
				    		<img src="../../../../../static/images/emergency/play_small.png" class="h-icon" @click="play(item)"/>
				    		<a @click="delAudio(index)">删除</a>
				    	</li>
				    </ul>
				</el-form-item>
				<el-form-item label="事件标题" class="is-required" prop="title" v-show="show">
				    <div class="has-length">
				    	<el-input v-model="list.title" placeholder="" maxlength="20"> </el-input>
				    	<span>{{list.title?list.title.length:0}}/20</span>
				    </div>
				</el-form-item>
				<el-form-item label="事件描述" v-show="show">
					<div class="has-length">
				    	 <el-input v-model="list.eventDesc" type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="" maxlength="200"> </el-input>
				    	<span>{{list.eventDesc?list.eventDesc.length:0}}/200</span>
				   </div>			   
				</el-form-item>
			</el-form>
			<span slot="footer">
			   <el-button @click="close">取消</el-button>
			   <el-button type="primary" @click="save" :loading="loading">保存</el-button>
			 </span>
		</el-dialog>
		<playAudio ref="play"></playAudio>
	</div>
</template>

<script>
	var timer;
	import playAudio from './playAudio.vue';
	export default {
		name: 'inputEmergency',
		components:{
			playAudio,//播放录音
		},
		data(){
			return{
				title:'录入突发事件',
				subTitle:'修改突发事件基本信息',
				events:[],//事件列表
				currEvent:0,//当前选中事件
				list:{},
				fileAudio:{},//归档音频
				loading:false,
				resetForm:{
					typeIds:[],
					sounds:0,
					involvePeoples:[],
					addressRange:'楼内',
					involveNum:2,
					injuredNum:'',
					deadNum:''
				},
				typeLits:[{
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
				}],
				peopleLists:[{
					name:'学生',
					type:1
				},{
					name:'教师',
					type:2
				},{
					name:'社会人员',
					type:3
				}],
				numbers:[{
					name:'2',
					value:2
				},{
					name:'5',
					value:5
				},{
					name:'10',
					value:10
				},{
					name:'15',
					value:15
				}],
//				places:[{
//					name:'学生1号公寓'
//				}],
				audios:[],//音频列表
				selAudios:[],
				curr:'',//类型
				show:true,
				rules:{
					 typeIds: [
			            {type: 'array',required: true, message: '', trigger: 'change'},
			         ],
			         involvePeoples: [
			            {type: 'array',required: true, message: '', trigger: 'change'},
			         ],
			         involveNum: [
			            {required: true, message: '', trigger: 'change'},
			         ],
			         injuredNum: [
			            {required: true, message: ''},
			            {type: 'number', message: ''}
			         ],
			         deadNum: [
			            {required: true, message: ''},
			            { type: 'number', message: ''}
			         ],
			         address: [
			            {required: true, message: '', trigger: 'change'},
			         ],
			         eventTime: [
			            {required: true, message: '', trigger: 'change'},
			         ],
			         title:[
			            {required: true, message: ''},
			         ],
				},
				pickerOptions: {
		          disabledDate(time) {
		            return time.getTime() > Date.now();
		          },
		       }
			}
		},
		mounted(){
			var vm=this;
			vm.list=$.extend(true,{},vm.resetForm);
		},
		methods:{
			//编辑突发事件，1新增，2修改,3归档，4添加事件进程,5无应急事件启动预案
			editEvent(type,item){
				var vm=this;
				if(vm.$refs.eventForm){
					vm.$refs.eventForm.resetFields();
				}
				vm.getAudios();
				this.curr=type;
				switch (vm.curr){
					case 1:
						vm.show=true;
						vm.list=$.extend(true,{},vm.resetForm,item);
						vm.title='录入突发事件';
						break;
					case 3:
						vm.show=false;
						vm.list=$.extend(true,{},vm.resetForm);
						vm.title='归档';
						vm.subTitle='录入突发事件基本信息';
						vm.getEvents();
						vm.fileAudio=[item];
						vm.selAudios.push(item);
						break;
					case 4:
						vm.show=false;
						vm.title='添加事件进展';
						vm.fileAudio=[];
						vm.currEvent=item;
						vm.changeEvent();
						break;
					default:
						vm.show=true;
						vm.list=$.extend(true,{},vm.resetForm,item);
						vm.title='录入突发事件';
						vm.subTitle='修改突发事件基本信息';
						break;
				}
//				console.log(JSON.stringify(vm.list))
			},
			save(){
				var vm=this;
				 this.$refs.eventForm.validate((valid) => {
		          if (valid) {
		          		vm.loading=true;
	            		var obj=$.extend(true,{},vm.list);
		            	obj.typeIds=obj.typeIds.join(',');
		            	obj.involvePeoples=obj.involvePeoples.join(',');
		            	var arr=[];
		            	this.selAudios.forEach(function(item){
		            		arr.push(item.uuid);
		            	});
		            	obj.sounds=arr.join(',');
		            	var req=vm.curr==4?'contingency/event/addRecord':'contingency/event/add';
		            	delete obj.soundList;
		            	delete obj.recordList;
	            		delete obj.plan;
	            		delete obj.createTime;
	            		delete obj.planTime;
	            		delete obj.status;
	            		if(vm.curr!=5){
	            			delete obj.planUuid;
	            		}
	            		clearTimeout(timer);
	            		timer=setTimeout(function(){
	            			vm.loading=false;
	            		},10000)
//		            	console.log(JSON.stringify(obj));
	            		this.$axios.post(req, obj).then((res) => {
	            			clearTimeout(timer);
	            			vm.loading=false;
							var data=res||{};
							vm.close();
							vm.$message({
								message: '操作成功',
								type: 'success'
							});
							try{
								vm.$emit('refresh');
							}catch(e){}
						})
		          } else {
		          	vm.show=true;
		            vm.$message({
						message:'信息填写不完整',
						type: 'warning'
					});
		          }
		        });
			},
			//获取突发事件列表
			getEvents(){
				var vm=this;
				var params=new FormData();
				params.append('status',0)
				this.$axios.post('contingency/event/list', params).then((res) => {
					this.events= res.eventList || [];		
				})
			},
			//选择突发事件
			changeEvent(){
				var vm=this;
				if(vm.currEvent==0){
					vm.subTitle='录入突发事件基本信息';
					this.$refs.eventForm.resetFields();
					vm.selAudios=[].concat(vm.fileAudio);
				}else{
					vm.subTitle='修改突发事件基本信息';
					vm.show=vm.curr==4?false:true;
					var obj=$.extend(true,{},vm.currEvent);;
					obj.typeIds=obj.typeIds.split(',');
					obj.typeIds=obj.typeIds.map(function(item){
						return item*1;
					});
					obj.involvePeoples=obj.involvePeoples.split(',');
					obj.involvePeoples=obj.involvePeoples.map(function(item){
						return item*1;
					});
					obj.sounds=0;
					vm.selAudios=obj.soundList;
					if(vm.fileAudio.length>0){
						var state=true;
						this.selAudios.forEach(function(value){
							if(vm.fileAudio[0].uuid==value.uuid){
								state=false;
							}
						});
						if(state){
							this.selAudios=this.selAudios.concat(vm.fileAudio);
						}
					}
//					console.log(JSON.stringify(vm.currEvent))
					vm.list=obj;
				}
			},
			 //获取音频
			getAudios() {
				var params={
					handleStatus:"0",//handleStatus  0未处理  1归档 2 误报
				};
				this.$axios.post('contingency/realTimeAlert/voiceList', params).then((res) => {
					this.audios = res|| [];	
					this.list.sounds=0;
				})
			},
			//选择音频
			addAudio(){
				var vm=this;
				if(this.list.sounds!=0){
					var state=true;
					this.selAudios.forEach(function(value){
						if(vm.list.sounds.uuid==value.uuid){
							state=false;
						}
					});
					if(state){
						this.selAudios.push(this.list.sounds);
					}
					this.list.sounds=0;
				}
			},
			//删除音频
			delAudio(index){
				this.selAudios.splice(index,1)
			},
			//播放
			play(item){
				this.$refs.play.autoPlay(1,item);
			},
			toggleEvent(){
				this.show=!this.show;
			},
			close(){
				var vm=this;
				try{
					this.curr='';
					this.selAudios=[];
					this.currEvent=0;
					this.$refs.eventForm.resetFields();
				}catch(e){
					console.log(e.message)
				}
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.half{
		display: inline-block;
		position: relative;
	}
	.people-num{
		position: relative;
		margin-right: 75px;
		width: 107px;
	}
	.unit{
		position: absolute;
		font-size: 0.7rem;
		color: #75CBF2;
		right: -20px;
		bottom: 0px;
		line-height:30px;
	}
	.el-button{
		min-width: 5.5rem;
		padding: 0.6rem 1rem;
	}
</style>
<style lang="scss">
	.inputEmergency{
		.el-dialog{
			min-width: 580px;
		}
		.el-form-item{
			margin-bottom: 1rem;
		}
		.el-form-item__label{
			font-size: 0.8rem;
			line-height: 30px;
			padding: 0 0.6rem 0 0;
		}
		.el-input__inner, .el-textarea__inner{
			height: 30px;
			line-height: 30px;
			font-size: 0.8rem;
			background: #002037;
			border:1px solid rgba(74,172,219,1);
			overflow: hidden;
			color: #EEEEEE;
		}
		.el-form-item__content{
			line-height: 1.5rem;
		}
		.el-input__icon{
			line-height: 1.4rem;
		}
		.el-input__suffix{
			border: 1px solid rgba(74,172,219,1);
			box-sizing: border-box;
			height: 30px;
			border-top-right-radius: 2px;
			border-bottom-right-radius: 2px;
		}
		.w136{
			width: 6.8rem;
		}
		.event-select .el-scrollbar__wrap{
			max-height: 145px !important;
		}
		.tip{
			color: #EEEEEE;
			font-size: 0.7rem;
			margin-top: 0.5rem;
		}
		.el-date-editor.el-input, .el-date-editor.el-input__inner{
			width: 242px;
		}
		.el-date-editor .el-input__inner{
			padding-left: 15px;
		}
		.border-bottom{
			margin-left: -4.75rem;
			margin-bottom: 0.5rem;
			margin-top: 0.5rem;
			&.active{
				border-bottom: 1px solid #0478B7;
				i{
					transform: rotate(-90deg);
				}
			}
		}
		.underline{
			/*text-decoration: underline;*/
			cursor: pointer;
			i{
				display: inline-block;
				margin-left: 3px;
				width: 11px;
				height: 11px;
				background: url(../../../../../static/images/emergency/arrow_right.png);
				transform: rotate(90deg);
			}
		}
		.success-btn{
			min-width: 60px;
		    padding: 0px 10px;
		    line-height: 30px;
		    height: 30px;
		    vertical-align: baseline;
		}
		.vertical-bottom{
			&,input{
				vertical-align: bottom;
			}
		}
		.addressRange .check-btn{
			margin-top: 0px;
			.el-radio-button__inner{
				font-size: 0.8rem;
				padding: 0px 7px;
				line-height:30px;
			}
		}
		.video-list{
			margin-bottom: -0.5rem;
			li{
				margin-top:5px;
				*{
					line-height: normal;
					display: inline-block;
					vertical-align: middle;
				}
				a{
					cursor: pointer;
					color: #00FFFF;
					font-size: 0.7rem;
				}
				span{
					font-size: 0.7rem;
					color: #75CBF2;
				}
				img{
					width: 1rem;
					height: 1rem;
					padding: 0px 5px;
					cursor: pointer;
				}
			}
		}
	}
	.check-btn{
		margin-right: 0.3rem;
		margin-bottom: 0.25rem;
		margin-top: 0.25rem;
		user-select: none;
		.el-checkbox-button__inner,.el-radio-button__inner{
			display: inline-block;
			min-width: 4rem;
			text-align: center;
			color: #999999;
			font-size: 0.8rem;
			padding: 0px 0.35rem;
			box-sizing: border-box;
			background:rgba(0,54,92,1);
			border-radius:2px !important;
			line-height:1.5rem;
			border: none !important;
			box-shadow: none !important;
			outline: none;
			box-shadow: none;
		}
		&.is-checked .el-checkbox-button__inner,&.is-checked .el-radio-button__inner{
			color:white;
			background-color: #0478B7;
		}
		.el-radio-button__orig-radio:checked+.el-radio-button__inner{
			color:white;
			background-color: #0478B7;
		}
	}
	
	.has-desc{
		margin-bottom: 0.75rem;
		margin-right: 0px !important;
		.el-checkbox-group{
			position: relative;
		}
		.el-form-item__label{
			position:relative; 
			/*top: -6px;*/
			&:after{ 
				content:'(可多选)';
				color: #3B5B72;
				font-size: 0.8rem;
				cursor: pointer;
				position: absolute;
				bottom: -1.1rem;
				right: 0.6rem;
				width: 4.4rem;
				white-space: nowrap;
				text-align: center;
			}
		}
		&.is-required .el-form-item__label:after{
			width: 3.8rem;
		}
	}
</style>
