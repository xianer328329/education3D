<template>
	<div class="eat">
		<h4 class="boxtitle">就餐</h4>
		<ul class="S-u backboxContainer">
			<li class="S-first">
				<span class="S-firsttitle fl">昨日就餐</span>
				<div class="S-snumber clearFix">
					<div class="fl clearFix" id="dataNums"></div>
					<div class="S-text fl">人次</div>
				</div>
			</li>
			<li class="eatAverageY clearFix">
				<p class="ec-eat fr">
					<span class="">人均每餐消费<i class="ec-n">{{eatAverage}}</i></span>
					<small class="">元</small>
				</p>
			</li>
			<li class="S-Second">
				<div class="S-Secondtitle clearFix ">
					<p>上周</p>
					<p>同期</p>
				</div>
				<div class="S-stext">
					<p class="ec-eat fl">
						<span class="fl">就餐<i class="ec-n">{{weekDayCount}}</i></span>
						<small class="fr">人次</small>
					</p>
					<p class="ec-eat fr">
						<span class="fl">人均每餐消费<i class="ec-n">{{weekeatAverage}}</i></span>
						<small class="fr">元</small>
					</p>
				</div>
			</li>
			<li class="S-Third">
				<div class="S-Thirdtitle">最近30天就餐人次数</div>
				<div id="oldarr"></div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				intervalid:null,//定时器
				trendTime: [], //时间数组
				trenduseCount: [], //人数
				todaycount: "--", //今日用餐人数
				yesterdayCount: "--", //昨日用餐人数
				eatAverage: "--", //昨日用餐平均值
				weekDayCount: "--", //上周用餐人数
				weekeatAverage: "--", //上周用餐平均值
			}
		},
		mounted: function() {
			var _this=this;
			this.geteatTrend();
			this.geteatAnalyze();
			this.intervalid = setInterval(() => {
  			setTimeout(function(){
  				_this.geteatAnalyze();
  				
  			}, 0)
			}, 10000)
		},
		methods: {

			geteatTrend() { //获取30天趋势数据
				var _this=this;
				this.$axios.post('/traffic/life/eatTrend/' + UNITID)
				.then(function(res){
					_this.geteatTrendSucc(res)
				})
			},
			geteatTrendSucc(res){
				var ETdata = res.trendList || [];
						var daycount = this.getday(); //获取最近30天
						var daydate = []; //时间数组
						for(var d = 0; d < daycount.length; d++) {
							for(var i = 0; i < ETdata.length; i++) {
								if(ETdata[i].useTime == daycount[d]) {
									daydate.push(ETdata[i].useTime);
									//将时间单独放在一个数组中
									this.trendTime.push(new Date(ETdata[i].useTime).Format('MM-dd'))
									//将用餐人数单独放在一个个数组中
									//console.log(new Date(ETdata[i].useTime).Format('MM-dd'))
									this.trenduseCount.push(ETdata[i].useCount);
								}
							}
							var flag = daydate.indexOf(daycount[d])
							if(flag == -1) {
								this.trendTime.push(new Date(daycount[d]).Format('MM-dd'));
								this.trenduseCount.push(0);
							}
						}

						this.trendTime.reverse();
						this.trenduseCount.reverse();
						//调用就餐模块柱状图
						this.OldUpArryshow();
						
			},
			geteatAnalyze() { //获取 今日/昨日/上周  用餐数据
				var _this=this;
				this.$axios.post('/traffic/life/eatAnalyze/' + UNITID)
				.then(this.geteatAnalyzeSucc)
					
			},
			geteatAnalyzeSucc(res){
				var EAdata = res|| [];
						if(EAdata.today||EAdata.today==0){
							//今日用餐人数
							this.todaycount = EAdata.today.eatCount;
						}
						if(EAdata.yesterday||EAdata.yesterday==0){
							//昨日用餐人数
							this.yesterdayCount = EAdata.yesterday.eatCount;
								//昨日用餐平均值,保留1位小数
							this.eatAverage = (EAdata.yesterday.eatAverage).toFixed(1);
						}
						if(EAdata.weekDay||EAdata.weekDay==0){
							//上周用餐人数
							this.weekDayCount = EAdata.weekDay.eatCount;
							//上周用餐平均值，保留一位小数
							this.weekeatAverage = (EAdata.weekDay.eatAverage).toFixed(1);
						}
					
						
						
						//今日用餐人数，滚动数字
						this.init();
			},
			getday() {
				var lastMonth = [];
				for(var i = 0; i < 30; i++) {
					var data = new Date(new Date().setDate(new Date().getDate() - i))
					var Month = data.getMonth() + 1;
					Month = Month < 10 ? "0" + Month : Month;
					var day = data.getDate();
					day = day < 10 ? "0" + day : day;
					lastMonth.push(data.getFullYear() + '-' + Month + '-' + day)
				}
				return lastMonth;
			},
			/*数字滚动*/
			init(init) {
				$("#dataNums").rollNumDaq({ //引用num.js中的方法
					deVal:this.yesterdayCount,// this.todaycount,
					digit: '6'

				})
			},
			/*就餐模块柱状图*/
			OldUpArryshow() {
				var mTime2=null;
				var bardataJson = {
					name: '当日告警柱',
					dataX: this.trendTime,
					barData1: this.trenduseCount,
					color: ["#00fffc"],
					splitNumber:3,
					size: 0.7*fontSize,
					grid: {
						left: 10,
						right: 10,
						bottom: 0,
						top: 0,
						containLabel: true
					},
				}
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById('oldarr'));
					myChart.setOption(OldUpArry(bardataJson), true);
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
						if(index > bardataJson.dataX.length - 1) {
							index = 0;
						}
					}, 3000);
				})
			}
		},
		beforeDestroy: function() {
			clearInterval(this.intervalid)
		},
	}
