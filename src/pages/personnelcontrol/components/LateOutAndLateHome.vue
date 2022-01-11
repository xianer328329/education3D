<template>
	<div>
		<h4 class="mdTitle">晚出晚归</h4>
		<div class="block dataSelc">
			<span class="demonstration"></span>
			<el-date-picker v-model="value1" type="date" placeholder="选择日期" default-value @change="lateOutDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
			</el-date-picker>
		</div>
		<ul class="C-bottom clearFix backboxContainer">
			<li class="C-ring fl">
				<div id="ring"></div>
				<div class="ring-center  Z-numberf"><i>{{InOutRatio}}<small>%</small></i><span>晚出晚归</span></div>
				<div class="C-bottoms">
					<ul>
						<li class="clearFix"><span class="fl">环比昨日</span><i class="fr">{{todaythenyesterdat}}<small>%</small>
							<img class="imgs bimg1"  :src="require('../../../../static/images/'+todayimgsrc+'.png')" />
						</i></li>
						<li class="clearFix"><span class="fl">同比上周</span><i class="fr">{{todaythenweek}}<small>%</small>
							<img class="imgs bimg2" :src="require('../../../../static/images/'+weekimgsrc+'.png')" />
						</i></li>
					</ul>
				</div>
			</li>
			<li class="BlockData fr vertical-middle-c">
				<div class="vertical-middle">
					<div class="BlockDataTitle">
						<div class="C-bdullitext">各年级晚出晚归率</div>
					</div>
					<div class="uli">
						<p v-for="data in ToDaynlist">
							<span>{{data.staffGrade}}级</span>
							<i class="fr color0ff Z-numberf">{{data.inoutratio}}<small>%</small></i>
						</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>

	export default {
		data() {
			return {
				show: false,
				pickerOptions1: {
					disabledDate(time) {
						var oData=new Date();
						var lastDate=new Date(oData.getTime() - 24*60*60*1000);
						return time.getTime() > lastDate;
					},
				},
				value1:"",
				ToDaynlist: [{
						"inoutratio": '--',
						"staffGrade": "--"
					},
					{
						"inoutratio": '--',
						"staffGrade": "--"
					},
					{
						"inoutratio": "--",
						"staffGrade": "--"
					}, {
						"inoutratio": "--",
						"staffGrade": "--"
					}
				], //晚出晚归率
				oneNighratio: '--', //一年级玩出晚归率
				twoNightratio: '--', //二年级玩出晚归率
				threeNightratio: '--', //三年级玩出晚归率
				fourNightratio: '--', //四年级玩出晚归率
				InOutRatio: '--', //总玩出晚归率
				todaythenyesterdat: '--', //今天比昨天上升or下降
				todaythenweek: '--', //今天比上周上升or下降
				todayimgsrc: 'Arrow2', //同比昨日图标默认值
				weekimgsrc: "Arrow1", //同比上周图标默认值
				upimgsrc: "Arrow2", //上升图标
				lowerimgsrc: "Arrow1", //下架图标
				analyDate:(new Date()).Format("yyyy-MM-dd "),
			}
		},
		mounted: function() {
			this.setleftring(); //晚出晚归 圆环图
			this.getnightInOutGrade(); //调取接口
			var oData=new Date();
			this.value1=new Date(oData.getTime() - 24*60*60*1000);
		},
		methods: {
			lateOutDate(mes){
				this.analyDate=mes;
				if(this.analyDate){
					this.getnightInOutGrade()
				}
			},
			getToDaynightInOutGrade() { //获取今天的玩出晚归数据
				var parame = new FormData();
				parame.append('analyDate', this.analyDate);
				return this.$axios.post('/traffic/people/nightInOutGrade/' + UNITID, parame);
			},
			getYesterdaynightInOutGrade() { //获取昨天玩出晚归数据
				var parame = new FormData();
				var myDate = new Date(this.analyDate); //获取当前时间
				var Yesterday = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate() - 1); //获取昨天日期
				parame.append('analyDate', Yesterday);
				return this.$axios.post('/traffic/people/nightInOutGrade/' + UNITID, parame);
			},
			getweeknightInOutGrade() { //获取周同比玩出晚归数据
				var parame = new FormData();
				var myDate = new Date(this.analyDate); //获取当前时间
				var weekday = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate() - 7); //获取上周同期日期
				parame.append('analyDate', weekday);
				return this.$axios.post('/traffic/people/nightInOutGrade/' + UNITID, parame);
			},
			getnightInOutGrade() {
				var _this = this;
				this.$axios.all([this.getToDaynightInOutGrade(), this.getYesterdaynightInOutGrade(), this.getweeknightInOutGrade()]).then(
					this.$axios.spread(function(ToDayndata, Yesterdaydata, weekndata) {
							_this.getnightInOutGradeSucc(ToDayndata, Yesterdaydata, weekndata)
					})
				)
			},
			getnightInOutGradeSucc(ToDayndata, Yesterdaydata, weekndata){
				var data = ToDayndata.gradeList || []; //当天数据
						var Yesterdaylist = Yesterdaydata.gradeList || []; //昨天数据
						var weeknlist = weekndata.gradeList || []; //上周同期数据
						var totaluse = 0; //当日晚出晚归总人数
						var totalcount = 0; //当日归寝总人数
						if(data.length > 0) {
							this.ToDaynlist.forEach((ite, i) => {
								data.forEach((item, index) => {
									if(index == i) {
										totaluse += item.nightInOut;
										totalcount += item.allInOutUse;
										if(item.allInOutUse=="0"){
											item.inoutratio="0.00"
										}else{
											item.inoutratio = (item.nightInOut / item.allInOutUse*100).toFixed(2);
										}

										this.ToDaynlist[index].inoutratio = item.inoutratio;
										this.ToDaynlist[index].staffGrade = item.staffGrade;
									}

								})
								if(ite.inoutratio == '--') {
									this.ToDaynlist.splice(i, 1);
								}
							})
             this.ToDaynlist= this.ToDaynlist.filter(item=>{
               return item.inoutratio!='--';
             })
						}
						//今天总晚出晚归率，保留一位小数
						var todaynOutRatio =null;
						if(totalcount != 0) {
							todaynOutRatio = (totaluse / totalcount*100).toFixed(2);
							this.InOutRatio = todaynOutRatio;
						}
						var Yesterdaytotaluse = null; //昨日玩出晚归总人数
						var Yesterdaytotalcount = 0; //昨日归寝总人数
						Yesterdaylist.forEach((data) => {
							Yesterdaytotaluse += data.nightInOut;
							Yesterdaytotalcount += data.allInOutUse;
						})
						//昨天晚出晚归率,保留一位小数
						var YesterdayInOutRatio = 0;
						if(Yesterdaytotalcount != 0) {
							YesterdayInOutRatio = (Yesterdaytotaluse / Yesterdaytotalcount*100).toFixed(2);
						}
						//今天与昨天对比
						if(todaynOutRatio&&YesterdayInOutRatio){
							if(todaynOutRatio > YesterdayInOutRatio) {
							this.todaythenyesterdat =Math.abs((todaynOutRatio - YesterdayInOutRatio).toFixed(2));
							this.todayimgsrc = this.upimgsrc; //大于  替换为上升图标
						} else {
							this.todaythenyesterdat = Math.abs((YesterdayInOutRatio - todaynOutRatio).toFixed(2));
							this.todayimgsrc = this.lowerimgsrc; //小于  替换为下降图标
						}
						}


						var weekntotaluse = 0; //上周同比玩出晚归总人数
						var weekntotalcount = 0; //上周同比归寝总人数
						weeknlist.forEach((item) => {
							weekntotaluse += item.nightInOut;
							weekntotalcount += item.allInOutUse;
						})
						var weekntInOutRatio =0;
						if(weekntotalcount != 0) { //被除数不能为0
							weekntInOutRatio = (weekntotaluse / weekntotalcount*100).toFixed(2);
						}
						if(todaynOutRatio&&weekntInOutRatio){
							if(todaynOutRatio > weekntInOutRatio) {
							this.todaythenweek = Math.abs((todaynOutRatio - weekntInOutRatio).toFixed(2));
							this.weekimgsrc = this.upimgsrc; //大于  替换为上升图标
							} else {
							this.todaythenweek = Math.abs((weekntInOutRatio - todaynOutRatio).toFixed(2));
							this.weekimgsrc = this.lowerimgsrc //小于  替换为下降图标

						}
						}else{
							this.todaythenweek = '0.00'
						}

						this.setleftring(totaluse, totalcount);
			},
			/*晚出晚归 圆环图*/
			setleftring(totaluse, totalcount) {
				totaluse=totaluse||0;
				totalcount=totalcount||0;
				var leftring = [{
						value: totaluse,
						name: "玩出晚归人数"
					},
					{
						value: totalcount,
						name: "归寝总人数"
					},
				]
				var leftringJson = {
					'color': ["#FFCC00", "#1D3F65"],
					'radius': ['90%', '80%'],
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				};
				if(totaluse=="0"&&totalcount=="0"){
					leftringJson.color=["#1D3F65", "#1D3F65"]
				}
				leftringJson.lege = "false";
				leftringJson.emphasis = "false";
				var myChart = echarts.init(document.getElementById("ring"));
				myChart.setOption(Pie(leftring, leftringJson), true);
				allCharts.push(myChart);
			},
		}
	}
