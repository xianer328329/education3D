<template>
	<el-dialog  title="学年回顾" center  class="review-modal"  :modal-append-to-body="false" :modal="false" :visible="curr!=''" :before-close="close">
	<div class="sjl">
		<!--<h5>学年回顾<img @click="close()" src="../../../static/images/Zgb.png" /></h5>-->
		<div class="timeTab">
			<h6 @click="showList">{{year}}-{{year+1}}学年</h6>
			<transition enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutDown">

				<div id="year-month" v-show="yearShow">
					<p id="yearT">
						<i :class="{'Z-on':item==year}" :key="item" @click="secYear(item)" v-for="(item,index) of yearArr">{{item}}</i>
					</p>
					<button class="Z-btn" @click="reviewInquire">确定</button>
				</div>
			</transition>
		</div>
		<div class="section">
			<div class="loadinghint" v-show="loadingshow||nodatashow">
				<div class="loading" v-show="loadingshow"><img src="../../../static/images/gif.png" /><i>数据加载中...</i></div>
				<div class="nodataHint" v-show="nodatashow">暂无数据</div>
			</div>
			<section id="cd-timeline" class="cd-container" v-show="timelineshow">
				<div class="cd-top"></div>
				<div class="cd-bottom"></div>
			</section>
			<div class="about-history" id="fzlc">
				<div class="about-title">板块接入时间轴</div>
				<div class="no-join">
					<div class="desc desc-top">
						<p>考培管理</p>
						<p>能耗安全</p>
						<p>能源监管</p>
					</div>
					<div class="desc desc-bottom">
						<p>校车监管</p>
						<p>危化监管</p>
						<p>食品安全</p>
					</div>
				</div>
				<div class="about-history-list">
					<div class="flex-viewport" style="overflow: hidden; position: relative;">
						<ul class="slides clearfix list" ref="flexDirection" style="width: 2600%; transition-duration: 0s; transform: translate3d(0px, 0px, 0px);">
							<li v-for="(data,index) of joinList" :key="index">
								<div class="item">
									<h3>{{data.joinDate}}</h3>
									<div class="dottedLine"></div>
									<div class="desc">
										<p v-for="(name,index) of data.moudleName" :key="name+index">{{name}}</p>
									</div>
								</div>
							</li>
							<li style="width: 150px; float: left; display: block;"></li>
						</ul>
					</div>
					<ul class="flex-direction-nav">
						<li class="flex-nav-prev">
							<em class="flex-prev" @click="navprev(1)" >&lt;</em>
						</li>
						<li class="flex-nav-next">
							<em class="flex-next" @click="navprev(2)">&gt;</em>
						</li>
					</ul>
				</div>

			</div>
		</div>

	</div>
	</el-dialog>
