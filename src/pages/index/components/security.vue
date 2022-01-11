<template>
	<div>
		<h4 class="mdTitle">校园安防</h4>
		<span class="dtatTitle">{{YYMM}}</span>
		<ul class="amountCom amountBoxUp clearFix">
			<li class="fl amount" authName="al_index_home_campussecurity_jointdefensecontrol" authDesc="人脸联防布控">
				<div class="amount-content">
					<span><i>{{list.todayJointDefenseControl}}</i>次</span>
					<p>人脸联防布控</p>
				</div>
			</li>
			<li class="fr amount" authName="al_index_home_campussecurity_schoolcontrol" authDesc="人脸本校布控">
				<div class="amount-content">
					<span><i>{{list.todaySchoolControl}}</i>次</span>
					<p>人脸本校布控</p>
				</div>				
			</li>
			<li class="fl amount rd3" authName="al_index_home_campussecurity_manualalarm" authDesc="联动报警">
				<div class="amount-content">
					<span><i>{{list.todayManualAlarm}}</i>次</span>
					<p>联动报警</p>
				</div>
			</li>
			<li class="amount rd3" authName="al_index_home_campussecurity_motiondetection" authDesc="移动侦测">
				<div class="amount-content">
					<span><i>{{list.todayMotionDetection}}</i>次</span>
					<p>移动侦测</p>
				</div>				
			</li>
			<li class="fr amount rd3" authName="al_index_home_campussecurity_videoocclusion" authDesc="视频遮挡">
				<div class="amount-content">
					<span><i>{{list.videoOcclusion}}</i>次</span>
					<p>视频遮挡</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	/* eslint-disable */
	import axios from 'axios'

	export default {
		name: 'IndexSecurity',
		data() {
			return {
				YYMM: (new Date()).Format("yyyy-MM"),
				list: {
					todayJointDefenseControl: "--",
					todaySchoolControl: "--",
					todayManualAlarm: "--",
					todayMotionDetection: "--",
					videoOcclusion: "--",

				}
			}
		},
		methods: {
			campusSecurity() {
				var parameter = new FormData();
				var _this = this;
				parameter.append('type', '1');
				this.$axios.post('home/campusSecurity/' + UNITID, parameter, {
						emulateJSON: true
					})
					.then(this.campusSecuritySucc);
			},
			campusSecuritySucc(res) {
				this.list = res;
			}
		},
		created: function() {
			this.campusSecurity()
		},
	}
</script>

<style lang="scss" scoped>
	.amountBoxUp{
		height: calc(100% - 2.5rem);
	}
	.amountBoxUp.amountCom .amount{
		width: 49%;
		height: 50%;
		&.rd3{
			display: inline-block;
			width: 32%;
		}
	}
</style>