</script>
<style lang="stylus" scoped>
	.C-bottom .C-ring {
		float: left;
		width:40%;
		height: 100%;
		position: relative;
	}
	.C-bottom .BlockData{
		width:58%;
		height:100%;
	}
	#ring {
		height: 60%;
		width: 100%;
	}

	.ring-center {
		width: 100%;
		text-align: center;
		top: 20%;
		left: 0px;
		cursor: pointer;
		background-size: 90px 3px;
		position: absolute;
	}

	.ring-center i {
		font-size: 1.1rem;
		color: #ffcc00;
		display: block;
		padding-bottom: 0.25rem;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 60%;
	}

	small {
		font-size: 14px;
		color: rgba(117, 203, 242, 1);
		margin-left: 3px;
	}

	.ring-center span {
		font-size: 0.8rem;
		display: block;
		margin-top: 0.3rem;
		color: #75cbf2;
	}

	.C-bottoms li {
		line-height: 1.6rem;
		font-size: 0.8rem;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}

	.C-bottoms li span {
		font-size: 0.8rem;
	}

	.C-bottoms li i {
		font-size: 1rem;
		font-family: "DIN Medium";
		color: #0ff;
	}

	.C-bottoms li p {
		font-size: 0.9rem;
		text-align: center;
		position: relative;
	}

	.C-bottoms .imgs {
		height: 1rem;
		width: 1rem;
		display: inline-block;
		vertical-align: middle;
	}

	.timeTab {
		min-width: 94px;
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
	.BlockData .uli p{height:2.1rem; line-height: 2.1rem;}

</style>