</template>
<script>
	import '../../../static/js/jquery_flexslider.js'
	var outTime
	export default {
		name: 'YearReview',
		data() {
			return {
				curr: '',
				yearShow: false,
				loadingshow: true,
				nodatashow: false,
				timelineshow: false,
				year: "",
				yearArr: [],
				firmJson: {}, //柱状图数据 消防
				carAlarm: {}, //柱状图数据  车辆违法数据
				carEnter: {}, //折线图 车辆驶入数据
				haodian: {}, //柱状图数据 耗电
				haoS: {}, //柱状图数据 耗水
				backLate: {}, //双向柱状图  晚出晚归
				arrType: [],
				joinList: [], //模块接入时间列表
				firmMax: 0, //消防最大值
				carAlarmMax: 0, //车辆违法数据最大值
				haodianMax: 0, //耗电最大值
				haoSMax: 0, //耗水最大值
				flexOindex:0
			}
		},
		methods: {
			close() {
				this.curr ="";
				window.clearTimeout(outTime);
			},
			showList() {
				this.yearShow = !this.yearShow;
			},
			secYear(year) {
				this.year = year
			},
			reviewInquire() {
				this.yearShow = false;
				this.review()
			},
			review() { //学年回顾请求接口
				this.loadingshow = true;
				this.nodatashow = false;
				this.timelineshow = false;
				var _this=this;
				var parameter = new FormData();
				parameter.append('year', this.year);
				this.$axios.post('/home/review', parameter) //车辆告警列表请求
					.then(function(res){
						_this.reviewSucc(res)
					});
			},
			reviewSucc(res) {
				var data = res;
				var obj = "";
				var cdName=""
				if(res) {
					var arr = ["<div class='cd-top'></div><div class='cd-bottom'></div>"];
					for(var i = 0; i < res.length; i++) {
						this.arrType.push(res[i].type);
						var icon='';
						if(res[i].type == 1) { //火警
							cdName="消防火警";
							icon="fire";
							obj = "<div class='cd-timeline-content'>\
								<h2>消防火警报警量为本学年最高值<i class='sum'>" + res[i].value + "</i>次</h2>\
								<div class='cartogram' id='fireAlarm'></div>\
							</div>";
							this.firmJson = this.objectBar();
							this.firmJson.name = '火警';
							this.firmMax = res[i].value;
							this.addBarData(res[i].list, this.firmJson, res[i].date, 5, 1);
						} else if(res[i].type == 2) { //车辆驶入数据
							cdName="入校车辆";
							icon="car";
							obj = "<div class='cd-timeline-content'>\
								<h2>单日驶入校园车辆为本学年最高值<i class='sum'>" + res[i].value + "</i>辆次</h2>\
								<div class='cartogram' id='carEnter'></div>\
							</div>";
							this.carEnter = this.objectLine()
							this.carEnter.name = '入校车辆';
							this.addBarData(res[i].list, this.carEnter, res[i].date, 15, 1)
						} else if(res[i].type == 3) { //车辆布控数据
							cdName="联防布控车辆";
							icon="controlCar";
							obj = "<div class='cd-timeline-content'>\
								<h2>发现联防布控车辆<i class='license'>" + res[i].value + "</i>驶入校园 <i class='sum'>" + res[i].count + "</i>次</h2>\
								<p>最后一次驶入时间为" + res[i].lastDate + "</p>\
							</div>";
						} else if(res[i].type == 4) { //人脸布控数据
							cdName="联防布控人员";
							obj = "<div class='cd-timeline-content'>\
								<h2>发现联防布控人员<i class='license'>" + res[i].value + "</i>进入校园</h2>\
							</div>";
						} else if(res[i].type == 5) { //人员晚出晚归数据
							cdName="晚出晚归";
							obj = "<div class='cd-timeline-content'>\
								<h2>晚出晚归学生为本学年最多<i class='sum'>" + res[i].value + "</i>人·次</h2>\
								<div class='cartogram' id='backLate'></div>\
							</div>";
							this.backLate = this.objectBarTwo()
							this.backLate.name = "晚出晚归";
							this.addBarData(res[i].list, this.backLate, res[i].date, 15, 2)
						} else if(res[i].type == 6) { //车辆违法数据
							cdName="车辆违法";
							obj = "<div class='cd-timeline-content'>\
								<h2>校内车辆违法告警次数为本学年峰值<i class='sum'>" + res[i].value + "</i>次</h2>\
								<div class='cartogram' id='carAlarm'></div>\
							</div>";
							this.carAlarm = this.objectLine();
							this.carAlarm.name = '违法车辆';
							this.carAlarmMax = res[i].value;
							this.addBarData(res[i].list, this.carAlarm, res[i].date, 15, 1)
						} else if(res[i].type == 7) { //耗电
							cdName="耗电";
							obj = "<div class='cd-timeline-content'>\
								<h2>耗电量全学年最高<i class='sum'>" + res[i].value + "</i>kwh</h2>\
								<div class='cartogram' id='haodian'></div>\
							</div>";
							this.haodian = this.objectBar();
							this.haodian.name = '耗电';
							this.haodianMax = res[i].value;
							this.addBarData(res[i].list, this.haodian, res[i].date, 5, 1)
						} else if(res[i].type == 8) { //耗水
							cdName="耗水";
							obj = "<div class='cd-timeline-content'>\
								<h2>耗水量全学年最高<i class='sum'>" + res[i].value + "</i>m³</h2>\
								<div class='cartogram' id='haoS'></div>\
							</div>";
							this.haoS = this.objectBar();
							this.haoS.name = ['耗水'];
							this.haoSMax = res[i].value;
							this.addBarData(res[i].list, this.haoS, res[i].date, 5, 1)
						} else { //突发
							//	obj="<div class='cd-timeline-content'>\
							//<h2>突发学生斗殴<i class='sum'><em>伤</em>3</i>人<span><em>死亡</em>0</span>人</h2>\
							//<p>逸夫楼 二楼过道</p>\
							//	</div>";
						}
						var time = res[i].date;
						var str = "<div class='cd-timeline-block'>\
								<div class='cd-timeline-img'>\
									<p class='cd-p'>\
										<i class='iconTemp "+icon+"'></i>\
										<i class='cd-name'>"+cdName+"</i>\
									</p>\
									<span class='cd-date'>" + time + "</span>\
								</div>" + obj + "</div>";
						arr.push(str);
					}
					this.loadingshow = false;
					$('#cd-timeline').html(arr.join(''));
					this.timelineshow = true;
				} else {
					this.loadingshow = false;
					this.nodatashow = true;
					this.timelineshow = false;
				}

				for(var j = 0; j < this.arrType.length; j++) {
					if(this.arrType[j] == 1) {
						this.superviseData('fireAlarm', this.firmJson, this.firmMax) //火警
					} else if(this.arrType[j] == 2) {
						this.LineDatacar('carEnter', this.carEnter) //车辆驶入
					} else if(this.arrType[j] == 5) {
						this.barBData('backLate', this.backLate) //晚出晚归
					} else if(this.arrType[j] == 6) {
						this.LineDatacar('carAlarm', this.carAlarm, ) //车辆违法数据
					} else if(this.arrType[j] == 7) {
						this.superviseData('haodian', this.haodian, this.haodianMax) //耗电
					} else if(this.arrType[j] == 8) {
						this.superviseData('haoS', this.haoS, this.haoSMax) //耗水
					}
				}
			},
			superviseData(Id, superviseJson, oMax) { //柱状图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(bar3({...superviseJson}, oMax), true);
					allCharts.push(myChart)
				})
			},
			LineDatacar(Id, carData) { //折线图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(LineChartV(carData), true);
					allCharts.push(myChart)
				})
			},
			barBData(Id, staffJson) { //双向 柱状图
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(starrenbar(staffJson), true);
					allCharts.push(myChart)
				})
			},
			addBarData(list, obj, maxDate, sum, type) {
				var sDate = new Date(maxDate);
				var eDate = new Date(maxDate);
				sDate.setDate(sDate.getDate() - sum);
				eDate.setDate(eDate.getDate() + sum + 1);
				sDate = new Date(sDate);
				eDate = new Date(eDate);
				if(type == 1) {
					obj.data1 = [];
					obj.oxAxis = [];
					for(var vdate = new Date(sDate); vdate < eDate; vdate.setDate(vdate.getDate() + 1)) {
						var vtime = vdate.Format("yyyy-MM-dd");
						var oData1 = 0;
						for(var idx = 0, len = list.length; idx < len; idx++) {
							if(vtime == list[idx].date) {
								oData1 = list[idx].count;
								break
							}
						}
						obj.oxAxis.push(vdate.Format("MM-dd"));
						obj.data1.push(oData1);

					}

				} else if(type == 2) {
					obj.data1 = [];
					obj.data2 = [];
					obj.oxAxis = []; //count1:晚归,count2:晚出
					for(var vdate = new Date(sDate); vdate < eDate; vdate.setDate(vdate.getDate() + 1)) {
						var vtime = vdate.Format("yyyy-MM-dd");
						var oData1 = 0;
						var oData2 = 0;
						for(var idx = 0, len = list.length; idx < len; idx++) {
							if(vtime == list[idx].date) {
								oData1 = list[idx].count1;
								oData2 = -list[idx].count2;
								break
							}
						}
						obj.data1.push(oData1)
						obj.data2.push(oData2)
						obj.oxAxis.push(vdate.Format("MM-dd"));
					}
				}
				obj.barWidth=12/obj.oxAxis.length*18;
			},
			objectBar() { //柱状图数据
				var obj = new Object();
				obj.data1 = [];
				obj.color = ['#135E81'];
				obj.name = '';
				obj.barWidth = 20;
				obj.oxAxis = [];
				obj.leg = "false";
				obj.oMax = function(value) {
					return value.max;
				};
				return obj
			},
			objectLine() { //折线图数据
				var obj = new Object();
				obj.data1 = [];
				obj.color = ['#47BCC2', 'rgba(71,188,194,0.7)', "rgba(0,0,0,0)"];
				obj.name = '';
				obj.oxAxis = [];
				obj.leg = "false";
				obj.oMax = function(value) {
					return value.max;
				};
				obj.leg = 'false';
				return obj
			},
			objectBarTwo() { //双向柱状图数据
				var obj = new Object();
				obj.data1 = [];
				obj.data2 = [];
				obj.color = ['#00fffc'];
				obj.name = '';
				obj.oxAxis = [];
				obj.size = 24;
				obj.grid = {
					left: 10,
					right: 50,
					bottom: 0,
					top: 0,
					containLabel: true
				}

				return obj
			},
			time() { //模块进入时间 点击切换
				$(".about-history-list").flexslider({
					animation: "slide",
					slideshow: false,
					controlNav: false,
					animationLoop: false,
					itemWidth: 190,
					itemMargin: 31,
					prevText: "<",
					nextText: ">",
					move: 1
				});
			},
			joinMoudle() { //模块进入时间  请求接口
				var _this=this;
				this.$axios.post('home/joinMoudle', {
						emulateJSON: true
					})
					.then(function(res){
						_this.joinMoudleSucc(res)
					});
			},
			joinMoudleSucc(res) { //模块进入时间  接收函数
				var data = res;
				this.joinList = data.joinList;
				for(var i = 0; i < data.joinList.length; i++) {
					if(data.joinList[i].moudleName) {
						this.joinList[i].moudleName = data.joinList[i].moudleName.split(",");
					}

				}
				//outTime = window.setTimeout(this.time, 1000);

			},
			navprev(type){
				if(this.joinList&&this.joinList.length>0){
					var oldLeft=parseInt(this.$refs.flexDirection.style.marginLeft)||0;
					if(type==1){//左边箭头
						this.flexOindex--;
						if(this.flexOindex <= 0) {
							this.flexOindex = 0;
							oldLeft=-11
						}
						var oX = oldLeft+11;
						this.$refs.flexDirection.style.marginLeft = oX + 'rem';
					
					}else{//右边边箭头
						this.flexOindex++;
						if(this.flexOindex > this.joinList.length - 1) {
							this.flexOindex = 0;
						}
						var oX = this.flexOindex * (-11);
						this.$refs.flexDirection.style.marginLeft = oX + 'rem';
					
					}
				}else{
					return
				}
				
			}

		},
		mounted: function() {
			this.joinMoudle();
			var _this = this;
			this.bus.$on('showYearReview', function(mes) {
				_this.curr = 1;
				_this.review();

			})
			var mydate = new Date();
			var oY = mydate.getFullYear(); // 获取完整的年份(4位,1970-????)
			var oM = mydate.getMonth() + 1;
			if(oM >=9) {
				oY = oY + 1
			}
			this.year = oY - 1;
			for(var i=oY;i>2018; i--) {
				oY--
				this.yearArr.unshift(oY);
				
				
			}

		},

	}
