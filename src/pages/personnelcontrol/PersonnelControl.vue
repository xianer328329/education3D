<template>
	<div class="module">
		<div class="section-left">
			<back-box class="border-anim">
				<BasicInformation></BasicInformation>
				<Early-Warning-Monitoring @show="show" authName="al_personnelcontrol_traffic_people_earlywarningmonitoring" authDesc="预警监测" class="NO_Auth"></Early-Warning-Monitoring>
				<!--<SuspectedLost authName="al_personnelcontrol_traffic_people_loseusercount" authDesc="疑似异常" class="NO_Auth"></SuspectedLost>-->
			</back-box>
			<back-box class="border-anim">
				<!-- 体温遗异常班级 -->
				<Temperature-Abnormality-Class ref="TemperatureAbnormalityClass" v-show="currbox==1" authName="al_personnelcontrol_traffic_people_temperatureabnormalityclass" authDesc="体温异常班级" class="NO_Auth"></Temperature-Abnormality-Class>
				<!-- 未佩戴口罩 -->
				<No-Mask v-show="currbox==2" ref="NoMaskref" authName="al_personnelcontrol_traffic_people_nomask" authDesc="未佩戴口罩" class="NO_Auth"></No-Mask>
				<!-- 疑似异常-->
				<Suspected-Lost-Analysis v-show="currbox==3" ref="SuspectedLostAnalysis" authName="al_personnelcontrol_traffic_people_loseuseranaly" authDesc="疑似异常分析" class="NO_Auth"></Suspected-Lost-Analysis>
			</back-box>
			<back-box class="border-anim">
				<LateTop authName="al_personnelcontrol_traffic_people_nightinouttopn" authDesc="晚出晚归TOP榜" class="NO_Auth"></LateTop>
			</back-box>
		</div>
		<div class="section-bottom">
			<back-box class="border-anim">
				<LateOutAndLateHome authName="al_personnelcontrol_traffic_people_nightinoutgrade" authDesc="晚出晚归" class="NO_Auth"></LateOutAndLateHome>
			</back-box>
			<back-box class="border-anim">
				<LateOutAndLateHomeTrend authName="al_personnelcontrol_traffic_people_nightinouttrend" authDesc="晚出晚归趋势" class="NO_Auth"></LateOutAndLateHomeTrend>
			</back-box>
			<back-box class="border-anim">
				<LateOutAndLateHomeRatio authName="al_personnelcontrol_traffic_people_nightinoutsex" authDesc="晚出晚归男女生占比" class="NO_Auth"></LateOutAndLateHomeRatio>
			</back-box>
		</div>
	</div>
</template>

<script>
	//import SuspectedLost from './components/SuspectedLost' 2020-4.16 预警监测代替
	import EarlyWarningMonitoring from './components/EarlyWarningMonitoring' //预警监测
	import TemperatureAbnormalityClass from './components/TemperatureAbnormalityClass' //体温异常班级
	import NoMask from './components/NoMask' //未佩戴口罩
	import SuspectedLostAnalysis from './components/SuspectedLostAnalysis'
	import LateTop from './components/LateTop'
	import LateOutAndLateHome from './components/LateOutAndLateHome'
	import LateOutAndLateHomeTrend from './components/LateOutAndLateHomeTrend'
	import LateOutAndLateHomeRatio from './components/LateOutAndLateHomeRatio'
	import BasicInformation from './components/BasicInformation'
	export default {
		components: { //引入模块
			//SuspectedLost, //疑似异常
			EarlyWarningMonitoring, //预警监测
			TemperatureAbnormalityClass, // 体温异常班级
			NoMask,//未佩戴口罩
			SuspectedLostAnalysis, //疑似异常分析
			LateTop, //晚出晚归TOP
			LateOutAndLateHome, //晚出晚归
			LateOutAndLateHomeTrend, //晚出晚归趋势
			LateOutAndLateHomeRatio, //晚出晚归男女比率
			BasicInformation, //基本数据
		},
		data() {
			return {
				currbox: 1,
			}
		},
		mounted: function() {},
		methods: {
			show(currbox) {
				this.currbox = currbox;
				if(currbox==3){
					this.$refs.SuspectedLostAnalysis.TwentyfourPie();
				}else if(currbox==2){
					this.$refs.NoMaskref.getdata();
				}else{
          this.$refs.TemperatureAbnormalityClass.gettempExTrend();
        }
			},
		},
	}
</script>

<style lang="stylus">
	.BlockData {
		width: 49%;
	}

	.BlockDataTitle {
		width: 80%;
		height: 2rem;
		border: 1px solid rgba(25, 94, 127, 1);
		border-radius: 4px 4px 0px 0px;
		text-align: center;
		border-bottom: none;
		margin: 0 auto;
	}

	.BlockDataTitle .C-bdullitext {
		top: -0.65rem;
		background: #001525;
		text-align: center;
		position: relative;
		display: inline-block;
		color: #75cbf2;
		font-size: 0.8rem;
		padding: 0 0.45rem;
	}

	.BlockData .uli {
		width: 100%;
		margin-top: -1rem;
	}

	.BlockData .uli p {
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		box-sizing: border-box;
		height: 1.5rem;
		line-height: 1.5rem;
		margin-bottom: 0.35rem;
		padding: 0 0.5rem 0px;
		cursor: pointer;
	}

	.BlockData .uli p * {
		color: #75CBF2
	}

	.BlockData .uli p span {
		font-size: 0.8rem;
		float: left;
	}

	.BlockData .uli p i {
		color: #00FFFF;
		font-size: 0.9rem;
	}

	.BlockData .uli p small {
		font-size: 0.6rem;
		margin-left: 0.3rem;
	}

	.BlockData .uli .fist {
		height: 2rem;
		font-size: 0.8rem;
		line-height: 2rem;
	}

	.BlockData .uli .fist i {
		font-size: 1.1rem;
	}
</style>
