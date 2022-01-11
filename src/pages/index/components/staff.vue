<template>
	<div class="traffic trafficB">
		<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval" >			
			<el-carousel-item label="人员管控">
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
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	/* eslint-disable */

	import axios from 'axios'
	export default {
		name: 'IndexStaff',
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
				people: {
					day7: "--",
					day30: "--",
					hour48: "--",
					day120: "--",
					staffJson: {
						name: '当日告警柱',
						'splitNumber':2,
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
			barBData(Id, staffJson) {
				this.$nextTick(function(){
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
				})
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
			this.getloseUserCount();
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.el-carousel{
		height: 100%;
	}
	.amountBox {
		margin-top: 2rem;
	}
	#renBar {
		width: 100%;
		height: calc(100% - 6rem);
	}
</style>