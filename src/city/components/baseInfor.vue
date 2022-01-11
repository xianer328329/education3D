<template>
	<back-box class="Z-basicInformation Z-border">
		<div class="Z-basInfList Z-BSnetworking">
			<img src="../../../static/images/city/bnetworking.png" alt="" />
			<p class="Z-schoolType">联网统计</p>
			<div class="Z-BbasicRList fl">
				<p class="Z-BasicTop">
					<span>联网</span>
					<span><i>{{NschoolSum}}</i>所</span>
					<span><i>{{(NstaffSum/10000).toFixed(0)}}</i>万人</span>
				</p>
				<p class="Z-BasicBottom">
					<span>总数</span>
					<span><i>{{schoolSum}}</i>所</span>
					<span><i>{{(staffSum/10000).toFixed(0)}}</i>万人</span>
				</p>
			</div>
			<p class="Z-MonitoringNodes fl">
				<span>消防</span>
				<span>{{(NfireDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控节点</span>
			</p>
			<p class="Z-MonitoringNodes fl">
				<span>安防</span>
				<span>{{(NsecurityDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控终端</span>
			</p>
		</div>
		<div class="Z-basInfList">
			<img src="../../../static/images/city/b20.png" alt="" />
			<p class="Z-schoolType">高等教育</p>
			<div class="Z-BbasicRList fl">
				<p class="Z-BasicTop">
					<span>联网</span>
					<span><i>{{list[0].networkingSchoolNum}}</i>所</span>
					<span><i>{{(list[0].networkingStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
				<p class="Z-BasicBottom">
					<span>总数</span>
					<span><i>{{list[0].totalSchoolNum}}</i>所</span>
					<span><i>{{(list[0].totalStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
			</div>
			<p class="Z-MonitoringNodes fl">
				<span>消防</span>
				<span>{{(list[0].fireDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控节点</span>
			</p>
			<p class="Z-MonitoringNodes fl">
				<span>安防</span>
				<span>{{(list[0].securityDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控终端</span>
			</p>
		</div>
		<div class="Z-basInfList">
			<img src="../../../static/images/city/b21.png" alt="" />
			<p class="Z-schoolType">职业教育</p>
			<div class="Z-BbasicRList fl">
				<p class="Z-BasicTop">
					<span>联网</span>
					<span><i>{{list[1].networkingSchoolNum}}</i>所</span>
					<span><i>{{(list[1].networkingStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
				<p class="Z-BasicBottom">
					<span>总数</span>
					<span><i>{{list[1].totalSchoolNum}}</i>所</span>
					<span><i>{{(list[1].totalStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
			</div>
			<p class="Z-MonitoringNodes fl">
				<span>消防</span>
				<span>{{(list[1].fireDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控节点</span>
			</p>
			<p class="Z-MonitoringNodes fl">
				<span>安防</span>
				<span>{{(list[1].securityDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控终端</span>
			</p>
		</div>
		<div class="Z-basInfList" style="border:none;">
			<img src="../../../static/images/city/b22.png" alt="" />
			<p class="Z-schoolType">基础教育</p>
			<div class="Z-BbasicRList fl">
				<p class="Z-BasicTop">
					<span>联网</span>
					<span><i>{{list[2].networkingSchoolNum}}</i>所</span>
					<span><i>{{(list[2].networkingStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
				<p class="Z-BasicBottom">
					<span>总数</span>
					<span><i>{{list[2].totalSchoolNum}}</i>所</span>
					<span><i>{{(list[2].totalStaffNum/10000).toFixed(0)}}</i>万人</span>
				</p>
			</div>
			<p class="Z-MonitoringNodes fl">
				<span>消防</span>
				<span>{{(list[2].fireDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控节点</span>
			</p>
			<p class="Z-MonitoringNodes fl">
				<span>安防</span>
				<span>{{(list[2].securityDeviceNum/10000).toFixed(1)}}<i>万</i></span>
				<span>监控终端</span>
			</p>
		</div>
	</back-box>

</template>

<script>
	/* eslint-disable */
	export default {
		name: 'baseInfor',
		props: ['infmationChild'],
		data() {
			return {
				list: [{
					networkingStaffNum: '0', // 高等 联网单位学生数量
					networkingSchoolNum: '0', // 联网单位学校数量
					totalSchoolNum: '0', // 总学校数量
					totalStaffNum: '0', // 总学生数量
					securityDeviceNum: '0', // 安防监控设备数量
					fireDeviceNum: '0', // 消防监控节点数量
				}, {
					networkingStaffNum: '0', // 职业
					networkingSchoolNum: '0',
					totalSchoolNum: '0',
					totalStaffNum: '0',
					securityDeviceNum: '0', // 安防监控设备数量
					fireDeviceNum: '0', // 消防监控节点数量
				}, {
					networkingStaffNum: '0', // 基础
					networkingSchoolNum: '0',
					totalSchoolNum: '0',
					totalStaffNum: '0',
					securityDeviceNum: '0', // 安防监控设备数量
					fireDeviceNum: '0', // 消防监控节点数量
				}],
				schoolSum: 0, // 总学校数量
				staffSum: 0, // 总学生数量
				NschoolSum: 0, //联网 总学校数量
				NstaffSum: 0, //联网 总学生数量
				NsecurityDeviceNum: 0, // 安防监控设备数量
				NfireDeviceNum: 0, // 消防监控节点数量
				InfmationID: {},
			}
		},
		mounted() {
			this.getInfor();
		},
		methods: {
			getInfor() {
				var zx = this;
				var parameter = {
					adminId: zx.InfmationID.id,
					pageFlag: zx.InfmationID.pageFlag,
				};
				this.$axios.post('/highclouds/cloud/baseInfo', parameter, {
						emulateJSON: true
					})
					.then(function(res) {
						var data = res || [];
						try { //高等教育
							zx.list[0].fireDeviceNum = data[0].fireDeviceNum;
							zx.list[0].networkingSchoolNum = data[0].networkingSchoolNum;
							zx.list[0].networkingStaffNum = data[0].networkingStaffNum;
							zx.list[0].securityDeviceNum = data[0].securityDeviceNum;
							zx.list[0].totalSchoolNum = data[0].totalSchoolNum;
							zx.list[0].totalStaffNum = data[0].totalStaffNum;
							//职业教育
							zx.list[1].fireDeviceNum = data[1].fireDeviceNum;
							zx.list[1].networkingSchoolNum = data[1].networkingSchoolNum;
							zx.list[1].networkingStaffNum = data[1].networkingStaffNum;
							zx.list[1].securityDeviceNum = data[1].securityDeviceNum;
							zx.list[1].totalSchoolNum = data[1].totalSchoolNum;
							zx.list[1].totalStaffNum = data[1].totalStaffNum;
							//基础教育
							zx.list[2].fireDeviceNum = data[2].fireDeviceNum;
							zx.list[2].networkingSchoolNum = data[2].networkingSchoolNum;
							zx.list[2].networkingStaffNum = data[2].networkingStaffNum;
							zx.list[2].securityDeviceNum = data[2].securityDeviceNum;
							zx.list[2].totalSchoolNum = data[2].totalSchoolNum;
							zx.list[2].totalStaffNum = data[2].totalStaffNum;

							zx.NschoolSum = data[0].networkingSchoolNum + data[1].networkingSchoolNum + data[2].networkingSchoolNum;
							zx.staffSum = data[0].totalStaffNum + data[1].totalStaffNum + data[2].totalStaffNum;
							zx.schoolSum = data[0].totalSchoolNum + data[1].totalSchoolNum + data[2].totalSchoolNum;
							zx.NsecurityDeviceNum = data[0].securityDeviceNum + data[1].securityDeviceNum + data[2].securityDeviceNum;
							zx.NfireDeviceNum = data[0].fireDeviceNum + data[1].fireDeviceNum + data[2].fireDeviceNum;
							zx.NstaffSum = data[0].networkingStaffNum + data[1].networkingStaffNum + data[2].networkingStaffNum;
						} catch(e) {
							console.log(e.message)
						}
					});
			},
		},
		watch: {
			infmationChild() {
				this.InfmationID = this.infmationChild;
				this.getInfor();
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.Z-basicInformation {
		width: 411px;
		height: 292px;
		border: 1px solid #03848d;
		background: none;
		border-color: #03848d;
		margin-top: 214px;
		color: #cccfd2;
	}
	
	.Z-basInfList {
		width: 100%;
		height: 72px;
		border-bottom: 1px solid #03848d;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.4);
	}
	
	.Z-basInfList img {
		float: left;
		margin: 22px 0px 0px 2px;
	}
	
	.Z-basInfList .Z-schoolType {
		float: left;
		text-align: center;
		font-size: 18px;
		width: 44px;
		margin: 12px 5px 0 3px;
	}
	
	.Z-BbasicRList span {
		display: inline-block;
	}
	
	.Z-BbasicRList {
		width: 185px;
	}
	
	.Z-BbasicRList p {
		width: 100%;
	}
	
	.Z-BbasicRList .Z-BasicTop {
		border-bottom: 1px dashed #698da1;
		margin-top: 12px;
		padding-bottom: 3px;
	}
	
	.Z-BbasicRList .Z-BasicBottom {
		margin-top: 3px;
	}
	
	.Z-BbasicRList .Z-BasicTop * {
		color: #00ffff;
	}
	
	.Z-BbasicRList p span:nth-of-type(1) {
		font-size: 16px;
		width: 35px;
	}
	
	.Z-BbasicRList span {
		display: inline-block;
		font-size: 14px;
		width: 36%;
		text-align: right;
	}
	
	.Z-BbasicRList i {
		font-size: 18px;
		font-family: "DIN Medium";
	}
	
	.Z-basInfList .Z-MonitoringNodes {
		text-align: center;
		margin: 0 6px;
		margin-top: 6px;
	}
	
	.Z-basInfList .Z-MonitoringNodes span {
		display: block;
		font-size: 16px;
		margin-top: -1px;
	}
	
	.Z-basInfList .Z-MonitoringNodes span:nth-of-type(2) {
		font-size: 18px;
		color: #00ffff;
	}
	
	.Z-basInfList .Z-MonitoringNodes span:nth-of-type(2) i {
		font-size: 14px;
		color: #00ffff;
	}
	
	.Z-basInfList .Z-MonitoringNodes span:nth-of-type(3) {
		font-size: 14px;
	}
	
	.Z-BSnetworking {
		height: 77px;
		background: rgba(3, 132, 141, 0.4)
	}
	
	.Z-BSnetworking .Z-BasicTop * {
		color: #ffcc00;
	}
	
	.Z-BSnetworking .Z-MonitoringNodes span:nth-of-type(2) {
		color: #ffcc00;
	}
	
	.Z-BSnetworking .Z-MonitoringNodes span:nth-of-type(2) i {
		color: #ffcc00;
	}
</style>