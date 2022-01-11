<template>
	<div class="lifemodle">
	<el-carousel class="Zslide" indicator-position="outside" height="100%" trigger="click" arrow="never" :interval="interval">
			<el-carousel-item label="就餐" class="pieL-RBox clearFix repast ">
				<span class="dtatTitle">本月</span>
						<div class="repast-R amountCom amountBoxUp  fl">
							<div class="amount">
								<div class="amount-content">
									<span><i class="yellowC">{{this.dayEat}}</i>人次</span>
									<p>日均就餐</p>
								</div>
							</div>
							<div class="amount">
								<div class="amount-content">
									<span><i class="yellowC">{{this.dayExpense}}</i>元</span>
									<p>人均每餐消费</p>
								</div>
							</div>

						</div>
						<div class="pieOne  fr">
							<div class="pieL-R-F">{{this.dayEatRate}}<small>%</small></div>
							<div id="repast"></div>
						</div>
			</el-carousel-item>
			<!-- 医药高专演示需要 暂时先注释
			<el-carousel-item label="借阅" class="borrow">
				<span class="dtatTitle">最近12个月</span>
					<div class="Borrowing">
						<h4 class="fl">
                    		<p>{{weekBorrowing}}<i>%</i></p>
                        	<span>周借阅</span>
                    	</h4>
						<h4 class="fl">
                    		<p>{{MonthBorrowing}}<i>%</i></p>
                        	<span>月借阅</span>
                    	</h4>
						<h4 class="fl">
                    		<p>{{SemesterBorrowing}}<i>%</i></p>
                        	<span>期借阅</span>
                    	</h4>
						<h4 class="fl">
                    		<p>{{NoneBorrowing}}<i>%</i></p>
                        	<span>从未借阅</span>
                    	</h4>
						<div class="borrow-middle">
							<div class="Z-WMPieFont"><i id="outLineRate">{{dayAverageBorrowing}}%</i><span>日均借阅占比</span></div>
							<div id="borrow-red"></div>
						</div>
					</div>
			</el-carousel-item>
			-->
		</el-carousel>
	<!--<li class="payFees clearFix">
						<div class="payF fl">
							<h6>电 费</h6>
							<h4 class="amount"><span><i>105</i>元</span><p>生均月缴电费</p></h4>
						</div>
						<div class="payF fl">
							<h6>水 费</h6>
							<h4 class="amount"><span><i>105</i>元</span><p>生均月缴水费</p></h4>
						</div>
						<div class="payF fl">
							<h6>上网费</h6>
							<h4 class="amount"><span><i>105</i>元</span><p>生均月缴网费</p></h4>
						</div>
					</li>-->
		</div>	
</template>

