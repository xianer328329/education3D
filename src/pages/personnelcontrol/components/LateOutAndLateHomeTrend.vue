<template>
	<div class="C-BTM2 clearFix">
		<h4 class="mdTitle">晚出晚归趋势</h4>
		<div class="h-time-c">
			<a :class="{'active':index==0}" @click="getnightInOutTrend(0)">最近30天</a>
			<a :class="{'active':index==1}" @click="getnightInOutTrend(1)">最近12个月</a>
		</div>
		<div class="backboxContainer">
			<ul class="amountCom amountBoxUp clearFix">
				<li class="fl amount">
					<div class="amount-content">
						<span><i>{{TMinlistNum}}</i>次</span>
						<p>晚归累计</p>
					</div>
				</li>
				<li class="fr amount">
					<div class="amount-content">
						<span><i>{{TMoutlistNum}}</i>次</span>
						<p>晚出累计</p>
					</div>
				</li>
			</ul>
			<ul class="lent fr">
				<li>
					<div class="greenlent"></div><span class="lenttext">晚归</span>
				</li>
				<li>
					<div class="bluelent"></div><span class="lenttext">晚出</span>
				</li>
			</ul>
			<div class="BTrenBar" id="DecemberBar"></div>
			
		</div>
	</div>
</template>

<script>
	var mTime3 = null;
	export default {
		data() {
			return {
				index: 0, //切换下标
				TMinlistNum:"--",
				TMoutlistNum: "--",
				trendType: [{
					"trendType": "30Day"
				}, {
					"trendType": "12Month"
				}],
			}
		},
		mounted: function() {

			this.getnightInOutTrend(0);
		},
		methods: {
			getThirtyday() {
				var param = new FormData();
				param.append('trendType', '30Day');
				return this.$axios.post('/traffic/people/nightInOutTrend/' + UNITID, param);
			},
			getnightInOutTrend(index) {
				this.index = index;
				var url = '/traffic/people/nightInOutTrend/' + UNITID + "?trendType=" + this.trendType[index].trendType;
				this.$axios.post(url).then(this.getnightInOutTrendSucc)
			},
			getnightInOutTrendSucc(res){
				var TMdata = res.trendList || []; //晚归数据
					var TMinlist = [];
					var TMoutlist = [];
					var TMdate = []; //时间轴
					var TMinlistNum = 0; //晚归累计
					var TMoutlistNum = 0; //晚出累计
					var FormerDecember = this.getdate(); //获取当前时间前12月
					var daycount = this.getday(); //获取最近30天
					if(this.index == 0) {
						daycount.forEach((it, index) => {
							TMdata.forEach((item, indexs) => {
								if(item.useTime == it) {
									TMinlist.push(item.manIn);
									TMoutlist.push("-" + item.manOut);
									TMdate.push(item.useTime)
									TMinlistNum += item.manIn
									TMoutlistNum += item.manOut
								}
							})
							var flag = TMdate.indexOf(it)
							if(flag == -1) {
								TMdate.push(it);
								TMinlist.push(0);
								TMoutlist.push(0)
							}

						})
					}
					if(this.index == 1) {
					
						FormerDecember.forEach((it, index) => {
							TMdata.forEach((item, indexs) => {
								if(item.useTime == it) {
									TMinlist.push(item.manIn);
									TMoutlist.push("-" + item.manOut);
									TMdate.push(item.useTime)
									TMinlistNum += item.manIn
									TMoutlistNum += item.manOut
								}
							})
							var flag = TMdate.indexOf(it)
							if(flag == -1) {
								TMdate.push(it);
								TMinlist.push(0);
								TMoutlist.push(0)
							}

						})
					}
					TMinlist.reverse(); //由于循环将素组重新排序了，所以要倒序排序
					TMoutlist.reverse(); //倒序排序
					TMdate.reverse(); //倒序排序
					this.TMinlistNum = TMinlistNum;
					this.TMoutlistNum = TMoutlistNum;
					this.Decemberdata(TMinlist, TMoutlist, TMdate); //12月琴状图
			},
			getdate() {
				var dataArr = [];
				var data = new Date();
				var year = data.getFullYear();
				data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
				for(var i = 0; i < 12; i++) {
					data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
					var m = data.getMonth() + 1;
					m = m < 10 ? "0" + m : m;
					dataArr.push(data.getFullYear() + "-" + (m))
				}
				return dataArr;
			},
			getday() {
				var lastMonth = [];
				for(var i = 0; i < 30; i++) {
					var data = new Date(new Date().setDate(new Date().getDate() - i))
					var Month = data.getMonth() + 1;
				//	Month = Month < 10 ? "0" + Month : Month;
					lastMonth.push(data.getFullYear() + '-' + toDub(Month)+ '-' + toDub(data.getDate()))
				}
				return lastMonth;
			},
			Decemberdata(TMinlist, TMoutlist, TMdate) { //12月玩出晚归琴状图

				var barJson = {
					name: '12月晚出晚归趋势图',
					oxAxis: TMdate,
					data1: TMinlist,
					data2: TMoutlist,
					color: ["#00fffc"],
					size: 30,
					grid: {
						left: 10,
						right: 50,
						bottom: 10,
						top: 0,
						containLabel: true
					},
				}
				var myChart = echarts.init(document.getElementById("DecemberBar"));
				myChart.setOption(starrenbar(barJson), true);
				allCharts.push(myChart);
				var index = 0;
				clearInterval(mTime3);
				mTime3 = setInterval(function() {
					myChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: index
					});
					index++;
					if(index > barJson.data2.length) {
						index = 0;
					}
				}, 3000);
			},
		}
	}
</script>

<style lang="stylus" scoped>
	.backboxContainer{
		position:relative;
		.BTrenBar{
			position:absolute;
			top:4rem;
			bottom:0px;
			left:0px;
			width:100%;
		}
	}
	.lent {
		margin-top:0.2rem;
	}
	
	.lent li {
		display:inline-block;
		line-height: 0.7rem;
	}
	
	.bluelent {
		width: 0.2rem;
		height: 0.7rem;
		background: #207096;
		position: absolute;
	}
	
	.lenttext {
		margin-left: 0.5rem;
		font-size: 0.7rem;
		color: rgba(153, 153, 153, 1);
	}
	
	.greenlent {
		width: 0.2rem;
		height: 0.7rem;
		background: rgba(46, 209, 103, 1);
		position: absolute;
	}
	.C-BTM2 .amount {
		width: 49%;
		height:auto;
		padding:0.2rem 0px;
	}
	
	.amountBoxUp .amount span {
		margin-top: 0px;
	}
	
	.C-BTM2.amountBoxUp .amount p {
		line-height: 27px;
	}
</style>