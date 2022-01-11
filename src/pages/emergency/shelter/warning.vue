<template>
	<div>
		<el-dialog :title="title" class="rightModal" :visible="curr!=''" width="800px" :before-close="close" :modal-append-to-body="false" :modal="false" :close-on-click-modal="false">
			  <div class="table-box table-click noScroll">
			  	<div class="QueryParameters" v-show="curr==4">
					<h3 class="rollAall export"  @click='exp'>导出</h3>
					<div class="Z-butTab">
						<p v-for="(item,i) in moduleList" :key="i" :authName="item.paramsName" :authDesc="item.paramsNote">
							<span :class="{'Z-on':search.alarmType==item.type-1}" @click='showAlarmList(item.type)'>{{item.paramsNote}}</span>	
						</p>
						
					</div>
					<!-- <div class="Z-butTab">
						<p authDesc="紧急求助" authName="al_emergency_home_shelter_emerHelp" >
							<span :class="{'Z-on':search.alarmType==0}" v-on:click='showAlarmList(1)'>紧急求助</span>	
						</p>
						<p authDesc="设备异常" authName="al_emergency_home_shelter_deviceError" >
							<span :class="{'Z-on':search.alarmType==1}" v-on:click='showAlarmList(2)'>设备异常</span>	
						</p>
						<p authDesc="装备不足" authName="al_emergency_home_shelter_equeInsu" >
							<span :class="{'Z-on':search.alarmType==2}" v-on:click='showAlarmList(3)'>装备不足</span>	
						</p>
						
					</div> -->
					<ul class="Z-QueryList clearFix" id="data-box">
						<li>
							<p class="lable">状态</p>
							<select v-model='search.handleStatus'>
								<option value ="">请选择状态</option>
								<option value ="0">未处理</option>
								<option value ="1">已处理</option>
							</select>
						</li>
						<li>
							<span class="lable">告警日期</span>
							<div class="timeQuery">
								<two-selc @twodateTimeChange='twodateQuery'></two-selc>
							</div>
						</li>
						<li class="QueryBtn" v-on:click='getLists'>查询</li>
					</ul>
				</div>
				
				<el-table :data="lists"  v-loading="loading" element-loading-text="拼命加载中"
    			element-loading-background="rgba(0, 32, 55, 1)"  stripe  max-height="441px" @row-click="rowClick" :highlight-current-row="true">
					<template v-if="curr==1||curr==4">
						<el-table-column prop="alarmDesc" label="告警类型" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceName" label="告警方舱" :show-overflow-tooltip="true" v-if="!page"></el-table-column>
						<el-table-column prop="name" label="告警方舱" :show-overflow-tooltip="true" v-if="page"></el-table-column>
						<el-table-column prop="alarmTime" label="告警时间" :show-overflow-tooltip="true" width="180"></el-table-column>
						<el-table-column  label="状态" :show-overflow-tooltip="true">
							<template slot-scope="scope">
								<i v-if="scope.row.alarmStatus==0" style="color: #00ffff">未处理</i>
								<i v-else>已处理</i>
							</template>
						</el-table-column>
					</template>
					<template v-else-if="curr==2">
						<el-table-column prop="alarmDesc" label="告警事件" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceName" label="告警方舱" :show-overflow-tooltip="true" v-if="!page"></el-table-column>
						<el-table-column prop="name" label="告警方舱" :show-overflow-tooltip="true" v-if="page"></el-table-column>
						<el-table-column prop="alarmTime" label="告警时间"  width="180"></el-table-column>
						<el-table-column  label="状态" :show-overflow-tooltip="true">
							<template slot-scope="scope">
								<i v-if="scope.row.alarmStatus==0" style="color: #00ffff">未处理</i>
								<i v-else>已处理</i>
							</template>
						</el-table-column>
					</template>
					
					<template v-else-if="curr==3">
						<el-table-column prop="alarmDesc" label="告警事件" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="deviceName" label="告警方舱" :show-overflow-tooltip="true" v-if="!page"></el-table-column>
						<el-table-column prop="name" label="告警方舱" :show-overflow-tooltip="true" v-if="page"></el-table-column>
						<el-table-column prop="alarmTime" label="告警时间"  width="180"></el-table-column>
						<el-table-column  label="状态" :show-overflow-tooltip="true">
							<template slot-scope="scope">
								<i v-if="scope.row.alarmStatus==0" style="color: #00ffff">未处理</i>
								<i v-else>已处理</i>
							</template>
						</el-table-column>
					</template>
					<template v-else-if="curr==5">
						<el-table-column prop="alarmType" label="风险类型" :show-overflow-tooltip="true"width="150">
						</el-table-column>
						<el-table-column prop="alarmLeve" label="预警等级" :show-overflow-tooltip="true"  width="120">
							<template slot-scope="scope">
								<a class="button" :style="{'background-color':levelColor[scope.row.alarmLeve]?(levelColor[scope.row.alarmLeve]['bg']||'transparent'):'transparent','color':levelColor[scope.row.alarmLeve]?(levelColor[scope.row.alarmLeve]['color']||'white'):'white'}">{{scope.row.alarmLeve}}</a>
							</template>
						</el-table-column>
						<el-table-column prop="alarmTitle" label="预警标题" :show-overflow-tooltip="true" >
						</el-table-column>
						<el-table-column prop="pubsDate" label="发布时间"  width="180">
						</el-table-column>
						<el-table-column prop="alarmStatusName" label="查看" width="110">
							<template slot-scope="scope">
								<a class="text_icon home_look">详情</a>
							</template>
						</el-table-column>
					</template>
				</el-table>
				<div class="h-pager">
					<el-pagination class="pager" @current-change="getLists" :current-page.sync="search.currentPage" :page-size="search.pageSize" layout=" prev, jumper,total, next" :total="search.total">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
		
		<!--地图弹窗-->
		<div style="display: none;" >
			<div class="Z-mapPopout" ref="shelterMappop">
				<img class="mapLatAnimate" src="../../../../static/images/map/zb.png" alt="" />
				<div class="Z-mapPopoutF">
					<h5 class="PopoutTop">{{row.title}}<em v-show="!row.longitude">暂无该告警定位点</em></h5>
					<img class="closeInfoWindow closeMarker" src="../../../../static/images/Zgb.png" alt="" @click="closePop" />
					<div class="content">
						<ul>
							<li class="clearFix" v-for="(value,key) in row.datas" :key="key">
								<span v-if="key">{{key}}:</span>
								<p><i>{{value}}</i></p>
							</li>
						</ul>
					</div>
					<div class="footer">
						<template v-if="row.shelterAlarm||search.alarmType==0">
							<!-- 宣教应急页面的告警地图弹窗 -->
							<div class="item shelter-icon" @click="play(1,row)">
								<img src="../../../../static/images/home_picture.png" class="icon"/>
							</div>
							<div class="item shelter-icon" @click="play(2,row)">
								<img src="../../../../static/images/home_video.png" class="icon"/>
							</div>
							<div class="item shelter-icon" @click="linkageVideo(row)">联动视频</div>
						</template>
						<div class="item" @click="lookWeather(row)" v-if="row.curr==5">最近五日天气</div>
					</div>
				</div>
			</div>
		</div>
		<weather ref="weather"></weather>		
		<play-video ref="video"></play-video>
		<play-img ref="img"></play-img>
	</div>