</script>

<style lang="scss">
	.cd-p{
		margin-bottom: 0.8rem;
		padding-bottom: 0.2rem;
	}
	.iconTemp{
		display: inline-block;
		width: 1.1rem;
		height: 1.1rem;
		background-size: contain;
		background-repeat:no-repeat ;
		background-position: center;
		vertical-align: middle;
		&.fire{
			background-image: url(../../../static/images/review/fire.png);
		}
		&.car{
			background-image: url(../../../static/images/review/car.png);
		}
		&.controlCar{
			background-image: url(../../../static/images/review/controlCar.png);
		}
	}
	.review-modal{
		z-index: 100000000 !important;
		position:absolute !important;
	}
	.review-modal .el-dialog{
		width: 60rem;
		margin: 0px !important;
		background: #002037;
		overflow: hidden;
		position:absolute;
		top: 1rem;
		bottom:1.2rem;
		right:30.5rem;
		.el-dialog__body{
			height: calc(100% - 4rem);
		}
		.sjl{
			height: 100%;
		}
	}
	.sjl .timeTab {
		position: absolute;
		top: 50px;
		right: 10px;
	}
	
	.sjl .timeTab h6 {
		min-width: 94px;
		line-height: 24px;
		font-size: 16px;
		cursor: pointer;
		padding: 0 31px 0 9px;
		color: #71C7D5;
		border: 1px solid rgba(74, 172, 219, 0.5);
		border-radius: 4px;
		background: url(../../../static/images/img3.png) no-repeat right 10px center;
	}
	
	.sjl *,
	.sjl *:after,
	.sjl *:before {
		box-sizing: border-box;
	}
	
	.sjl .section {
		width: 100%;
		height: 100%;
		overflow: auto;
		/* padding: 0 4%; */
		margin-top: 2rem;
		padding-bottom: 0.6rem;
	}
	
	.sjl .cd-container {
		width: 100%;
	}
	
	.sjl .cd-top {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		position: absolute;
		top: 2px;
		margin-left: -8px;
		background: #2b76aa;
		left: 50%;
	}
	
	.sjl .cd-bottom {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		position: absolute;
		bottom: -6px;
		margin-left: -8px;
		background: #2b76aa;
		left: 50%;
	}
	
	.sjl .cd-container::after {
		content: '';
		display: table;
		clear: both;
	}
	
	.sjl #cd-timeline {
		position: relative;
		margin-top: 2rem;
		min-height: 30rem;
		padding: 3.5rem 0px;
	}
	
	.sjl #cd-timeline::before {
		content: '';
		position: absolute;
		top: 5px;
		left: 18px;
		height: 100%;
		width: 2px;
		background: #2B76AA;
		left: 50%;
		margin-left: -1px;
	}
	
	.sjl .cd-timeline-block {
		position: relative;
		margin: 1rem 0;
	}
	
	.sjl .cd-timeline-block:after {
		content: "";
		display: table;
		clear: both;
	}
	
	.sjl .cd-timeline-img {
		position: absolute;
		top:-1rem;
		width: 10.5rem;
		height: 2.4rem;
		left: 50%;
		text-align: center;
		background-size:contain !important;
	}
	
	.sjl .cd-timeline-block:nth-child(odd) .cd-timeline-img {
		background: url(../../../static/images/leftimg.png) no-repeat bottom;
		margin-left:-9.75rem;
	}
	
	.sjl .cd-timeline-block:nth-child(even) .cd-timeline-img {
		background: url(../../../static/images/rightimg.png) no-repeat bottom;
		margin-left: -0.7rem;
	}
	
	.sjl .cd-timeline-content {
		position: relative;
		width: 19rem;
		margin-left: 0;
	}
	
	.sjl .cd-timeline-content p {
		font-size: 0.8rem;
		color: #71C7D5;
		line-height: 1.3rem;
	}
	
	.sjl .cd-timeline-content h2 {
		font-size: 0.8rem;
		color: #71C7D5;
		line-height: 1.25rem;
	}
	
	.sjl .cd-timeline-content h2 i {
		color: #FFCC00;
		margin: 0 3px;
	}
	
	.sjl .cd-timeline-content h2 em {
		font-size: 0.8rem;
	}
	
	.sjl .cd-timeline-content h2 span {
		color: #999899;
		margin-left: 1rem;
		font-family: "DIN Medium";
	}
	
	.sjl .cd-timeline-content h2 .sum {
		font-size: 1.1rem;
		font-family: "DIN Medium";
		color: #FFCC00;
		// margin-left: 0.5rem;
	}
	
	.sjl .cd-timeline-content h2 .license {
		color: #EACE2D;
		display: inline-block;
		border: 1px solid rgba(234, 206, 45, 1);
		border-radius: 4px;
	}
	
	.sjl .cd-timeline-img .cd-date {
		font-size: 1rem;
		font-family: "DIN Medium";
		color: rgba(113, 199, 213, 1);
		display: block;
	}
	.sjl .cd-timeline-img .cd-name {
		font-size: 1rem;
		font-family: "DIN Medium";
		color: #FFCC00;
		display: inline-block;
		vertical-align: middle;
	}
	.sjl .cd-timeline-block:nth-child(even) .cd-timeline-content {
		float: right;
		h2{
			text-align: center;
		}
		.cartogram{
			margin: auto;
		}
	}
	
	.sjl .cd-timeline-block:nth-child(even) .cd-timeline-content .cd-date {
		left: auto;
		right: 122%;
		h2{
			text-align: center;
		}
		.cartogram{
			margin: auto;
		}
	}
	
	.sjl .cartogram {
		height: 12rem;
		width: 100%;
	}
	
	.about-history {
		width: 100%;
		position: relative;
		margin: 0 auto;
		margin-top: 55px;
	}
	
	.about-title {
		font-size:0.9rem;
		color: #fff;
		width: 150px;
		height: 30px;
		background: rgba(18, 112, 185, 1);
		border-radius: 15px 0px 0px 15px;
		text-align: center;
		line-height: 30px;
		float: left;
		position: absolute;
		top: 50%;
		margin-top: -15px;
		margin-left: 30px;
	}
	
	.about-history-list {
		// position: absolute;
		// left:0px;
		// right: 0px;
		padding-left: 180px;
		padding-right: calc(13rem + 30px);
	}
	
	.about-history-list .flex-viewport {
		width: 100%;
	}
	
	.about-history-list .flex-viewport:after {
		position: absolute;
		top: 50%;
		right: 0;
		left: 20px;
		right: 0px;
		margin-top: -2px;
		border-top: 4px solid #ccc;
		content: '';
		border-radius: 4px 0 0 4px;
		z-index: 2;
	}
	
	.about-history-list .flex-viewport:before {
		position: absolute;
		top: 50%;
		right: 0;
		left: 0;
		width: 100%;
		height: 30px;
		background: rgba(0, 70, 118, 1);
		content: '';
		margin-top: -15px
	}
	
	.about-history-list .slides li {
		position: relative;
		height: 215px;
		float: left;
		width: 11rem;
	
	}
	
	.about-history-list .slides li .item {
		width: 101%;
		height: 100%;
		position: relative
	}
	.about-history-list .slides li .item:hover *{
		color:#EB3B7B;
	}
	.about-history-list .slides li .item:hover .desc p{
		color:#fff;
		background:rgba(206,53,109,1);
		border:1px solid rgba(206,53,109,1)
	}
	.about-history-list .slides li .item:hover .dottedLine:after{
		border: 1px dashed #EB3B7B;
	}
	.about-history-list .slides li .item:hover .dottedLine{
		background-color: #EB3B7B;
    	box-shadow: none;
	}
	.about-history-list .slides li:nth-child(even) .item .dottedLine:after {
		/*top: 22px;
		bottom: auto;*/
		top: -40px;
	}
	
	.about-history-list .slides li .item h3 {
		font-size:1rem;
		font-family: "DI Medium";
		font-weight: bold;
		color: rgba(117, 203, 242, 1);
		text-align: center;
		position: absolute;
		top: 58px;
		left: 50%;
		margin-left: -45px;
	}
	
	.about-history-list .slides li:nth-child(even) .item h3 {
		top: 141px;
	}
	
	.about-history-list .slides li .item .desc {
		line-height: 24px;
		font-size: 14px;
		color: #929292;
		/*position: relative;
		top:4px;*/
		text-align: center;
		top: 50%;
		position: absolute;
		width: 100%;
		left: 0px;
		margin-top: 35px;
	}
	
	.about-history-list .slides li:nth-child(even) .desc {
		top: auto;
		bottom: 144px;
	}
	
	.about-history-list .slides li .item .desc p {
		margin: 0;
		display: inline-block;
		color: #75CBF2;
		font-size:0.9rem;
		line-height:25px;
		padding: 0 8px;
		height:26px;
		background:rgba(18,112,185,0.3);
		border: 1px solid rgba(18,112,185,1);
		border-radius:4px;
		margin:0 1px 4px 1px;
		
	}
	
	.about-history-list .flex-direction-nav {
		padding: 0;
		margin: 0;
		list-style: none;
	}
	
	.about-history-list .flex-direction-nav em {
		position: absolute;
		top: 50%;
		width: 48px;
		height: 160px;
		line-height: 160px;
		overflow: hidden;
		margin-top: -80px;
		font-size: 2.5rem;
		font-family: simsun;
		color: #ffffff;
		text-align: center;
		cursor: pointer;
	}
	
	.about-history-list .flex-direction-nav em.flex-prev {
		left: -0.5rem;
	}
	
	.about-history-list .flex-direction-nav em.flex-next {
		right: -0.5rem;
	}
	
	.about-history-swiper {
		width: 100%;
	}
	
	.about-history-swiper .swiper-slide .item {
		overflow: hidden;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		background-color: #fff;
	}
	
	.about-history-swiper .swiper-slide .item h3 {
		margin: 0;
		height: 40px;
		line-height: 40px;
		overflow: hidden;
		font-size: 20px;
		text-align: center;
		color: #999999;
		background-color: #e2e2e2;
	}
	
	.about-history-swiper .swiper-slide .item .desc {
		line-height: 20px;
		padding: 10px;
		font-size: 14px;
		color: #929292;
	}
	
	.about-history-swiper .swiper-slide .item .desc p {
		margin: 0;
	}
	
	.about-history-swiper .about-history-pagination {
		position: static;
		margin-top: 10px;
	}
	
	.about-history-swiper .about-history-pagination .swiper-pagination-bullet {
		background: #fff;
	}
	
	.about-history-swiper .about-history-pagination .swiper-pagination-bullet-active {
		background: #C91523;
	}
	
	.list {
		padding: 0;
		margin: 0;
		list-style: none;
		z-index: 3;
		position: relative;
	}
	
	.no-join {
		width: 13rem;
		height: 30px;
		background: #83919c;
		border-radius: 0 15px 15px 0;
		position: absolute;
		right: 30px;
		top: 50%;
		margin-top: -15px;
		text-align: right;
	}
	
	.no-join:after {
		position: absolute;
		top: 50%;
		right: 20px;
		left: 0px;
		margin-top: -2px;
		border-top: 4px solid #ccc;
		content: '';
		border-radius: 0 4px 4px 0;
		z-index: 2;
	}
	
	.no-join .desc p {
		font-size:0.8rem;
		line-height: 1.25rem;
		padding: 0 0.25rem;
		height: 1.3rem;
		display: inline-block;
		color: #666666;
		border: 1px solid #666666;
		border-radius: 4px;
		margin-bottom: 0.2rem;
	}
	
	.no-join .desc-top {
		position: absolute;
		right: 0px;
		bottom:37px;
		   
	}
	
	.no-join .desc-bottom {
		position: absolute;
		right: 0px;
		top: 40px;
	}
	
	.Z-btn {
		height: 24px;
		background: #0478B7;
		border-radius: 2px;
		font-size: 14px;
		color: #fff;
		padding: 0 10px;
		border: none;
		float: right;
	}
	
	.sjl .dottedLine {
		width: 12px;
		height: 12px;
		border-radius: 100%;
		background-color: #fffffd;
		-webkit-box-shadow: inset 0 0 7px #6dc8cb;
		box-shadow: inset 0 0 7px #6dc8cb;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -6px;
		margin-top: -6px;
		text-align: center;
	}
	
	.sjl .dottedLine:after {
		margin-top: 13px;
		display: inline-block;
		border: 1px dashed #71C7D5;
		content: '';
		height: 27px;
		position: relative;
	}
	.loadinghint{
		height:500px;
		position:relative;
	}
	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -30px;
	}
	
	.loading img {
		animation: rotate 4s linear infinite;
	}
	
	.loading i {
		font-size: 14px;
		color: #75CBF2;
	}
	
	.nodataHint {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -30px;
		font-size: 18px;
		color: #75CBF2;
	}
</style>