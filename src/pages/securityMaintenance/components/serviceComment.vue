<template>
	<div class="h-container">
		<h4 class="boxtitle">服务评价</h4>
		<div class="h-time-c">
			<!--<a :class="{active:curr==1}" @click="operate(1)">上月</a>
			<a :class="{active:curr==2}" @click="operate(2)">本月</a>-->
			<month-selc :ondate="analyDate" @monDateTimeChange='consumDate'></month-selc>
		</div>
		<div class="h-content backboxContainer">
			<div class="fl h-left vertical-middle-c">
				<div class="vertical-middle">
					<div class="h-icon h-icon1">
						<img src="../../../../static/images/fireMaintenance/d40_03.png" />
					</div>
					<div class="h-icon h-icon2">
						<img src="../../../../static/images/fireMaintenance/d45_03.png" />
					</div>
					<div class="h-icon h-icon3">
						<img src="../../../../static/images/fireMaintenance/d44_03.png" />
					</div>
					<div class="h-icon h-icon4">
						<img src="../../../../static/images/fireMaintenance/d43_03.png" />
					</div>
					<div class="h-icon h-icon5">
						<img src="../../../../static/images/fireMaintenance/d42_03.png" />
					</div>
					<div class="h-icon h-icon6">
						<img src="../../../../static/images/fireMaintenance/d41_03.png" />
					</div>
					<div class="h-score">
						<i class="Z-numberf">{{listdata.avgScore}}</i>
						<span>分</span>
					</div>
				</div>
			</div>
			<div class="h-right vertical-middle-c">
				<ul class="clearFix vertical-middle">
					<!-- active-->
					<li class="service-icon1">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalMoni}}</b>
								<i>分</i>
							</span>
							<p>远程监测</p>
						</div>
					</li>
					<li class="service-icon4">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalAbil}}</b>
								<i>分</i>
							</span>
							<p>服务能力</p>
						</div>
					</li>
					<li class="service-icon2">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalCorr}}</b>
								<i>分</i>
							</span>
							<p>响应时间</p>
						</div>
					</li>
					<li class="service-icon5">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalQual}}</b>
								<i>分</i>
							</span>
							<p>服务质量</p>
						</div>
					</li>
					<li class="service-icon3">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalWork}}</b>
								<i>分</i>
							</span>
							<p>工单执行</p>
						</div>
					</li>
					<li class="service-icon6">
						<div>
							<span class="h-fr">
								<b class="Z-numberf">{{listdata.evalAtti}}</b>
								<i>分</i>
							</span>
							<p>服务态度</p>
						</div>
					</li>
				</ul>
				<div class="h-placeholder">
					<a class="h-fr">下发</a>
					<p>运维单位 {{listdata.prodName}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var mTime;
	import MonthSelc from '../../components/monthSelection'
	export default {
		components: {
			MonthSelc,
		},
		data() {
			return {
				curr: 1,
				lists: [], //数据
				listdata: {
					avgScore: '--',
					evalMoni: '--',
					evalAbil: "--",
					evalCorr: '--',
					evalQual: '--',
					evalWork: '--',
					evalAtti: '--',
					prodName:'--',
				},
				analyDate: null,
			}
		},
		mounted() {
			this.operate(1);
		},
		methods: {
			consumDate(mes) {
				this.getdata(mes);
			},
			getdata(month) {
				let params = {};
				params.evalTime = month;
				params.evalType = "1";
				params.prodUuid = "maintain_2";
				this.$axios.post("/working/monitor/aEvalInfo", params).then((res) => {
					if(res.length != 0) {
						let data = res[0];
						this.listdata = data;
					} else {
						this.listdata = {
							avgScore: '--',
							evalMoni: '--',
							evalAbil: "--",
							evalCorr: '--',
							evalQual: '--',
							evalWork: '--',
							evalAtti: '--',
							prodName:'--',
						}
					}
				})
			},
			formatDate(value, fmt) {

				/**
				 * 格式化时间 
				 * 例2019-08-09 14:30:03 
				 * formatDate('hh:mm:ss')
				 * return 14:30:03
				 */
				let getDate = new Date(value);
				let o = {
					'M+': getDate.getMonth() + 1,
					'd+': getDate.getDate(),
					'h+': getDate.getHours(),
					'm+': getDate.getMinutes(),
					's+': getDate.getSeconds(),
					'q+': Math.floor((getDate.getMonth() + 3) / 3),
					'S': getDate.getMilliseconds()
				};
				if(/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
				}
				for(let k in o) {
					if(new RegExp('(' + k + ')').test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
					}
				}
				return fmt;

			},
			operate(i) {
				this.curr = i;
				let dates, datess;
				dates = new Date().setMonth(new Date().getMonth() - 1);
				datess = this.formatDate(dates, "yyyy-MM");
				this.analyDate = datess;
				this.getdata(datess);
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.boxtitle {
		color: #75CBF2;
	}
	
	.h-left,
	.h-right {
		height: 100%;
		position: relative;
	}
	
	.h-left {
		width: 12.5rem;
		margin-top: -0.5rem;
		margin-left: 2.5rem;
		margin-right: 2.5rem;
		&>div {
			position: relative;
			height: 11.65rem;
			background: url(../../../../static/images/fireMaintenance/d48_03.png) no-repeat center;
			background-size: 65%;
			overflow: visible;
		}
	}
	
	.h-right {
		overflow: hidden;
	}
	
	.h-score {
		position: absolute;
		top: 50%;
		left: 50%;
		text-align: center;
		transform: translate(-50%, -50%);
	}
	
	.h-score i {
		font-size: 1.3rem;
		color: #00FFFF;
		vertical-align: middle;
	}
	
	.h-score span {
		font-size: 0.8rem;
		color: #75CBF2;
		vertical-align: middle;
	}
	
	.h-icon {
		display: inline-block;
		box-shadow: inset 0 0 0.75rem #0095d8;
		padding: 0.5rem;
		border-radius: 50%;
		position: absolute;
		animation: hScale 5s infinite;
	}
	
	.h-icon1 {
		right: 1.1rem;
		top: -0.35rem;
		img {
			width: 2.5rem;
			height: 2.5rem;
		}
	}
	
	.h-icon2 {
		right: -0.3rem;
		top: 44%;
		animation-delay: 3s;
		img {
			width: 1.55rem;
			height: 1.55rem;
		}
	}
	
	.h-icon3 {
		right: 1.5rem;
		bottom: 0.15rem;
		animation-delay: 5s;
		img {
			width: 1.8rem;
			height: 1.8rem;
		}
	}
	
	.h-icon4 {
		left: 3rem;
		bottom: 0.65rem;
		animation-delay: 9s;
		img {
			width: 1.05rem;
			height: 1.1rem;
		}
	}
	
	.h-icon5 {
		left: -0.15rem;
		bottom: 2.65rem;
		animation-delay: 4s;
		img {
			width: 1.5rem;
			height: 1.5rem;
		}
	}
	
	.h-icon6 {
		padding-left: 0.7rem;
		padding-right: 0.7rem;
		left: 1rem;
		top: 0.45rem;
		animation-delay: 8s;
		img {
			width: 1.5rem;
			height: 1.85rem;
		}
	}
	
	@keyframes hScale {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.8);
		}
		100% {
			transform: scale(1);
		}
	}
	
	.h-right ul {
		margin-top: -0.8rem;
	}
	
	.h-right li {
		float: left;
		text-align: left;
		width: 50%;
		height: 33.33%;
		padding-bottom: 0.3rem;
		box-sizing: border-box;
		color: #75CBF2;
		line-height: 2.4rem;
	}
	
	.h-right li>div {
		margin-left: 0.3rem;
		padding: 0px 0.45rem;
		padding-left: 2rem;
		border: 1px solid #1F3A4B;
		height: 100%;
		box-sizing: border-box;
		background-size: 1.25rem auto;
		background-color: #002238;
		background-position: 0.45rem center;
	}
	
	.h-right li>div b {
		font-size: 1.1rem;
	}
	
	.h-right li.active {
		color: #75CBF2;
	}
	
	.h-right li.active>div {
		background-color: rgba(10, 63, 94, 1);
		border-color: #0A507A;
	}
	
	.h-right li.active b {
		color: #00FFFF;
		font-weight: bold;
	}
	
	.service-icon1>div {
		background: url('../../../../static/images/fireMaintenance/icon_1.png') no-repeat;
	}
	
	.service-icon1.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_1_active.png') no-repeat;
	}
	
	.service-icon2>div {
		background: url('../../../../static/images/fireMaintenance/icon_2.png') no-repeat;
	}
	
	.service-icon2.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_2_active.png') no-repeat;
	}
	
	.service-icon3>div {
		background: url('../../../../static/images/fireMaintenance/icon_3.png') no-repeat;
	}
	
	.service-icon3.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_3_active.png') no-repeat;
	}
	
	.service-icon4>div {
		background: url('../../../../static/images/fireMaintenance/icon_4.png') no-repeat;
	}
	
	.service-icon4.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_4_active.png') no-repeat;
	}
	
	.service-icon5>div {
		background: url('../../../../static/images/fireMaintenance/icon_5.png') no-repeat;
	}
	
	.service-icon5.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_5_active.png') no-repeat;
	}
	
	.service-icon6>div {
		background: url('../../../../static/images/fireMaintenance/icon_6.png') no-repeat;
	}
	
	.service-icon6.active>div {
		background: url('../../../../static/images/fireMaintenance/icon_6_active.png') no-repeat;
	}
	
	.h-fr {
		float: right;
	}
	
	.h-placeholder {
		position: absolute;
		bottom: 0px;
		right: 0px;
		color: #31859C;
		left: 0px;
		text-align: right;
		z-index: 1;
	}
	
	.h-placeholder * {
		font-size: 0.7rem;
		white-space: nowrap;
	}
	
	.h-placeholder a {
		color: #00FFFF;
		margin-left: 1rem;
	}
	
	.h-btn {
		text-align: right;
		position: relative;
		top: -1rem;
	}
	
	.h-btn a {
		margin-left: 0.5rem;
		color: #FEFEFE;
		font-size: 0.8rem;
		border: 1px solid white;
		padding: 0px 0.75rem;
		line-height: 1.1rem;
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
	}
	
	.h-btn a.active {
		border-color: #00FFFF;
		background: rgba(0, 255, 255, 0.2);
	}
</style>