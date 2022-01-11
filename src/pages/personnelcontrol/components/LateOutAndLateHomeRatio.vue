<template>
	<div>
		<h4 class="mdTitle">晚出晚归男女生占比</h4>
		<div class="block dataSelc">
		<el-date-picker v-model="value1" type="date" placeholder="选择日期" default-value @change="lateOutRDate" value-format="yyyy-MM-dd" :picker-options="pickerOptions1">
		</el-date-picker>
		</div>
		<ul class="C-bottom clearFix backboxContainer">
			<li class="C-rings fl">
				<div class="C-img"><img class="srcimg" src="../../../../static/images/woman.png"><span>女生</span></div>
				<div id="Annular"></div>
				<div class="ring-centers"><i class="Z-numberf">{{womanOutInRatio}}<em>%</em></i><span>晚出晚归</span></div>
				<div class="C-bottoms">
					<ul>
						<li class="clearFix"><span class="fl">晚出率</span><i class="fr Z-numberf">{{womanOutRatio}}<em>%</em></i></li>
						<li class="clearFix"><span class="fl">晚归率</span><i class="fr Z-numberf">{{womanInRatio}}<em>%</em></i></li>
					</ul>
				</div>
			</li>
			<li class="C-rings fr">
				<div class="C-img"><img class="srcimg" src="../../../../static/images/man.png"><span>男生</span></div>
				<div id="Bnnular"></div>
				<div class="ring-centers"><i class="Z-numberf">{{manOutInRatio}}<em>%</em></i><span>晚出晚归</span></div>
				<div class="C-bottoms">
					<ul>
						<li class="clearFix"><span class="fl">晚出率</span><i class="fr Z-numberf">{{manOutRatio}}<em>%</em></i></li>
						<li class="clearFix"><span class="fl">晚归率</span><i class="fr Z-numberf">{{manInRtio}}<em>%</em></i></li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import DateSelc from '../../components/dateSelection'
	export default {
		components: {
			DateSelc,
		},
		data() {
			return {
				value1:"",
				pickerOptions1: {
					disabledDate(time) {
						var oData=new Date();
						var lastDate=new Date(oData.getTime() - 24*60*60*1000);
						return time.getTime() > lastDate;
					},
				},
				datalist: [], //接口获取到的数据
				womanOutInRatio: "--", //女生晚出晚归比率
				womanOutRatio: "--", //女生晚出比率
				womanInRatio: "--", //女生晚归比率
				manOutInRatio:"--", //男生晚出晚归比率
				manOutRatio: "--", //男生晚出率
				manInRtio: "--", //男生晚归率
				analyDate:(new Date()).Format("yyyy-MM-dd "),
				AnnularJson :{
					'color': ["#1D3F65", "#1D3F65"],
					'radius': ['80%', '95%'],
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				},
				Annularring :[{value:0,name: "女生"}, {value:0, name: "总数"}]
			}
		},
		mounted: function() {
			this.getnightInOutSex();
			var oData=new Date();
			this.value1=new Date(oData.getTime() - 24*60*60*1000);
			this.BnnularPie("Bnnular",this.Annularring,this.AnnularJson)
			this.AnnularJson.lege = "false";
			this.AnnularJson.emphasis = "false";
			this.BnnularPie("Annular",this.Annularring,this.AnnularJson)
		},
		methods: {
			lateOutRDate(mes){
				this.analyDate=mes;
				if(this.analyDate){
					this.getnightInOutSex()
				}
			},
			getnightInOutSex() {
				var _this = this;
				var parames = new FormData();
				parames.append("analyDate", this.analyDate)
				this.$axios.post('/traffic/people/nightInOutSex/' + UNITID, parames)
				.then(this.getnightInOutSexSucc)
			},
			getnightInOutSexSucc(res){
				var data = res || [];
					this.datalist = data;
					//女生晚出晚归比率
					if((((data.womanIn + data.womanOut) / data.womanAll) * 100).toFixed(2) != 'NaN') {
						this.womanOutInRatio = (((data.womanIn + data.womanOut) / data.womanAll) * 100).toFixed(2);
					}
					//女生晚出比率
					if(((data.womanOut / data.womanAll) * 100).toFixed(2) != 'NaN') {
						this.womanOutRatio = ((data.womanOut / data.womanAll) * 100).toFixed(2);
					}
					//女生晚归比率
					if(((data.womanIn / data.womanAll) * 100).toFixed(2) != 'NaN') {
						this.womanInRatio = ((data.womanIn / data.womanAll) * 100).toFixed(2);
					}
					//男生晚出晚归比率
					if((((data.manIn + data.manOut) / data.manAll) * 100).toFixed(2) != 'NaN') {
						this.manOutInRatio = (((data.manIn + data.manOut) / data.manAll) * 100).toFixed(2);
					}
					//男生晚出率				
					if(((data.manOut / data.manAll) * 100).toFixed(2) != 'NaN') {
						this.manOutRatio = ((data.manOut / data.manAll) * 100).toFixed(2);
					}
					//男生晚归率
					if(((data.manIn / data.manAll) * 100).toFixed(2) != 'NaN') {
						this.manInRtio = ((data.manIn / data.manAll) * 100).toFixed(2);
					}
					this.setAnnular(); //女生pie图
					this.setBnnular(); //男生pie图
			},
			/*晚出晚归 总数 --女生比率*/
			setAnnular() {
				var Annularring = [{
					value: (this.datalist.womanIn + this.datalist.womanOut), //晚出晚归
					name: "女生"
				}, {
					value: this.datalist.womanAll, //女生总数
					name: "总数"
				}]
				this.AnnularJson.color=["#FF8DC3", "#1D3F65"];
				this.AnnularJson.lege = "false";
				this.AnnularJson.emphasis = "false";
				this.BnnularPie("Annular",Annularring,this.AnnularJson)
				
			},
			/*晚出晚归总数 --男生比率*/
			setBnnular(ID) {
				var Bnnularring = [{
					value: (this.datalist.manIn + this.datalist.manOut), //男生晚出晚归总数
					name: "男生"
				}, {
					value: this.datalist.manAll, //男生总数
					name: "总数"
				}]
				this.AnnularJson.color=["#0087C4", "#1D3F65"];
				this.AnnularJson.lege = "false";
				this.AnnularJson.emphasis = "false";
				this.BnnularPie("Bnnular",Bnnularring,this.AnnularJson)
				
			},
			BnnularPie(id,ostyle,Json){
				var myChart = echarts.init(document.getElementById(id));
				myChart.setOption(Pie(ostyle, Json), true);
				allCharts.push(myChart)
			}
		}

	}
