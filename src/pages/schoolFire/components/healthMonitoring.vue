<template>
	<div class="Z-XFGKBottom">
		<h4 class="mdTitle">健康监测</h4>
		<div class="backboxContainer">
			<div class="Z-L fl">
				<div class="Z-Ldsm">
					<div class="Z-Ldsm-content">
						<div class="Z-Ld"></div>
						<span class="Z-dd Z-dd1"></span>
						<span class="Z-dd Z-dd2"></span>
						<span class="Z-dd Z-dd3"></span>
						<span class="Z-dd Z-dd4"></span>
						<!--<span class="Z-dd Z-dd5"></span>
	<span class="Z-dd Z-dd7"></span>-->
						<span class="Z-dd Z-dd6"></span>
						<span class="Z-dd Z-dd8"></span>						
					</div>
				</div>
				<div class="Z-zhu">
					<h5><i class="fl">运行系统</i><i class="fr">完好率</i></h5>
					<ul class="Z-zhuList">
						<li :class="{haveData:list.fireCountR&&list.fireCountR!='--'}">
							<p class="fl">火灾报警</p>
							<span class="fr"><em class="Z-per" >{{list.fireCountR}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.fireCountR+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li :class="{haveData:list.electCountR&&list.electCountR!='--'}">
							<p class="fl">电气火灾</p>
							<span class="fr"><em class="Z-per" >{{list.electCountR}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.electCountR+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li :class="{haveData:list.hydrantCountR&&list.hydrantCountR!='--'}">
							<p class="fl">室内消火栓</p>
							<span class="fr"><em class="Z-per" >{{list.hydrantCountR}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.hydrantCountR+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li>
							<p class="fl">可燃气体</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li>
							<p class="fl">防火分隔</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li>
							<p class="fl">防排烟</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li>
							<p class="fl">自动喷水</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
							
						<li>
							<p class="fl">其他系统</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
					</ul>
				</div>
		
			</div>
			<div class="Z-R fr">
				<h6 class="mdTitle">巡查巡检</h6>
				<div class="vertical-middle-c">
					<div class="vertical-middle">
						<div class="Z-pat Z-pat1 fl">
								<div class="Z-top clearFix">
									<div class="Z-l fl">
										<p class="Z-p1"><span>当日</span><i>DANGRI</i></p>
										<p>巡查完成率</p>
									</div>
									<div class="Z-r fr">
										<div class="Z-quan Z-numberf" :class="{red:patrolInfo.patrolRate>=100}"><span class="NuP">{{patrolInfo.patrolRate}}</span><sub>%</sub></div>
										<div class="Z-quan2"></div>
									</div>
								</div>
								<div class="Z-botm">
									<h5>当日巡查</h5>
									<p class="Z-one"><span class="Z-fault">隐 患</span><span class="Z-number NuP" >{{patrolInfo.dangerCount}}</span></p>
									<p><span>处置数</span><span class="Z-number NuP">{{patrolInfo.handleCount}}</span><span class="Z-wc">完成</span><span><em class="NuP Z-numberf">{{patrolInfo.handleRate}}</em>%</span></p>
									<p><span>巡查数</span><span class="Z-number  NuP">{{patrolInfo.patrolCount}}</span><span class="Z-wc">完成</span><span><em class="NuP Z-numberf">{{patrolInfo.patrolRate}}</em>%</span></p>
								</div>
							</div>
							<div class="Z-pat Z-pat2 fr">
								<div class="Z-top clearFix">
									<div class="Z-l fl">
										<p class="Z-p1"><span>当月</span><i>DANGYUE</i></p>
										<p>巡检完成率</p>
									</div>
									<div class="Z-r Z-xfgkbp fr">
										<div id="Z-xfgkbp"></div>
										<p><span id="patrolRateMonth">{{inspection.inspectionRate}}</span>%</p>
									</div>
								
								</div>
								<div class="Z-botm">
									<h5>当月巡检</h5>
									<p class="Z-one"><span class="Z-fault">故障</span><span class="Z-number NuP">{{inspection.faultCount}}</span></p>
									<p><span>处置数</span><span class="Z-number NuP" >{{inspection.handleCount}}</span><span class="Z-wc">完成</span><span><em class="NuP Z-numberf">{{inspection.handleRate}}</em>%</span></p>
									<p><span>巡检数</span><span class="Z-number NuP">{{inspection.inspectionCount}}</span><span class="Z-wc">完成</span><span><em class="NuP Z-numberf">{{inspection.inspectionRate}}</em>%</span></p>
								</div>
							</div>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: 'healthMonitoring',
		data() {
			return {
				list: {
					fireCountR: "--", //火灾报警主机完好率
					electCountR: "--", //电气火灾设备完好率
					hydrantCountR: "--" //消火栓设备完好率

				},
				patrolInfo: { //巡查
					dangerCount: "--", //巡查隐 患数
					handleCount: "--", //处置数
					patrolCount: "--", //巡查数
					totalCount: "--", //巡查总数
					handleRate: "--", //处置完好率
					patrolRate: "--" //巡查完好率
				},
				inspection: { //巡检
					faultCount: "--", //巡检故障
					handleCount: "--", //处置数
					inspectionCount: "--", //巡检数
					recordCount: "--", //总数
					handleRate: "--", //处置完好率
					inspectionRate: "--" //巡检完好率
				}

			}
		},
		methods: {
			healthMonitoring() { //健康监测 完好率
				this.$axios.post('fire/fire/healthMonitoring', {
						emulateJSON: true
					})
					.then(this.healthMonitoringSucc)
			},
			healthMonitoringSucc(res) { //告警信息接收函数
				var data = res;
				var fireCount = data.fireCount; //火灾报警主机总数
				var normalFireCount = data.normalFireCount; //火灾报警主机正常的数量
				var electCount = data.electCount; //电气火灾设备总数
				var normalElectCount = data.normalElectCount; //电气火灾正常的数量
				var hydrantCount = data.hydrantCount; //消火栓设备总数
				var normalHydrantCount = data.normalHydrantCount //消火栓正常的数量
				this.countRate(fireCount, normalFireCount, 1)
				this.countRate(electCount, normalElectCount, 2)
				this.countRate(hydrantCount, normalHydrantCount, 3)

			},
			countRate(Count, normal, type) {
				var sum
				if(Count && normal) {
					var fireP = (normal / Count * 100);
					if(fireP == "100") {
						sum = 100
					} else {

						sum = fireP.toFixed(2)

					}
				}
				if(type == 1) {
					this.list.fireCountR = sum
				} else if(type == 2) {
					this.list.electCountR = sum
				} else if(type == 3) {
					this.list.hydrantCountR = sum
				}

			},

			getPatrolInfo() { // 当日巡查完成率 请求接口
				this.$axios.post('fire/fire/patrolInfo', {
						emulateJSON: true
					})
					.then(this.patrolInfoSucc)
			},
			patrolInfoSucc(res) { // 当日巡查完成率  接收函数
				if(res.data){
					var data = res;
				}else{
					return
				}
				
				if(data) {
					this.patrolInfo.dangerCount = data.dangerCount //巡查隐 患数
					this.patrolInfo.handleCount = data.handleCount //处置数
					this.patrolInfo.patrolCount = data.patrolCount //巡查数
					this.patrolInfo.totalCount = data.totalCount //总数
					if(data.totalCount == 0) {
						this.patrolInfo.patrolRate = 0;
						this.patrolInfo.handleRate = 0;
					} else {
						this.patrolInfo.patrolRate = Math.round(data.patrolCount * 100 / data.totalCount);
						this.patrolInfo.handleRate = Math.round(data.handleCount * 100 / data.totalCount);
					}

				}
			},
			getInspectionInfo() { // 当月巡检完成率 请求接口
				this.$axios.post('fire/fire/inspectionInfo', {
						emulateJSON: true
					})
					.then(this.inspectionInfoSucc)
			},
			inspectionInfoSucc(res) { // 当月巡检完成率 接收函数
				var data = res;
				if(data) {
					this.inspection.faultCount = data.faultCount //巡检故障
					this.inspection.handleCount = data.handleCount //处置数
					this.inspection.inspectionCount = data.inspectionCount //巡查数
					this.inspection.recordCount = data.recordCount //总数
					if(data.recordCount == 0) {
						this.inspection.inspectionRate = 0;
						this.inspection.handleRate = 0;
					} else {
						this.inspection.inspectionRate = Math.round(data.inspectionCount * 100 / data.recordCount);
						this.inspection.handleRate = Math.round(data.handleCount * 100 / data.recordCount);
					}
					 this.GaugeData('Z-xfgkbp',this.inspection.inspectionRate);
				}
			},
			
			GaugeData(Id,value){//绑定表盘数据
    			var myChart = echarts.init(document.getElementById(Id));
    			myChart.setOption(gaugeChart(value),true);
				allCharts.push(myChart);
			}

		},
		mounted: function() {
			this.GaugeData('Z-xfgkbp',0);
			this.healthMonitoring()
			this.getPatrolInfo()
			this.getInspectionInfo()
		},
	}
</script>

<style lang="scss" scoped>
	.Z-XFGKBottom .Z-L {
		width: 50%;
		height: 100%;
		padding-right: 1rem;
		box-sizing: border-box;
		text-align:center;
		display: flex;
		justify-content: space-around;
	}
	
	.Z-XFGKBottom .Z-Ldsm {
		height:100%;
		&:after{
			content: '';
			display:inline-block;
			vertical-align:middle;
			height:100%;
		}
	}
	.Z-Ldsm-content{
		display:inline-block;
		vertical-align:middle;
		width: 10rem;
		height: 10rem;
		background: url(../../../../static/images/d143_03.png) no-repeat center;
		background-size: 100% 100%;
		position: relative;
	}
	.Z-XFGKBottom .Z-Ld {
		width: 100%;
		height: 100%;
		background: url(../../../../static/images/d53_03.png) no-repeat center;
		background-size: 100% 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		animation: radar-beam 15s linear infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd {
		width: 0.4rem;
		height: 0.4rem;
		background: #ff0000;
		position: absolute;
		border-radius: 50%;
		opacity: 0;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd1 {
		top: 37.36%;
		left: 45.98%;
		animation: dd 15s linear infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd2 {
		top: 41.95%;
		left: 58.62%;
		animation: dd 15s linear 1.5s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd3 {
		top: 51.15%;
		left: 52.87%;
		animation: dd 15s linear 3s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd4 {
		top: 57.47%;
		left: 40.23%;
		animation: dd 15s linear 7s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd5 {
		top: 33.33%;
		left: 32.76%;
		animation: dd 15s 10s linear infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd6 {
		top: 53.45%;
		left: 78.73%;
		animation: dd 15s linear 1s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd7 {
		top: 44.83%;
		left: 36.21%;
		animation: dd 15s linear 10.5s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-dd8 {
		top: 55.17%;
		left: 16.67%;
		animation: dd 15s linear 7s infinite;
	}
	
	.Z-XFGKBottom .Z-L .Z-zhu {
		max-width: 300px;
		margin-top: -1.8rem;
		height: 100%;
	}
	
	.Z-XFGKBottom .Z-L .Z-zhu h5 {
		overflow: hidden;
	}
	
	.Z-XFGKBottom .Z-L .Z-zhu h5 i {
		color: #00ffff;
		font-size: 0.9rem;
	}
	
	.Z-zhuList {
		color: #666;
		font-size: 0.9rem;
		margin-top: 0.4rem;
		overflow: hidden;
	}
	
	.Z-zhuList li p {
		width: 5rem;
		margin-right: 1rem;
		text-align: right;
		color: #cccfd2;
	}
	
	.Z-zhuList li .Z-bar {
		height: 0.4rem;
		border: 1px solid #666;
		margin-top: 0.5rem;
		position: relative;
		overflow: hidden;
	}
	
	.Z-zhuList li .Z-bar2 {
		width: 0;
		height: 0.2rem;
		background: #666;
		margin-top: 0.1rem;
	}
	
	.Z-zhuList li .Z-dot {
		width: 0.6rem;
		height: 0.6rem;
		background: #666;
		position: absolute;
		top: -0.1rem;
		left: -0.45rem;
		border-radius: 50%;
	}
	
	.Z-zhuList li span {
		width: 4rem;
		height: 0.9rem;
		text-align: right;
		font-size: 0.9rem;
		font-family: "DIN Medium";
		margin-top: 0.3rem;
		color: #cccfd2;
	}
	
	.Z-shaft {
		color: #a4a5b2;
		font-size: 0.9rem;
		position: absolute;
		bottom: 0.5rem;
		left: 1.3rem;
	}
	
	.Z-shaft .Z-sh1 {
		margin-bottom: 0.35rem;
	}
	
	.Z-shaft .Z-sh2 {
		background: #01052a;
		width: 571px;
		height: 13px;
		position: relative;
		border-radius: 12px;
		margin-bottom: 4px;
	}
	
	.Z-shaft .Z-sh2 .Z-kd {
		background: url(../../../../static/images/d71.png) no-repeat center;
		width: 571px;
		height: 13px;
		position: absolute;
		left: 0px;
		top: 0px;
		z-index: 6;
	}
	
	.Z-shaft .Z-sh2bar {
		position: relative;
		width: 467px;
	}
	
	.Z-shaft .Z-sh2bar img {
		position: absolute;
		top: -11px;
		cursor: pointer;
		z-index: 20;
		left: 286px;
	}
	
	.Z-shaft .Z-sh2bar2 {
		width: 286px;
		height: 13px;
		background: #1b671b;
		box-shadow: inset 0 0 10px #598a59;
		position: absolute;
		left: 0px;
		top: 0px;
		border-radius: 12px 0 0 12px;
	}
	
	.Z-shaft .Z-sh3 {
		margin-top: 10px;
		width: 620px;
		height: 22px;
		background: #031a29;
		border-radius: 10px;
		overflow: hidden;
		margin-left: -8px;
		cursor: pointer;
	}
	
	.Z-shaft .Z-sh3 i {
		width: 20px;
		float: left;
		text-align: center;
		line-height: 27px;
		height: 22px;
		font-size: 14px;
	}
	
	.Z-shaft .Z-sh3 .Z-on {
		background: #1b671b;
		box-shadow: 0 0 10px #fff inset;
	}
	.Z-XFGKBottom .Z-R{
		position: relative;
	}
	.Z-XFGKBottom .Z-R .mdTitle {
		position: absolute;
		top: -2rem;
		left: 0px;
	}
	.Z-XFGKBottom .Z-R .vertical-middle-c{
		margin-top: -1rem;
		height: 100%;
		text-align: left;
	}
	.Z-XFGKBottom .Z-R .Z-sbiao {
		font-size: 0.9rem;
		color: #a4a5b1;
		position: absolute;
		right: 0px;
		top: 0px;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao li {
		float: left;
		margin-left: 34px;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao span {
		width: 6px;
		height: 16px;
		margin-right: 6px;
		display: inline-block;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao .Z-span1 {
		background: #8a1829;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao .Z-span2 {
		background: #b3b513;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao .Z-span3 {
		background: #037862;
	}
	
	.Z-XFGKBottom .Z-R .Z-bpC {
		width: 186px;
		margin-left: 19px;
		text-align: center;
		position: relative;
	}
	
	.Z-XFGKBottom .Z-R .Z-bpC .Z-bpt {
		width: 186px;
		height: 173px;
	}
	
	.Z-XFGKBottom .Z-R .Z-bpC i {
		font-size: 12px;
		color: #a4a5b2;
		font-family: 'Helvetica-Roman-SemiB';
		margin-top: -31px;
		display: block;
		margin-bottom: 16px;
	}
	
	.Z-XFGKBottom .Z-R .Z-bpC em {
		font-size: 36px;
	}
	
	.Z-XFGKBottom .Z-R .Z-bpC span {
		color: #a6adce;
		font-size: 24px;
		padding: 5px 10px;
		background: #113193;
		border-radius: 4px;
		box-shadow: inset 0 0 15px #fff;
	}
	/*#sbzx canvas{width:260px !important; height:173px; }*/
	
	#sbzx,
	#spzl,
	#sjcc {
		width: 240px;
		height: 240px;
		position: absolute;
		top: -27px;
		left: -26px;
	}
	/*健康监测动画*/
	
	@keyframes radar-beam {
		0% {
			transform: rotate(0deg);
			transform-origin: 50% 50%;
		}
		100% {
			transform: rotate(360deg);
			transform-origin: 50% 50%;
		}
	}
	
	@keyframes dd {
		0% {
			opacity: 0;
		}
		15% {
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		60% {
			opacity: 0;
		}
		100% {
			opacity: 0;
		}
	}
	
	.Z-XFGKBottom .Z-R {
		width: 50%;
		height: 100%;
	}
	
	.Z-XFGKBottom .Z-pat {
		width: 46%;
		max-width: 280px;
		&.Z-pat1{
			margin-left: 3%;
		}
		&.Z-pat2{
			margin-right: 3%;
		}
	}
	
	.Z-pat .Z-top {
		position: relative;
		font-size: 0.9rem;
		color: #cbccd3;
		overflow: hidden;
	}
	
	.Z-pat .Z-top .Z-p1 {
		height: 2.3rem;
		font-size: 1.1rem;
		padding-left: 2.9rem;
		margin-bottom: 0.5rem;
	}
	
	.Z-pat .Z-top .Z-p1 span {
		color: #00ffff;
	}
	
	.Z-pat1 .Z-top .Z-p1 {
		background: url(../../../../static/images/d209_03.png) no-repeat left;
		background-size:2.3rem 2.3rem;
	}
	
	.Z-pat2 .Z-top .Z-p1 {
		background: url(../../../../static/images/d210_03.png) no-repeat left;
		background-size:2.3rem 2.3rem;
	}
	
	.Z-pat .Z-top .Z-p1 i {
		font-size: 0.6rem;
		display: block;
	}
	
	.Z-pat .Z-top .Z-l {
		width: 50%;
		text-align: left;
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
	
	.Z-pat1 .Z-top .Z-r {
		width: 5.5rem;
		height: 5.5rem;
		border: 1px solid #1c3167;
		box-sizing: border-box;
		border-radius: 50%;
		position: relative;
		text-align: center;
		font-size: 1.4rem;
	}
	
	.Z-pat .Z-top .Z-r .Z-quan {
		position: absolute;
		right: 0px;
		left: 0px;
		top: 50%;
		color: #871626;
		text-align: center;
		padding-bottom: 20px;
		background: url(../../../../static/images/x42.png) no-repeat center;
		transform: translateY(-50%);
	}
	
	.Z-pat .Z-top .Z-r .Z-quan sub {
		font-size: 0.6rem;
	}
	
	.Z-pat .Z-top .Z-r .red {
		color: #cdcedc;
	}
	
	.Z-pat .Z-top .Z-r .Z-quan2 {
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		background: url(../../../../static/images/222_03.png) no-repeat center;
		background-size: 100% 99%;
		animation: radar-beam 15s linear infinite;
	}
	
	.Z-pat .Z-botm {
		margin-top: 0.3rem;
		font-size: 1rem;
		color: #cccfd2;
		position: relative;
		background: url(../../../../static/images/d211_03.png) no-repeat center;
		background-size: 100% 100%;
		padding-left: 0.5rem;
	}
	
	.Z-pat .Z-botm h5 {
		// font-size: 1.1rem;
		color: #e6e7ee;
		position: absolute;
		right: 1rem;
		top: 0px;
		line-height: 1.5rem;
	}
	
	.Z-pat .Z-botm .Z-one {
		padding-top: 1.5rem;
	}
	
	.Z-pat .Z-botm .Z-one .Z-fault {
		text-align: justify;
		display: inline-block;
		border-right: 2px solid #fff;
		line-height: 0.9rem;
	}
	
	.Z-pat .Z-botm p {
		line-height: 1.45rem;
	}
	
	.Z-pat .Z-botm p span:first-child {
		border-right: 2px solid #fff;
		width: 3.75rem;
		line-height: 0.9rem;
		display: inline-block;
	}
	
	.Z-pat .Z-botm .Z-number {
		width: 3.25rem;
		text-align: right;
		display: inline-block;
		font-family: "DIN Medium";
		margin: 0 0.25rem;
	}
	
	.Z-pat .Z-botm .Z-wc {
		margin-left: 20px;
		margin-right: 4px;
	}
	
	#Z-xfgkbp {
		width: 8rem;
		height: 8rem;
		margin-left: -1.5rem;
		margin-top: -1rem;
	}
	
	.Z-xfgkbp {
		position: relative;
		width: 5.5rem;
		height: 5.5rem;
		text-align: center;
	}
	
	.Z-xfgkbp p {
		font-size: 0.6rem;
		margin-top: -3rem;
		font-family: 'Helvetica-Roman-SemiB'
	}
	
	.Z-xfgkbp p span {
		font-size: 1.4rem;
	}
	.Z-zhuList li{
		float: left;
		width: 100%;
	}
	.Z-zhuList .haveData {
		color: #a9aab6
	}
	
	.Z-zhuList .haveData .Z-bar {
		border: 1px solid #01b5c5;
	}
	
	.Z-zhuList .haveData .Z-bar2,
	.Z-zhuList .haveData .Z-dot {
		background: #01b5c5
	}
</style>