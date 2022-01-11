<template>
	<div class="eatansl">
		<h4 class="mdTitle">就餐分析</h4>
		<div class="timeselect">2019-01</div>
		<ul class="S-bottom">
			<li class="b-li">
				<div id="bottomli"></div>
				<div class="b-len clearFix"><span class="fl">男生占比</span><i class="Z-numberf fr">{{manProportion}}<small>%</small></i></div>
				<div class="b-len clearFix"><span class="fl">女生占比</span><i class="Z-numberf fr">{{womanProportion}}<small>%</small></i></div>
			</li>
			<li class="b-li2">
				<div id="CustomizedPie"></div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				manProportion: "--", //男生占比
				womanProportion: "--", //女生占比
			}
		},
		mounted: function() {
			this.geteatGrade(); //获取就餐分析数据
		},
		methods: {
			geteatGrade() {
				var myDate = new Date(); //获取当前时间
				var daydate = "2019-01-22";
				//myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate()); //获取当前同期日期
				var params = new FormData();
				params.append('analyDate', daydate);
				this.$axios.post('/traffic/life/eatGrade/' + UNITID, params).then((res) => {

					var data = res.gradeList || [];
					var usercount = 0; //就餐总人数
					var onegradeEatcount = 0; //一年级用餐人数
					var manusercount = 0; //男生用餐总人数
					var womanusercount = 0; //女生用餐总人数
					data.forEach((item) => {
						usercount += item.allEatUse;
						manusercount += item.manEatUse;
						womanusercount += item.womanEatUse;
						item.value = item.allEatUse;
						item.name = item.staffGrade + "级";

					})
					if(usercount != 0) { //被除数不能为0
						this.manProportion = (manusercount / usercount).toFixed(1) * 100;
						this.womanProportion = (womanusercount / usercount).toFixed(1) * 100;
					}
					this.PieDatastudent(manusercount, womanusercount); //就餐分析 男女生对比圆形图
					this.CustomizedPiebottompies(data); //就餐分析 年级对比图
				});
			},
			/*就餐分析 男女生对比圆形图*/
			PieDatastudent(manEatUse, womanEatUse) {
				var pietitle = [{
						value: manEatUse,
						name: "男生"
					},
					{
						value: womanEatUse,
						name: "女生"
					},
				]
				var pieJsondata = {
					'color': ["#0087C4", "#FF8DC3"],
					'radius': '60',
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				}
				pieJsondata.lege = "false";
				pieJsondata.emphasis = "false";
				var myChart = echarts.init(document.getElementById("bottomli"));
				myChart.setOption(Pie(pietitle, pieJsondata), true);
			},
			/*就餐分析 年级对比图*/
			CustomizedPiebottompies(data) {
				
				if(data.length==0){
					data = [{
					allEatUse: 0,
					manEatUse: 0,
					name: "2016级",
					staffGrade: "2016",
					value: 0,
					womanEatUse: 0
				}, {
					allEatUse:0,
					manEatUse: 0,
					name: "2017级",
					staffGrade: "2017",
					value: 0,
					womanEatUse: 0
				} ,{
					allEatUse: 0,
					manEatUse: 0,
					name: "2018级",
					staffGrade: "2018",
					value: 0,
					womanEatUse: 0
				}]
				}
				var pie3Datasbottompie = data;
				var pie3Jsonbottompie = {
					'title': '就餐分析',
					'titleshow': false,
					'labelfontSize': 14,
					'labelcolor': 'rgba(117,203,242,1)',
					'labelLine': 'rgba(255,255,255,1)',
				}
				var myChart = echarts.init(document.getElementById("CustomizedPie"));
				myChart.setOption(CustomizedPie(pie3Datasbottompie, pie3Jsonbottompie), true);
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.eatansl .S-bottom {
		height: 100%;
		width: 100%;
		margin-top: 10px;
	}
	
	.eatansl .S-bottom li {
		height: 100%;
		width: 20%;
		float: left;
	}
	
	.eatansl .S-bottom .b-li {
		height: 242px;
		width: 150px;
	}
	
	.eatansl .S-bottom .b-li2 {
		height: 242px;
		width: 270px;
	}
	
	#bottomli {
		height: 150px;
		width: 150px;
		margin-top: 20px;
	}
	
	#CustomizedPie {
		height: 248px;
		width: 286px;
	}
	
	.eatansl .b-len {
		padding: 0 10px;
		line-height: 24px;
	}
	
	.eatansl .b-len span {
		font-size: 14px;
		color: rgba(117, 203, 242, 1);
	}
	
	.eatansl .b-len i {
		margin-left: 15px;
		font-size: 22px;
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
	}
	
	.eatansl .b-len small {
		font-family: 'DIN Medium';
		font-size: 14px;
		color: #75cbf2;
		margin-left: 3px;
	}
	

	.eatansl .timeselect {
		min-width: 103px;
		line-height: 24px;
		font-size: 16px;
		cursor: pointer;
		padding-left: 9px;
		color: #71C7D5;
		border: 1px solid rgba(74, 172, 219, 0.5);
		border-radius: 4px;
		background: url(../../../../static/images/img3.png) no-repeat right 10px center;
		position: absolute;
		top: 7px;
		right: 13px;
	}
</style>