</script>

<style lang="stylus" scoped>
	.timeTab .timeTabin {
		height: 24px;
		color: #999;
		font-size: 18px;
		width: 105px;
		padding-right: 20px;
		background: none;
		text-align: center
	}
	
	.timeTab {
		min-width: 94px;
		line-height: 24px;
		font-size: 16px;
		cursor: pointer;
		padding-left: 9px;
		color: #71c7d5;
		border: 1px solid rgba(74, 172, 219, 0.5);
		border-radius: 4px;
		background: url(../../../../static/images/img3.png) no-repeat right 10px center;
		position: absolute;
		top: 7px;
		right: 13px;
	}
	
	.ring-centers {
		width: 100%;
		text-align: center;
		top: 30%;
		left:0px;
		cursor: pointer;
		background-size: 90px 3px;
		position: absolute;
	}
	
	.ring-centers i {
		font-size: 1.1rem;
		color:#FFCC00;
		display: block;
		padding-bottom: 0.25rem;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 46%;
		
	}
	.ring-centers i em{
		font-size:0.7rem;
		color:#75cbf2;
		margin-left: 0.15rem;
	}
	.ring-centers span {
		font-size: 0.8rem;
		display: block;
		margin-top: 0.3rem;
		color: #75cbf2;
	}
	
	.C-bottoms li {
		line-height:1.2rem;
		font-size: 0.8rem;
		color: rgba(117, 203, 242, 1);
		padding:0px 1rem;
	}
	.C-bottoms li span{
		font-size: 0.8rem;
	}
	.C-bottoms li em{
		font-size:0.7rem;
		color:#75cbf2;
		margin-left: 0.15rem;
	}
	.C-bottoms li i {
		font-size: 1rem;
		font-family: "DIN Medium";
		color:#0ff;
	}
	
	.C-bottoms li p {
		font-size: 0.9rem;
		text-align: center;
		position: relative;
	}
	
	.C-bottoms img {
		height: 1.6rem;
		width: 1.5rem;
		position: absolute;
	}
	
	.C-bottoms .bottomimg1 {
		top: 0px;
		right: 46px;
	}
	
	.C-bottoms .bottomimg2 {
		top: 33px;
		right: 46px;
	}
	
	.C-bottom .C-rings {
		height: 100%;
		position: relative;
		width: 48%;
	}
	
	.C-img {
		height: 1.65rem;
		width: 100%;
		text-align: center;
		font-size: 0.8rem;
		font-family: "Microsoft Yahei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
	}
	
	.C-img .srcimg {
		display:inline-block;
		height: 1.45rem;
		width: 0.75rem;
		margin-right:0.2rem;
		vertical-align:middle;
	}
	.C-img span{
		display:inline-block;
		vertical-align:middle;
	}
	#Annular,#Bnnular{
		height: 60%;
		width: 100%;
		z-index:9;
	}
	
</style>