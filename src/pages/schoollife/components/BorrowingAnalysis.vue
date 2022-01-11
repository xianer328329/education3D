<template>
	<div class="borrowing">
		<h4 class="mdTitle">借阅分析</h4>
		<div class="timeselect">最近六个月</div>
		<div class="S-AType backboxContainer">
			<div class="bing vertical-middle-c">
				<div class="vertical-middle">
					<h4 class="left">
						<p>{{weekBorrowing}}<i>%</i></p>
						<span>周借阅</span>
					</h4>
					<h4 class="right">
						<p>{{MonthBorrowing}}<i>%</i></p>
						<span>月借阅</span>
					</h4>
					<h4 class="left">
						<p>{{SemesterBorrowing}}<i>%</i></p>
						<span>学期借阅</span>
					</h4>
					<h4 class="right">
						<p>{{NoneBorrowing}}<i>%</i></p>
						<span>从未借阅</span>
					</h4>
				</div>
			</div>
			<div class="bing-middle-c vertical-middle-c">
				<div  class="bing-middle vertical-middle">
					<div class="Z-WMPieFont"><i id="outLineRate">{{dayAverageBorrowing}}%</i><span>日均借阅占比</span></div>
					<div id="sbackPie"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				weekBorrowing: '--', //周借阅
				MonthBorrowing: '--', //月借阅
				SemesterBorrowing: '--', //学期借阅
				NoneBorrowing: '--', //重未借阅
				dayAverageBorrowing: '--', //日均借阅
			}
		},
		mounted: function() {

			this.getpreviewAnalyI(); //获取借阅分析数据
		},
		methods: {
			getpreviewAnalyI() {
				this.$axios.post('/traffic/life/previewAnaly/' + UNITID).then(this.getpreviewAnalyISucc)
			},
			getpreviewAnalyISucc(res){
				var data = res || [];
					var daycount = new Date().getDate(); //获取今天几号
					if(data.studentCount){
						this.weekBorrowing = (data.previewWeek / data.studentCount).toFixed(1);
						this.MonthBorrowing = (data.previewMonth / data.studentCount).toFixed(1);
						this.SemesterBorrowing = (data.previewSemester / data.studentCount).toFixed(1);
						this.NoneBorrowing = ((data.previewNone / data.studentCount) * 100).toFixed(1);
					}
					if(data.previewMonth||data.previewMonth=="0"){
						this.dayAverageBorrowing = (data.previewMonth / daycount).toFixed(1);
						this.PieDatasbackPies(this.dayAverageBorrowing, data.previewMonth);
					}else{
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
				var pieJsonsbackPie = {
					'color': ["#31859c", "#00FFFF"],
					'radius': ['88%','77%'],
					'center': ['50%', '50%'],
					'emphasis': true,
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				}
				if(previewMonth == "0" && dayAverageBorrowing == "0.0") {
					pieJsonsbackPie.color = ["#1D3F65", "#1D3F65"];
					}
				pieDatassbackPie.lege = "false";
				pieJsonsbackPie.emphasis = "false";
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById("sbackPie"));
					myChart.setOption(Pie(pieDatassbackPie, pieJsonsbackPie), true);
					allCharts.push(myChart)
				})
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.S-AType{
		position:relative;
	}
	.borrowing .boxtitle {
		color: #75CBF2;
	}
	
	.borrowing .timeselect {
		line-height: 1.2rem;
		font-size: 0.8rem;
		color: #71C7D5;
		position: absolute;
		top: 0.35rem;
		right: 0.65rem;
	}
	
	.bing {
		width: 100%;
		height: 100%;
		background: url(../../../../static/images/img6.png) no-repeat center;
		background-size:100% auto; 
		position: relative;
	}
	.bing>.vertical-middle{
		font-size:0px;
		text-align:justify;
	}
	.bing h4 {
		display:inline-block;
		width: 45%;	
		text-align:center;
		&.right{
			margin-left:10%
		}
	}
	.bing h4{
		&:nth-of-type(1),&:nth-of-type(2){
			margin-bottom:10%;
		}
	}
	
	.bing p {
		font-size: 1.1rem;
		font-family: 'DIN Medium';
		font-weight: 500;
		color: rgba(0, 255, 255, 1);
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		padding-bottom: 0.35rem;
		background-size: 5rem 3px;
	}
	
	.bing p i {
		color: #75CBF2;
		font-size:0.7rem;
	}
	
	.bing span {
		font-size: 0.8rem;
		color: #75cbf2;
		display: inline-block;
	}
	.bing-middle-c{
		position:absolute;
		top:0px;
		left:0px;
		width:100%;
		height:100%;	
		.bing-middle {
			position:relative;
			width: 40%;
			padding-bottom:40%;
			border-radius: 50%;
		}
	}
	.bing .Z-WMPieFont span {
		font-size: 16px;
		color: #75CBF2;
		background: none;
		display: block;
	}
	
	.bing .Z-WMPieFont i {
		margin-top: 39px;
		font-size:22px;
		color:#ffcc00;
		display:block;
     	padding-bottom: 5px;
     	background: none;
	}
	
	#sbackPie {
		width:100%;
		position:absolute;
		top:0px;
		bottom:0px;
		z-index: 1;
	}
	
</style>