<script>
	/* eslint-disable */
	var pieJsonlab = {
		'color': ["#31859C", "#1D3F65"],
		'radius': ['60%','70%'],
		'center': ['50%', '40%'],
		'emphasis': 'false',
		'lege': 'false',
		'itemGap': 14,
		'fontSize': 16,
		'top': 10,
		'title': true,
		'text': '',
		'textStyle': {
			'color': '#75CBF2',
			'fontSize': (fontSize||20)*0.7,
			'fontWeight': '500'
		}
	};
	var repastData = [{
			value: 0,
			name: "就餐"
		},
		{
			value: 100,
			name: "未就餐"
		},
	];
	var pieJsonsbackPie = {
		'color': ["#31859C", "#1D3F65"],
		'radius': ['70%','80%'],
		'center': ['50%', '50%'],
		'emphasis': 'false',
		'lege': 'false',
		'itemGap': 14,
		'fontSize': 16,
		'top': 10,
		'title': true,
		'text': '',
		'textStyle': {
			'color': '#75CBF2',
			'fontSize': (fontSize||20)*0.8,

		}
	}
	import axios from 'axios'
	export default {
		name: 'IndexLife',
		/*components: {
			DateSelc
		},*/
		data() {
			return {
				
				interval:10000,//轮播间隔秒数
				weekBorrowing: '--', //周借阅
				MonthBorrowing: '--', //月借阅
				SemesterBorrowing: '--', //学期借阅
				NoneBorrowing: '--', //重未借阅
				dayAverageBorrowing: '--', //日均借阅
				dayEat: "--", //日均就餐
				dayExpense: "--", //人均每餐消费
				dayEatRate: "--", //日均就餐人数占比
				intervalid: null,
			}
		},
		methods: {
			Pierepast(Id, repastData, pieJsonlab) { //日均就餐人数圆环图
				this.$nextTick(function(){
					pieJsonlab.emphasis = 'false';
					pieJsonlab.lege = 'false';
					pieJsonlab.text = '日均就餐人数占比';
					var myChart = echarts.init(document.getElementById(Id));
					myChart.setOption(Pie(repastData, pieJsonlab), true);
					allCharts.push(myChart);
				})
			},
			previewAnaly() { //借阅分析请求接口
				var _this=this;
				this.$axios.post('traffic/life/previewAnaly/' + UNITID)
					.then(this.previewAnalySucc)
					
			},
			previewAnalySucc(res) { //借阅分析接收
				var data = res|| [];
				var daycount = new Date().getDate(); //获取今天几号
				if(data.studentCount) {
					this.weekBorrowing = (data.previewWeek / data.studentCount).toFixed(1);
					this.MonthBorrowing = (data.previewMonth / data.studentCount).toFixed(1);
					this.SemesterBorrowing = (data.previewSemester / data.studentCount).toFixed(1);
					this.NoneBorrowing = ((data.previewNone / data.studentCount) * 100).toFixed(1);
				}
				if(data.previewMonth || data.previewMonth == "0") {
					this.dayAverageBorrowing = (data.previewMonth / daycount).toFixed(1);
					this.PieDatasbackPies(this.dayAverageBorrowing, data.previewMonth);
				} else {
					this.PieDatasbackPies(0, 0);
				}

			},
			/*借阅分析echarts圆形对比图*/
			PieDatasbackPies(dayAverageBorrowing, previewMonth) {
				var pieDatassbackPie = [{
						value: previewMonth,
						name: "月借阅总数"
					},
					{
						value: dayAverageBorrowing,
						name: "日均借阅占比"
					},
				]

				pieJsonsbackPie.lege = "false";
				pieJsonsbackPie.emphasis = "false";
				if(previewMonth == "0" && dayAverageBorrowing == "0.0") {
					pieJsonsbackPie.color = ["#1D3F65", "#1D3F65"];
				}
				var myChart = echarts.init(document.getElementById("borrow-red"));
				myChart.setOption(Pie(pieDatassbackPie, pieJsonsbackPie), true);
			
			},
		
			repastAnaly() { //就餐请求接口
				var _this=this;
				this.$axios.post('traffic/life/home/schoolLife/' + UNITID, {
						emulateJSON: true
					})
					.then(this.repastAnalySucc);
			},
			repastAnalySucc(res) {
				var data = res;
				var repastData = [];
				if(data) {
					var eatCount = data.eatCount; //月消费人次
					var eatTotal = data.eatTotal; //月消费总额
					var eatAverage = data.eatAverage; //日就餐人数
					var studentCount = data.studentCount; //学生总人数
					var oDay = new Date();
					oDay = oDay.getDate();
					if(eatCount) {
						this.dayEat = Math.ceil(eatCount / oDay);
					}
					if(eatCount) {
						this.dayExpense = (eatTotal / eatCount).toFixed(1);;
					} else if(eatCount == "0") {
						this.dayExpense = 0.0;
					}
					if(studentCount) {
						this.dayEatRate = (eatAverage / studentCount * 100).toFixed(1);
					} else if(studentCount == "0") {
						this.dayEatRate = 0.0;
					}
					if(this.dayEatRate && this.dayEatRate != "--") {
						repastData = [{
								value: this.dayEatRate,
								name: "就餐"
							},
							{
								value: 100 - this.dayEatRate,
								name: "未就餐"
							},
						];
						pieJsonlab.color = ["#31859C", "#1D3F65"];
					} else {

						repastData = [{
								value: 0,
								name: "就餐"
							},
							{
								value: 0,
								name: "未就餐"
							},
						];
						pieJsonlab.color = ["#1D3F65", "#1D3F65"];
					}

					this.Pierepast('repast', repastData, pieJsonlab)
				} else {

					repastData = [{
							value: 0,
							name: "就餐"
						},
						{
							value: 0,
							name: "未就餐"
						},
					];
					this.Pierepast('repast', repastData, pieJsonlab)
				}
			}

		},
		mounted: function() {
			// this.previewAnaly();
			this.repastAnaly();
			this.Pierepast('repast', repastData, pieJsonlab);
		},

	}
