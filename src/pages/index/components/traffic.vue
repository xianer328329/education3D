<template>
	<div class="traffic">
		<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval" >
			<el-carousel-item label="车辆管控">
				<div class="amountCom amountBox clearFix">
					<div class="fl amount">当日入校车辆<span><i class="yellowC">{{car.enterCount}}</i></span></div>
					<div class="fr amount">实时校内车辆<span><i class="yellowC">{{car.stayCount}}</i></span></div>
				</div>
				<div id="carLine"></div>
			</el-carousel-item>
			<!-- <el-carousel-item label="人员管控">
				<div class="amountBox2BG">
					<h5>疑似异常</h5>
					<div class="amountCom amountBox2 clearFix">
						<div class="fl amount">48小时<span><i class="yellowC">{{people.hour48}}</i>人</span></div>
						<div class="fr amount">7天<span><i class="yellowC">{{people.day7}}</i>人</span></div>
						<div class="fl amount">30天<span><i class="yellowC">{{people.day30}}</i>人</span></div>
						<div class="fr amount">120天<span><i class="yellowC">{{people.day120}}</i>人</span></div>
					</div>
				</div>
				<div id="renBar"></div>
			</el-carousel-item> -->			
		</el-carousel>
	</div>
</template>

<script>
	/* eslint-disable */
	
	import axios from 'axios'
	export default {
		name: 'IndexTraffic',
		data() {
			return {
				interval:10000,//轮播间隔秒数
				Hour: [{ //获取异常人员时间数组
					"Time": "48Hour"
				}, {
					"Time": "7Day"
				}, {
					"Time": "30Day"
				}, {
					"Time": "120Day"
				}],
				car: {
					enterCount: "--", //入校车辆
					stayCount: "--", //时实车辆
					BJdata1: [], //入校车辆
					BJdata2: [], //校内车辆
					color: ['#be5f5e', '#893236'],
					name: ['入校车辆', '校内车辆'],
					oxAxis: [],
					interval: 1,
					Yname: "",
					leg: false
				},
				people: {
					day7: "--",
					day30: "--",
					hour48: "--",
					day120: "--",
					staffJson: {
						name: '当日告警柱',
						oxAxis: [],
						data1: [],
						data2: [],
						color: ["#00fffc"],
						size: 24,
						grid: {
							left: 10,
							right: 50,
							bottom: 0,
							top: 0,
							containLabel: true
						}
					}
				}
			}
		},
		methods: {
			LineDatacar(Id, carData) {
				var mTime = null;
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(LineChartN(carData), true);
				allCharts.push(myChart);
				var index = 0; //播放所在下标  
				clearInterval(mTime);
				mTime = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
					if(index > carData.oxAxis.length - 1) {
						index = 0;
					}
				}, 3000);
			},
			barBData(Id, staffJson) {
				var mTime2 = null;
				var myChart = echarts.init(document.getElementById(Id));
				myChart.setOption(starrenbar(staffJson), true);
				allCharts.push(myChart);
				var index = 0; //播放所在下标  
				clearInterval(mTime2);
				mTime2 = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
					if(index > staffJson.oxAxis.length - 1) {
						index = 0;
					}
				}, 3000);
			},
			getCountNum() { //车辆管控接口请求函数
				var _this = this;
				this.$axios.post('home/traffic24Hour', {
						emulateJSON: true
					})
					.then(this.countNumSucc);
			},
			countNumSucc(res) { // 车辆管控接口接收函数
				var data = res;
				var currentCount = data.countList;
				var countList = data.countList;
				var eDate = new Date();
				eDate.setHours(eDate.getHours() + 1);
				eDate = new Date(eDate);
				var sDate = new Date();
				sDate.setHours(sDate.getHours() - 22);
				sDate = new Date(sDate);

				var zeroPoint = (new Date().Format("yyyy-MM-dd")) + " 01";
				var todayEnterCount = 0;
				for(var vdate = new Date(sDate); vdate <= eDate; vdate.setHours(vdate.getHours() + 1)) {
					var vtime = vdate.Format("yyyy-MM-dd hh");
					var enterCount = 0;
					var stayCount = 0;
					for(var idx = 0, len = countList.length; idx < len; idx++) {
						if(vtime == countList[idx].passTime) {
							enterCount = countList[idx].enterCount;
							stayCount = countList[idx].stayCount;
							break;
						}
					}
					if(vtime >= zeroPoint) {
						todayEnterCount += enterCount;
					}
					this.car.oxAxis.push(vdate.Format("hh") + "时");
					this.car.BJdata1.push(enterCount);
					this.car.BJdata2.push(stayCount);
				}
				this.car.enterCount = todayEnterCount;
				var leng = this.car.BJdata1.length - 1;
				this.car.stayCount = this.car.BJdata2[leng];
				this.LineDatacar('carLine', this.car);
			},
			getTwentyfourlist() { //获取48小时疑似异常人员
				return this.$axios.post('/home/loseUserCount/' + UNITID + "?lostType=" + this.Hour[0].Time);
			},
			getSevendaylist() { //获取7天时疑似异常人员
				return this.$axios.post('/home/loseUserCount/' + UNITID + "?lostType=" + this.Hour[1].Time);
			},
			getThirtydaylist() { //获取30天疑似异常人员
				return this.$axios.post('/home/loseUserCount/' + UNITID + "?lostType=" + this.Hour[2].Time);
			},
			getOneHundredAndTwentydaylist() { //获取120天疑似异常人员
				return this.$axios.post('/home/loseUserCount/' + UNITID + "?lostType=" + this.Hour[3].Time);
			},
			getPeopleControlTrend() { //人员管控接口请求函数
				var params = new FormData();
				params.append('trendType', '30Day');
				return this.$axios.post('traffic/people/nightInOutTrend/' + UNITID, params, {
					emulateJSON: true
				});
			},
			getloseUserCount: function() { //并发调用接口 获取异常人员名单
				var _this = this;
				//按年级级获取所有疑似异常的人 
				this.$axios.all([this.getTwentyfourlist(), this.getSevendaylist(), this.getThirtydaylist(), this.getOneHundredAndTwentydaylist(), this.getPeopleControlTrend()])
					.then(
						this.$axios.spread(function(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist, PeopleControlTrend) {
							
								_this.loseUserCountSucc(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist, PeopleControlTrend)
							
						})
					);
			},
			loseUserCountSucc(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist, PeopleControlTrend) {
				this.people.day7="0";
				this.people.day30="0";
				this.people.hour48="0";
				this.people.day120="0";
				if(Twentyfourlist.lostList && Twentyfourlist.lostList.length > 0) { //存入24小时数组
					var sum = 0;
					for(var i = 0; i < Twentyfourlist.lostList.length; i++) {
						sum += Twentyfourlist.lostList[i].lostStaffCount;
					}
					this.people.hour48 = sum;
				}
				if(Sevendaylist.lostList && Sevendaylist.lostList.length > 0) { //存入7天数组
					var sum1 = 0;
					for(var i = 0; i < Sevendaylist.lostList.length; i++) {
						sum1 += Sevendaylist.lostList[i].lostStaffCount;
					}
					this.people.day7 = sum1;
				}
				if(Thirtydaylist.lostList && Thirtydaylist.lostList.length > 0) { //存入30天数组
					var sum2 = 0;
					for(var i = 0; i < Thirtydaylist.lostList.length; i++) {
						sum2 += Thirtydaylist.lostList[i].lostStaffCount;
					}
					this.people.day30 = sum2;
				}
				if(OneHundredAndTwentydaylist.lostList && OneHundredAndTwentydaylist.lostList.length > 0) { //存入120天数组
					var sum3 = 0;
					for(var i = 0; i < OneHundredAndTwentydaylist.lostList.length; i++) {
						sum3 += OneHundredAndTwentydaylist.lostList[i].lostStaffCount;
					}
					this.people.day120 = sum3;
				}
				// 存放晚出晚归的趋势
				if(PeopleControlTrend) {
					var list = PeopleControlTrend.trendList;
					day30DataC(list, 'useTime', 'manIn', 'manOut', this.people.staffJson);
					for(var i = 0; i < this.people.staffJson.data2.length; i++) {
						this.people.staffJson.data2[i] = -this.people.staffJson.data2[i];
					}
					this.barBData('renBar', this.people.staffJson);
					
				}
			},
			
		},
		mounted: function() {
			this.getCountNum();
			// this.getloseUserCount();
		}
	}
</script>

<style lang="scss" scoped>
	.el-carousel{
		height: 100%;
	}
	.amountBox {
		margin-top: 2rem;
	}
	
	#carLine {
		width: 100%;
		height: calc(100% - 4rem);
		margin-top:0.35rem;
	}
	
</style>