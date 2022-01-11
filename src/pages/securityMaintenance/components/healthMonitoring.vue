<template>
	<div class="Z-XFGKBottom">
		<h4 class="mdTitle">健康监测</h4>
		<div class="Z-L backboxContainer">
			<div class="fl vertical-middle-c mr20">
				<div class="Z-Ldsm vertical-middle">
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
			<div class="vertical-middle-c overflow-hidden">
				<div class="Z-zhu vertical-middle">
					<h5 class="clearFix"><i class="fl">监测设备</i><i class="fr">完好率</i></h5>
					<ul class="Z-zhuList">
						<li class="clearFix" :class="[list.hostSystemCount&&list.hostSystemCount!='--'?'haveData':'',list.hostSystemCount==100?'h-full':'']">
							<p class="fl">主机系统</p>
							<span class="fr"><em class="Z-per" >{{list.hostSystemCount}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.hostSystemCount+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
							
						</li>
						<li class="clearFix" :class="[list.storageCount&&list.storageCount!='--'?'haveData':'',list.storageCount==100?'h-full':'']">
							<p class="fl">存储设备</p>
							<span class="fr"><em class="Z-per" >{{list.storageCount}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.storageCount+'%'}"></div>
								<div class="Z-dot"></div>
							</div>	
						</li>
						<li class="clearFix" :class="[list.decodeCount&&list.decodeCount!='--'?'haveData':'',list.decodeCount==100?'h-full':'']">
							<p class="fl">解码设备</p>
							<span class="fr"><em class="Z-per" >{{list.decodeCount}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.decodeCount+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li class="clearFix">
							<p class="fl">网络设备</p>
							<span class="fr"><em class="Z-per">--</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" style="width:0%;"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
						<li class="clearFix" :class="[list.videoCount&&list.videoCount!='--'?'haveData':'',list.videoCount==100?'h-full':'']">
							<p class="fl">摄像机</p>
							<span class="fr"><em class="Z-per" >{{list.videoCount}}</em>%</span>
							<div class="Z-bar">
								<div class="Z-bar2" :style="{width:list.videoCount+'%'}"></div>
								<div class="Z-dot"></div>
							</div>
						</li>
					</ul>
				
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
					hostSystemCount:"--",
					storageCount:"--",
					decodeCount:"--",
					videoCount:"--",
					
				},
			}
		},
		mounted: function() {
			this.healthMonitoring()
		},
		methods: {
			healthMonitoring() { //健康监测 完好率
				this.$axios.post('working/monitor/healthMonitoring')
					.then(this.healthMonitoringSucc)
			},
			healthMonitoringSucc(res) { //告警信息接收函数
				var data = res,obj={};
				obj.hostSystemCount=this.countRate(data.hostSystemUntreated,data.hostSystemCount);
				obj.storageCount=this.countRate(data.storageUntreated,data.storageCount);
				obj.decodeCount=this.countRate(data.decodeUntreated,data.decodeCount);
				obj.videoCount=this.countRate(data.videoUntreated,data.videoCount);
				this.list=obj;
			},
			countRate(fault,count) {
				var sum;
				if(count) {
					var fireP = ((count-fault) / count * 100);
					if(fireP == "100") {
						sum = 100
					} else {
						sum = fireP.toFixed(0)

					}
				}
				return sum;
			},
		},
		
	}
</script>