</script>

<style lang="scss">
	.eat{
		.S-u{
			display: flex;
			flex-direction: column;
		}
		.S-first{
			text-align: center;
		}
		.ec-eat{
			padding: 0px 0.5rem;
		}
	}
	.eat .boxtitle {
		color: #75cbf2
	}
	.eat .S-u .eatAverageY{
		line-height: 2.5rem;
		text-align: right;
	}
	.eat .S-first .S-firsttitle {
		float:none;
		line-height: 33px;
		vertical-align: middle;
		font-size: 0.9rem;
		font-family: MicrosoftYaHei-Bold;
		font-weight: bold;
		color: rgba(117, 203, 242, 1);
	}
	.eat .S-snumber{
		display:inline-block;
		vertical-align: middle;
	}
	.eat .S-text {
		top: 0.65rem;
		position: relative;
		font-size: 0.6rem;
		font-family: MicrosoftYaHei;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.eat .S-Second {
		height: 2.5rem;
		background: rgba(0, 36, 61, 1);
	}
	
	.eat .S-Secondtitle {
		width: 2.5rem;
		height: 2.5rem;
		line-height: 1.25rem;
		background: rgba(25, 94, 127, 1);
		text-align: center;
		color: rgba(117, 203, 242, 1);
		float: left;
	}
	
	.eat .S-Secondtitle p {
		font-size: 0.7rem;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	
	.eat .ec-eat {
		
	}
	.eat .ec-eat span{font-size: 0.8rem;color:#75CBF2}
	.eat .ec-eat .ec-n{
		font-size: 1rem;
		font-family: 'DIN Medium';
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
		margin-left: 0.3rem;
	}
	.eat .ec-eat small{
		font-size: 0.6rem;
		color:#75CBF2;
		margin-left: 0.3rem;
	}
	.eat .S-stext {
		line-height: 2.5rem;
	}
	
	.eat .S-Third {
		width: 100%;
		margin-top: 0.5rem;
		flex: 1;
	}
	
	#oldarr {
		height: 100%;
		width: 100%;
		position:relative;
		z-index: 3;
	}
	
	.eat .S-Thirdtitle {
		font-size: 0.6rem;
		font-family: "Adobe Heiti Std R";
		font-weight: normal;
		position: absolute;
		right: 1rem;
		color: rgba(117, 203, 242, 1);
	}
	/*以下为数字滚动 样式
	 1、div创建在static/js/unm.js中
	 * */
	
	.eat .Z-YUJAF {
		position: absolute;
		top: 80px;
		left: 765px;
	}
	
	.eat .Z-YUJ h4 {
		font-size: 18px;
		color: #9ca2c0;
		line-height: 60px;
	}
	
	.eat .inrow {
		font-size: 0;
		font-size: 12px;
		font-size: 0;
		font-family: arial;
		letter-spacing: -3px;
		letter-spacing: normal;
		word-spacing: -1px;
	}
	
	.eat .inrow>li,
	.eat .inrow span {
		display: inline-block;
		*display: inline;
		*zoom: 1;
		font-size: 14px;
		letter-spacing: normal;
		word-spacing: normal;
	}
	.eat .dataNums {
		text-align: center;
	}
	.eat .comma{
		display:none !important;
	}
	.eat .dataNums .dataOne {
		width: 1.5rem !important;
		height: 1.7rem !important;
		margin-right: 0.35rem !important;
		text-align: center !important;
		background: rgb(0, 67, 81) !important;
	}
	
	.eat .dataNums .dataBoc {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.eat .dataNums .dataBoc .tt {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.eat .dataNums .tt span {
		width: 100%;
		height: 100%;
		font-size: 1.2rem !important;
		// font-family: 'DIN Medium' !important;
		font-weight: 400 !important;
		color: rgba(255, 204, 0, 1) !important;
		line-height: 1.7rem !important;
	}
</style>