</template>

<script>
	var infoWindow;
	import weather from './weather.vue';
	import playVideo from '../../shelter/components/video.vue';
	import playImg from '../../shelter/components/img.vue';
	import TwoSelc from '../../components/twodateSelection'
	export default{
		components:{
			TwoSelc,
			weather,
			playVideo,//视频
			playImg,//图片
			//addEvent,//紧急求助处理
		},
		data(){
			return {
				curr:'',
				title:'',
				req:'',//列表请求地址
				lists:[],
				row:{},//当前选中数据
				page:null,//是否是宣教应急页面
				loading:true,
				search:{
					total:0,
					currentPage:1,
					pageSize:10,
					alarmType:0,//告警类型0紧急求助|1设备异常|2装备不足
					handleStatus:'',//告警状态0未处理|1已处理
					alarmTimeStart:null,//告警时间开始时间
					alarmTimeEnd:null,//告警时间结束时间
					nowHandle:1,//当前未处理
					unitUuid:UNITID
				},
				levelColor:{
					'橙色':{
						bg:'#E09600',
					},
					'黄色':{
						bg:'#E1DB3B',
						color:'#333333'
					},
					'红色':{
						bg:'#FF2523',
					},
					'蓝色':{
						bg:'#357FDE'
					}
				},
			}
		},
		props:['moduleList'],
		mounted(){
			var vm=this;
			this.bus.$on('handleCloseMapPop', function(mes) {
				if(infoWindow) {
					oMaxmap.remove(infoWindow)
				}
			})
			this.bus.$on('shelterClosePop',function(){
				vm.curr=''
			})
		},
		methods:{
			loadOver(){
				this.loading=false;
			},
			loadBefore(){
				this.loading=true;
			},
			//获取表格列表
			getLists(){
				this.loadBefore();
				var vm=this;
				this.$axios.post(vm.req,vm.search).then((res) => {
					vm.lists=res.warningMessage||res.data||[];
					vm.search.total=res.total||0;
					this.loadOver();
				})
			},			
			//导出
			exp(){
				this.bus.exportExcel(this.req+'/export',this.search,this.title)
			},
			rowClick(row){
				this.markup(row)
			},
			//地图打标
			markup(row,type){
				try{
					var vm=this;
					var t=type||vm.search.alarmType;
					var otitle=""
					vm.page?otitle=vm.title:otitle=vm.title.split("--")[1];
					vm.row=Object.assign({title:otitle,curr:t,datas:{},shelterAlarm:this.curr==1&&this.page},row);
					if(row.longitude&&row.latitude){
						var point=new AMap.LngLat(row.longitude,row.latitude);
					}else{
						var point=new AMap.LngLat(mapLatJson.bigLongitude,mapLatJson.bigLatitude);
					}
					infoWindow = new AMap.InfoWindow({
					    isCustom: true,  //使用自定义窗体
					    content:vm.$refs.shelterMappop,
					    'anchor':'top-right',
					    offset: new AMap.Pixel(25,-40),
					    position: point,
						map:oMaxmap,
					});
					if(t==1){
						var datas={
							"告警方舱":row.deviceName||row.name,
							"告警时间":row.alarmTime
						}
					}else if(t==5){
						vm.row.title='详情';
						var datas={
							"":row.alarmDesc,
						}
					}else{
						var datas={
							"告警事件":row.alarmDesc,
							"告警方舱":row.deviceName||row.name,
							"方舱编号":row.deviceCode||row.code,
							"告警时间":row.alarmTime
						}
					}
					vm.row.datas=datas;
					oMaxmap.setZoomAndCenter(18, point);
				}catch(e){
					console.log(e.message)
				}
			},
			//关闭地图弹窗
			closePop(){
				infoWindow.close();
			},
			//处理紧急求助
			seekHelp(row,type){
				var vm=this;
				vm.$refs.addEvent.show(7,{alarmUuid:row.uuid,eventUuid:'',evenType:type});
			},
			//刷新数据
			refresh(){
				this.row.state=1;
				this.$emit('refresh');
				this.show(this.curr);
			},
			show(type,page){
				var vm=this;
				if(this.curr!=type){
					this.lists=[];
				}
				this.curr=type;
				
				if(page){
					this.page=page;
					this.search={
						currentPage:1,
						pageSize:10,
						unitUuid:UNITID,
					};
					switch (type){
					case 1:
						vm.title="紧急求助";
						vm.req='edu/home/emergencyCallingDetails';
						break;
					case 2:
						vm.title="设备异常";
						vm.req='edu/home/unitExceptionDetails';
						break;
					case 3: 
						vm.title="装备不足";
						vm.req='edu/home/equipmentShortagesDetails';
						break;
					case 5: 
						vm.title="风险预警";
						vm.req='edu/home/riskList';
						break;	
					default:
						break;
					}	
				}else{
					this.page=null;
					this.search={
						total:0,
						currentPage:1,
						pageSize:10,
						alarmType:type-1,//告警类型0紧急求助|1设备异常|2装备不足
						handleStatus:'',//告警状态0未处理|1已处理
						alarmTimeStart:null,//告警时间开始时间
						alarmTimeEnd:null,//告警时间结束时间
						nowHandle:1,//当前未处理
						unitUuid:UNITID
					};
				
					switch (type){
					case 1:
						vm.title="当日告警--紧急求助";
						break;
					case 2:
						vm.title="当日告警--设备异常";
						break;
					case 3: //
						vm.title="当日告警--装备不足";
						break;
					case 4: //
						vm.title="历史告警--紧急求助";
						this.search.nowHandle=0;
						this.search.alarmType=0;
						break;
					default:
						break;
					}	
					vm.req="edu/home/dqueryhistoryAlarm";
				}
				this.getLists();
			},
			showAlarmList(type){
				if(infoWindow) {
					oMaxmap.remove(infoWindow)
				}
				var vm=this;
				this.search.currentPage=1;
				switch (type){
					case 1:
						vm.title="历史告警--紧急求助";
						break;
					case 2:
						vm.title="历史告警--设备异常";
						break;
					case 3: //
						vm.title="历史告警--装备不足";
						break;
					default:
						break;
				}
				this.search.alarmType=type-1;
				vm.req="edu/home/dqueryhistoryAlarm";
				this.getLists();
			},

			close(){
				this.curr=''
			},
			twodateQuery(res){
				if(res){
					this.search.alarmTimeStart=res[0];
					this.search.alarmTimeEnd=res[1];
				}else{
					this.search.alarmTimeStart=null;
					this.search.alarmTimeEnd=null;
				}				
			},
			play(type,row){
				var vm=this;
				this.currRow=row;
				if(type==1){
					//图片
					this.$refs['img'].autoPlay({imgurl:row.alarmUimg})
				}else if(type==2){
					//回放视频
					this.$refs['video'].autoPlay({cameraUuid:row.cameraUuid,alarmTime:row.alarmTime,type:2,shelterUuid:row.shelterUuid})
				}
			},
			linkageVideo(row){//联动视频
				var params={
					type:1,
					title:row.title,
					alarmBigType:'shelter',
					uuid:row.uuid,//告警id
					deviceCode:row.deviceCode||row.code,
					deviceUuid:row.shelterUuid,
					buildName:row.deviceName||row.name,
					position:'',
					alarmTime:row.alarmTime,
					alarmDesc:row.alarmDesc
				}
				this.bus.$emit('addLinkageVideo',params);
			},
			//查看天气详情
			lookWeather(row){
				var vm=this;
				vm.$refs.weather.show(row)
			},
			getDic(dictType,dictName){
				var vm=this;
				var params={
					"dictType": dictType,
	  				"dictName": dictName
				}
				vm.$axios.post('system/dict/aqueryList',params).then((res) => {
						return res
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.footer{
		display: flex;
		cursor: pointer;
		.item{
			flex: 1;
			line-height: 2rem;
			background: #0478B7;
			text-align: center;
			color:#fff !important;
			&.shelter-icon{
				background-color: #004e81;
				border: 1px solid #171e32;
				color: #75CBF2 !important;
				img{
					width: 1.5rem;
				}
			}
			.icon{
				margin: 0.25rem auto;
			}
			.dropdown_list_c ul{
				top: 2rem;
			}
		}
	}
	.home_icon_c{
		height: 1rem;
		overflow: visible;
		margin-top: -5px;
	}
	.home_icon{
		display: inline-block;
		width: 30px;
		height: 30px;
		background-position:center;
		background-repeat:no-repeat;
		background-size:30px 30px;
	}
	.home_picture{
		/*background-image:url(../../../../static/images/home_picture.png);*/
	}
	.home_video{
		/*background-image:url(../../../../static/images/home_video.png);*/
	}
	.home_audio{
		/*background-image:url(../../../../static/images/home_audio.png);*/
	}
	.home_look{
		/*background-image:url(../../../../static/images/home_look.png);*/
	}
	.home_worksheet{
		/*background-image:url(../../../../static/images/home_worksheet.png);*/
	}
	.text_icon{
		display: inline-block;
		height: 30px;
		background-position:left center;
		background-repeat:no-repeat;
		background-size:30px 30px;
		padding-left: 30px;
		line-height: 30px;
		margin-top: -5px;
		margin-bottom: -5px;
	}
	.pager{
		*{
			color: #cdcede !important;
			border-color:#cdcede !important;
		}
	}
	.dropdown_list_c{
		position: relative;
		&:hover{
			ul{
				display: block;
			}
		}
		a{
			position: relative;
			color: #00ffff  !important ;
			&:after{
				content: '';
				display: inline-block;
				border:5px solid transparent;
				border-top-color: #00ffff ;
				margin-left: 5px;
			}
		}
		ul{
			background:rgba(0,78,129,0.8);
			
			border-radius:6px;
			padding: 0px 6px 6px;
			position: absolute;
			top: 30px;
			left: 50%;
			margin-left: -57px;
			z-index: 1;
			display:none; 
			&:before{
				content: '';
				position: absolute;
				border:8px solid transparent;
				border-bottom-color:rgba(0,78,129,0.8);
				border-top-width: 0px;
				left: 50%;
				top: -8px;
				transform: translateX(-50%);
			}
			&:after{
				content: '';
				position: absolute;
				border:8px solid transparent;
				border-bottom-color: rgba(0,78,129,0.8);
				border-top-width: 0px;
				left: 50%;
				top: -7px;
				transform: translateX(-50%);
			}
			li{
				font-size: 16px;
				width:100px;
				line-height:24px;
				min-height: auto;
				margin-top: 6px;
				background:#1b8cb8;
				border-radius:4px;
				color: white !important;
				&.bgYellow{
					background: #CD7127;
				}
				&.bgRed{
					background: #B62E2E;
				}
			}
		}
	}
</style>