</script>

<style lang="scss" scoped>
	/*就餐*/
	.Zslide{
		height:100%;
	}
	.repast .pieOne {
		padding-top:1.9rem;
		width: 50%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
	}
	
	.repast .repast-R {
		margin-top: 1.9rem;
		width: 50%;
		height: calc(100% - 2.5rem);
	}
	
	.repast-R.amountBoxUp .amount {
		width: 90%;
		span{
			background-size:80% 0.15rem;
		}
	}
	
	#repast {
		margin: auto;
		width:100%;
		height:100%;
	}
	
	.pieL-R-F {
		font-size: 1.2rem;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		color: #FFCC00;
		font-family: "DIN Medium";
	}
	/*借阅*/
	
	.borrow {
		width: 100%;
		height:218px;
		background: url(../../../../static/images/img6.png) no-repeat bottom;
		position: relative;
	}
	.Borrowing{margin-top: 40px;}
	.borrow h4 {
		width: 140px;
		height: 87px;
		text-align: center;
		margin-left: 6px;
	}
	
	.borrow h4:nth-of-type(2n+2) {
		margin-left: 128px;
	}
	
	.borrow p {
		font-size: 22px;
		font-family: 'DIN Medium';
		font-weight: 500;
		color: rgba(0, 255, 255, 1);
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		margin-top: 19px;
		padding-bottom: 7px;
		background-size: 100px 3px;
	}
	
	.borrow p i {
		color: #75CBF2;
		font-size: 14px;
	}
	
	.borrow span {
		font-size: 16px;
		color: #75cbf2;
		display: inline-block;
	}
	
	.borrow-middle {
		width: 140px;
		height: 140px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -52px;
		margin-left: -70px;
		border-radius: 50%;
	}
	
	#borrow-red {
		width: 100%;
		height: 100%
	}
	
	.borrow .Z-WMPieFont span {
		font-size: 16px;
		color: #75CBF2;
		display: block;
	}
	.borrow .Z-WMPieFont i {
		margin-top: 39px;
		font-size:22px; color:#ffcc00; display:block;
     padding-bottom: 5px;background: none;
	}
	/*生活缴费*/
	
	.payFees {
		width: 408px;
		margin: 0 auto;
		margin-top: 38px;
	}
	
	.payFees .payF {
		width: 131px;
		height: 162px;
		background: rgba(0, 36, 61, 1);
		border-radius: 10px 10px 0px 0px;
		margin: 0 3px 0 2px;
		text-align: center;
	}
	
	.payF h6 {
		color: #fff;
		line-height: 30px;
		background: rgba(0, 105, 153, 1);
		border-radius: 10px 10px 0px 0px
	}
	
	.payF .amount {
		width: 100%;
		height: 86px;
		text-align: center;
		margin-bottom: 5px;
	}
	
	.payF .amount span {
		display: block;
		font-size: 12px;
		color: #75CBF2;
		padding-bottom: 10px;
		margin-top: 22px;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
	}
	
	.payF .amount p {
		font-size: 16px;
		color: #75CBF2;
		line-height: 34px;
	}
	
	.payF .amount span i {
		font-size: 24px;
		font-family: "DIN Medium";
		font-weight: 500;
		color: #FFCC00;
		margin-right: 3px;
		display: inline-block;
	}
	
	
</style>
<style>
	.lifemodle .Zslide .el-carousel__indicator.is-active button{
		border:none !important;
	}
</style>