<template>

	<div class="schoollife">
		<h4 class="boxtitle">校园生活</h4>
		<month-selc :ondate="analyDate" @monDateTimeChange='schoollifeDate'></month-selc>
		<ul class="clearFix backboxContainer">
			<li class="top clearFix">
				<div class="Leftupper clearFix">
					<div class="Leftupper-t fl vertical-middle-c">
						<img src="../../../../static/images/life2.png" alt="" class="vertical-middle"/>
					</div>
					<div class="Leftupper-b vertical-middle-c">
						<div class="vertical-middle">
							<i class="Z-numberf">{{dayeatcount}}<small>人次</small></i>
							<p>日均就餐</p>
						</div>
					</div>
				</div>
				<div class="Leftupper clearFix">
					<div class="Leftupper-t fl  vertical-middle-c"><img src="../../../../static/images/left4.png" alt=""  class="vertical-middle"/></div>
					<div class="Leftupper-b vertical-middle-c">
						<div class="vertical-middle">
							<i class="Z-numberf">{{daypreview}}<small>人次</small></i>
							<p>日均借阅</p>
						</div>
					</div>
				</div>
			</li>
			<li class="clearFix">
				<div class="Leftupper clearFix">
					<div class="Leftupper-t fl vertical-middle-c"><img src="../../../../static/images/life1.png" alt=""  class="vertical-middle"/></div>
					<div class="Leftupper-b vertical-middle-c">
						<div class="vertical-middle">
							<i class="Z-numberf">{{dayeat}}<small>元</small></i>
							<p>人均每餐消费</p>
						</div>
					</div>
				</div>
				<div class="Leftupper clearFix">
					<div class="Leftupper-t fl vertical-middle-c"><img src="../../../../static/images/life3.png" alt=""  class="vertical-middle"/></div>
					<div class="Leftupper-b vertical-middle-c">
						<div class="vertical-middle"> 
							<i class="Z-numberf">{{monthpreview}}<small>次</small></i>
							<p>人均每月借阅</p>
						</div>
					</div>
				</div>
			</li>

		</ul>
	</div>

</template>

<script>
	import MonthSelc from '../../components/monthSelection'
	export default {
		components: {
			MonthSelc,
		},
		data() {
			return {
				dayeatcount: '--', //日均就餐人次
				dayeat: '--', //人均每餐消费
				daypreview: '--', //日均借阅人数
				monthpreview: '--', //人均每月借阅
				usemonthcount: '--', //人均每月缴费
				monthPayratio: '--', //缴费占比
				analyDate:null,
				oToday: null, //天数
			}
		},
		mounted: function() {
			var nowdays = new Date();
			var year = nowdays.getFullYear();
			var month = nowdays.getMonth();
			if(month == 0) {
				month = 12;
				year = year - 1;
			}
			if(month < 10) {
				month = "0" + month;
			}
			var myDate = new Date(year, month, 0);
			this.analyDate = year + "-" + month + "-" + myDate.getDate();
			this.oToday=myDate.getDate();
			this.getlifeAnalyze(); //获取数据
		},
		methods: {
			schoollifeDate(mes) {
				var arr = mes.split('-')
				var oM = (new Date()).Format("MM");
				if(oM == arr[1]) {
					this.analyDate = (new Date()).Format("yyyy-MM-dd ");
					this.oToday = (new Date()).Format("dd") - 1;
				} else {
					var oday = new Date(arr[0], arr[1], 0); //最后一个参数为0,意为获取2018年10月一共多少天
					var oDate = oday.getDate();
					this.analyDate = mes + '-' + oDate;
					this.oToday = oDate
				}
				if(this.analyDate) {
					this.getlifeAnalyze()
				}
			},

			getlifeAnalyze() {
				var _this = this;
				var params = new FormData();
				params.append('analyDate', this.analyDate);
				this.$axios.post('/traffic/life/lifeAnalyze/' + UNITID, params).then((res) => {
					var data = res || [];
					/*
					 * data.eatTotal 当月当前日期的用餐总人数
					 * today 当前日期
					 */
					this.dayeatcount = '--'; //日均就餐人次
					this.dayeat = '--'; //人均每餐消费
					this.daypreview = '--'; //日均借阅人数
					this.monthpreview = '--'; //人均每月借阅
					this.usemonthcount = '--'; //人均每月缴费
					this.monthPayratio = '--'; //缴费占比

					if(data.eatCount) {
						if(this.oToday==0){
							this.dayeatcount="--";
							this.dayeat="--";
						}else{
							this.dayeatcount = (data.eatCount / this.oToday).toFixed(0); //日均就餐人次
							this.dayeat = (data.eatTotal / data.eatCount).toFixed(1); //人均每餐消费
						}
					} else if(data.eatCount == "0") {
						this.dayeat = 0.0;
					}
					if(data.previewCount && data.previewCount != 0) {
						if(this.oToday==0){
							this.daypreview="--";
							this.monthpreview="--";
						}else{
							this.daypreview = (data.previewCount / this.oToday).toFixed(1); //日均借阅人数
							this.monthpreview = (data.staffCount / data.previewCount).toFixed(1) //人均每月借阅
						}
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.backboxContainer li{
		width: 100%;
		height: 49%;
		margin-bottom:1%;
	}
	.Leftupper-b small {
		width: 2rem;
		height: 0.8rem;
		font-size: 0.6rem;
		font-family: "Microsoft YaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		margin-left: 0.3rem;
	}
	
	.Leftupper-b i {
		font-size: 1.1rem;
		color: rgba(15, 255, 255, 1);
		display: block;
		background: url(../../../../static/images/img4.png) no-repeat center bottom;
		background-size: 90% 3px;
	}
	
	.Leftupper-b {
		height: 100%;
		overflow: hidden;
		text-align: center;
		line-height: 2rem;
	}
	
	.Leftupper-b p {
		font-size: 0.8rem;
		color: #75CBF2;
	}
	
	.Leftupper-t {
		text-align: center;
		width: 3.5rem;
		height: 100%;
	}
	
	.Leftupper-t img {
		display: inline-block;
		width: 2.5rem;
		height: 2.5rem;
		margin: 0 auto;
	}
	
	.Leftupper {
		float: left;
		width: 49%;
		height: 100%;
		margin-right: 1%;
		background: #0A3F5E;
	}
	
	.top {
		margin-top: 0.5rem;
	}
	
	.boxtitle {
		color: #75CBF2;
	}
	
	.timeselect {
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