<style lang="stylus" scoped>
	.Z-XFGKBottom .Z-L {
		width: 100%;
		margin-top: 5px;
	}
	.vertical-middle-c{
		height:100%;
	}
	.Z-XFGKBottom .Z-Ldsm {
		width: 6.5rem;
		height: 6.5rem;
		background: url(../../../../static/images/d143_03.png) no-repeat center;
		background-size: 100% 100%;
		position: relative;
	}
	.mr20{
		margin-right:1rem;
	}
	.Z-XFGKBottom .Z-Ld {
		width: 100%;
		height: 100%;
		background: url(../../../../static/images/d53_03.png) no-repeat center;
		background-size: 100%;
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
	
	.Z-XFGKBottom .Z-L .Z-zhu h5 i {
		text-align: right;
		color:#75CBF2;
		font-size: 0.9rem;
	}
	
	.Z-zhuList {
		color: #666;
		font-size: 0.9rem;
		margin-top: 0.4rem;
	}
	.Z-zhuList li{
		margin-top: 0.5rem;
		color:#666;
	}
	.Z-zhuList li p {
		width: 4rem;
		line-height:1rem;
		text-align: left;
	}
	
	.Z-zhuList li .Z-bar {
		overflow:hidden;
		height: 0.4rem;
		border: 1px solid #666;
		position: relative;
		top:0.3rem;
	}
	
	.Z-zhuList li .Z-bar2 {
		width: 0;
		height: 4px;
		background: #666;
		margin-top: 2px;
	}
	
	.Z-zhuList li .Z-dot {
		width: 0.6rem;
		height: 0.6rem;
		background: #666;
		position: absolute;
		top: -2px;
		left: -9px;
		border-radius: 50%;
	}
	
	.Z-zhuList li span {
		width: 3rem;
		line-height:1rem;
		text-align:right;
		font-size: 0.9rem;
	}
	
	.Z-shaft {
		color: #a4a5b2;
		font-size: 18px;
		position: absolute;
		bottom: 10px;
		left: 26px;
	}
	
	.Z-shaft .Z-sh1 {
		margin-bottom: 7px;
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
	
	.Z-XFGKBottom .Z-R {
		margin-top: -30px;
		position: relative;
	}
	
	.Z-XFGKBottom .Z-R .Z-sbiao {
		font-size: 18px;
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
		width: 595px;
		margin-right: 20px;
		padding-top: 4px;
	}
	
	.Z-XFGKBottom .Z-pat {
		width: 278px;
		margin-left: 12px;
	}
	
	.Z-pat .Z-top {
		font-size: 18px;
		color: #cbccd3;
		height: 112px;
		overflow: hidden;
	}
	
	.Z-pat .Z-top .Z-p1 {
		height: 46px;
		font-size: 22px;
		padding-left: 58px;
		margin-bottom: 10px;
	}
	
	.Z-pat .Z-top .Z-p1 span {
		color: #00ffff;
	}
	
	.Z-pat1 .Z-top .Z-p1 {
		background: url(../../../../static/images/d209_03.png) no-repeat left;
	}
	
	.Z-pat2 .Z-top .Z-p1 {
		background: url(../../../../static/images/d210_03.png) no-repeat left;
	}
	
	.Z-pat .Z-top .Z-p1 i {
		font-size: 12px;
		display: block;
	}
	
	.Z-pat .Z-top .Z-l {
		margin-top: 34px;
	}
	
	.Z-pat1 .Z-top .Z-r {
		width: 110px;
		height: 110px;
		border: 1px solid #1c3167;
		border-radius: 50%;
		position: relative;
		text-align: center;
		font-size: 28px;
	}
	
	.Z-pat .Z-top .Z-r .Z-quan {
		width: 110px;
		height: 110px;
		position: absolute;
		top: 0;
		left: 0;
		color: #871626;
		line-height: 90px;
		background: url(../../../../static/images/x42.png) no-repeat center 65px;
	}
	
	.Z-pat .Z-top .Z-r .Z-quan sub {
		font-size: 12px;
	}
	
	.Z-pat .Z-top .Z-r .red {
		color: #cdcedc;
	}
	
	.Z-pat .Z-top .Z-r .Z-quan2 {
		width: 110px;
		height: 110px;
		position: absolute;
		top: 0px;
		left: 0px;
		background: url(../../../../static/images/222_03.png) no-repeat center;
		background-size: 100% 100%;
		animation: radar-beam 15s linear infinite;
	}
	
	.Z-pat .Z-botm {
		font-size: 20px;
		color: #cccfd2;
		position: relative;
		background: url(../../../../static/images/d211_03.png) no-repeat center;
		background-size: 100% 100%;
		width: 276px;
		height: 128px;
		padding-left: 10px;
		margin-top: 8px;
	}
	
	.Z-pat .Z-botm h5 {
		font-size: 22px;
		color: #e6e7ee;
		position: absolute;
		right: 16px;
		top: 0px;
	}
	
	.Z-pat .Z-botm .Z-one {
		padding-top: 30px;
	}
	
	.Z-pat .Z-botm .Z-one .Z-fault {
		text-align: justify;
		display: inline-block;
		border-right: 2px solid #fff;
		line-height: 18px;
	}
	
	.Z-pat .Z-botm p {
		line-height: 29px;
	}
	
	.Z-pat .Z-botm p span:first-child {
		border-right: 2px solid #fff;
		width: 75px;
		line-height: 18px;
		display: inline-block;
	}
	
	.Z-pat .Z-botm .Z-number {
		width: 65px;
		text-align: right;
		display: inline-block;
		font-family: "DIN Medium";
		margin: 0 5px;
	}
	
	.Z-pat .Z-botm .Z-wc {
		margin-left: 20px;
		margin-right: 4px;
	}
	
	#Z-xfgkbp {
		width: 160px;
		height: 160px;
		margin-left: -25px;
		margin-top: -19px;
	}
	
	.Z-xfgkbp {
		width: 110px;
		height: 110px;
		text-align: center;
		margin-right: 8px;
	}
	
	.Z-xfgkbp p {
		font-size: 12px;
		margin-top: -61px;
		font-family: 'Helvetica-Roman-SemiB'
	}
	
	.Z-xfgkbp p span {
		font-size: 28px;
	}
	
	.Z-zhuList .haveData *{
		color:#75CBF2
	}
	.Z-zhuList .haveData.h-full .Z-bar {
		border: 1px solid #02FF00;
	}
	
	.Z-zhuList .haveData.h-full .Z-dot {
		background: #02FF00
	}
	.Z-zhuList .haveData.h-full .Z-bar2{
		background:rgba(2, 255, 0,0.5)
	}
	
	.Z-zhuList .haveData .Z-bar {
		border: 1px solid #F3983F;
	}
	
	.Z-zhuList .haveData .Z-dot {
		background: #F3983F
	}
	.Z-zhuList .haveData .Z-bar2{
		background:rgba(243, 152, 63, 0.5)
	}
</style>