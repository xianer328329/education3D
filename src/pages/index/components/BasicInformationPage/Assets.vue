<template>
	<div class="Assets">
		<div class="AssetsTop">
			<div class="AssetsTop_zj" v-for="item in list">
				<div class="AssetsToptitle">{{item.Title}}</div>
				<h1>{{item.money}}<span>{{item.unit}}</span></h1>
				<p></p>
				<div class="Bottom">
					<h1>{{item.unitTN}}<span>{{item.unitT}}</span></h1>
					<h1>{{item.unitSN}}<span>{{item.unitS}}</span></h1>
				</div>
			</div>
			<div class="AssetsTop_jj" v-for="(item,index) in Bottom">
				<div :class="[index%2==0?'AssetsTop_j':'TwoJ']">
					<div class="AssetsToptitle">{{item.Title}}</div>
					<h1>{{item.money}}<span>{{item.unit}}</span></h1>
					<p></p>
					<div class="Bottom">
						<h1>{{item.unitTN}}<span>{{item.unitT}}</span></h1>
						<h1>{{item.unitSN}}<span>{{item.unitS}}</span></h1>
					</div>
				</div>
			</div>
		</div>
		<div class="AssetsBottom">
			<div class="AssetsBottomTitle">
				<!--<div class="AssetsBottomTitleG">国际大类</div>
				<div class="AssetsBottomTitleJ">教育大类</div>-->
				<div class="AssetsBottomSwitch">
					<ul>
						<li v-for="(item,index) in itemName">
							<a href="javascript:;" class="item-link" @click="itemSwitch(index)" v-bind:class="{active:index==Switch}">{{item}}</a>
						</li>
					</ul>
				</div>
				<div class="AssetsBottomTitleLine"></div>
			</div>
			<div class="AssetsBottomInternational" v-for="item in international" v-if="Switch==0">
				<ul>
					<li>
						<div class="AssetsBottomInternationalDiv">{{item.Title}}</div>
						<p><b>{{item.money}}</b><span>{{item.unit}}</span></p>
						<p><b>{{item.PercentageN}}</b><span>{{item.Percentage}}</span></p>
						<p class="pT"><b>{{item.Number}}</b><span>{{item.Numberunit}}</span></p>
					</li>
				</ul>
			</div>
			<div class="AssetsBottomcontent" v-for="item in education" v-if="Switch==1">
				<ul>
					<li>
						<div class="AssetsBottomcontentDiv">{{item.Title}}</div>
						<p><b>{{item.money}}</b><span>{{item.unit}}</span></p>
						<p><b>{{item.PercentageN}}</b><span>{{item.Percentage}}</span></p>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {},
		name:"Assets",
		data() {
			return {
				Switch: 0,
				itemName: ["国际大类", "教育大类"],
				list: [{
					Title: '固定资产总计',
					money: 38.9,
					unit: '千万元',
					unitTN: 431,
					unitT: '万件',
					unitSN: 1287,
					unitS: '亩',
				}],
				international: [{
					Title: '土地、房屋及构筑建',
					money: 13.2,
					unit: '千万元',
					PercentageN: 33.9,
					Percentage: '%',
					Number: 1.87,
					Numberunit: 'km²',
				}, {
					Title: '通用设备',
					money: 10.2,
					unit: '千万元',
					PercentageN: 26.2,
					Percentage: '%',
					Number: 1212,
					Numberunit: '件',
				}, {
					Title: '专用设备',
					money: 7.5,
					unit: '千万元',
					PercentageN: 19.3,
					Percentage: '%',
					Number: 737,
					Numberunit: '件',
				}, {
					Title: '家具、用具、装具',
					money: 2.7,
					unit: '千万元',
					PercentageN: 6.9,
					Percentage: '%',
					Number: 73221,
					Numberunit: '件',
				}, {
					Title: '图书、档案',
					money: 2.6,
					unit: '千万元',
					PercentageN: 6.8,
					Percentage: '%',
					Number: 311,
					Numberunit: '万册',
				}, {
					Title: '无形资产',
					money: 1.6,
					unit: '千万元',
					PercentageN: 6.7,
					Percentage: '%',
					Number: 89,
					Numberunit: '件',
				}, {
					Title: '文物和陈列品',
					money: 1.1,
					unit: '千万元',
					PercentageN: 2.8,
					Percentage: '%',
					Number: 37,
					Numberunit: '件',
				}],
				education: [{
					Title: '房屋及建筑物',
					money: 8.1,
					unit: '千万元',
					PercentageN: 20.8,
					Percentage: '%',
				}, {
					Title: '仪器仪表',
					money: 1.5,
					unit: '千万元',
					PercentageN: 4.4,
					Percentage: '%',
				}, {
					Title: '土地及植物',
					money: 5.1,
					unit: '千万元',
					PercentageN: 13.1,
					Percentage: '%',
				}, {
					Title: '无形资产',
					money: 1.4,
					unit: '千万元',
					PercentageN: 4.1,
					Percentage: '%',
				}, {
					Title: '机电设备',
					money: 4.7,
					unit: '千万元',
					PercentageN: 12.1,
					Percentage: '%',
				}, {
					Title: '文物及陈列品',
					money: 1.1,
					unit: '千万元',
					PercentageN: 3.3,
					Percentage: '%',
				}, {
					Title: '电子设备',
					money: 4.2,
					unit: '千万元',
					PercentageN: 10.8,
					Percentage: '%',
				}, {
					Title: '工具、量具和器皿',
					money: 1.0,
					unit: '千万元',
					PercentageN: 2.2,
					Percentage: '%',
				}, {
					Title: '家具',
					money: 3.6,
					unit: '千万元',
					PercentageN: 9.3,
					Percentage: '%',
				}, {
					Title: '印刷机械',
					money: 0.7,
					unit: '千万元',
					PercentageN: 2.1,
					Percentage: '%',
				}, {
					Title: '文本设备',
					money: 2.8,
					unit: '千万元',
					PercentageN: 7.2,
					Percentage: '%',
				}, {
					Title: '标本模型',
					money: 0.5,
					unit: '千万元',
					PercentageN: 1.3,
					Percentage: '%',
				}, {
					Title: '标本模型',
					money: 2.0,
					unit: '千万元',
					PercentageN: 5.7,
					Percentage: '%',
				}, {
					Title: '被服装具',
					money: 0.3,
					unit: '千万元',
					PercentageN: 0.8,
					Percentage: '%',
				}, {
					Title: '图书',
					money: 1.7,
					unit: '千万元',
					PercentageN: 4.9,
					Percentage: '%',
				}, {
					Title: '卫生医疗器械',
					money: 0.2,
					unit: '千万元',
					PercentageN: 0.5,
					Percentage: '%',
				}, {
					Title: '牲畜',
					money: '--',
					unit: '千万元',
					PercentageN: '--',
					Percentage: '%',
				}],
				Bottom: [{
					Title: '本年增加',
					money: 2.27,
					unit: '千万元',
					unitTN: 3.7,
					unitT: '万件',
					unitSN: 0,
					unitS: '亩',
				}, {
					Title: '本年减少',
					money: 0.68,
					unit: '千万元',
					unitTN: 0.1,
					unitT: '万件',
					unitSN: 0,
					unitS: '亩',
				}]
			}
		},
		mounted() {},
		methods: {
			itemSwitch(index) {
				this.Switch = index;
			},
		},
	}
</script>

<style lang="stylus" scoped>
	.Assets {
		height: 100%;
		color: #75CBF2;
	}
	
	.AssetsTop {
		width: 270px;
		height: 200px;
		margin-left: 10px;
	}
	
	.AssetsTop_zj {
		width: 270px;
		height: 102px;
		background: rgba(0, 43, 76, 1);
		border-radius: 6px 6px 0px 0px;
		text-align: center;
	}
	
	.AssetsTop_zj p {
		font-size: 22px;
		font-family: 'DIN Medium';
		font-weight: 500;
		color: rgba(0, 255, 255, 1);
		background: url(../../../../../static/images/img4.png) no-repeat center bottom;
		padding-bottom: 7px;
		background-size: 176px 3px;
	}
	
	.AssetsTop_zj h1 {
		font-size: 30px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
		line-height: 34px;
		height: 32px;
		margin-left: 35px;
	}
	
	.AssetsTop_zj h1 span {
		font-size: 12px;
		font-family: "NSimSun";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		margin-left: 5px;
	}
	
	.AssetsTop_zj .Bottom {
		margin-left: 55px;
	}
	
	.AssetsTop_zj .Bottom h1 {
		font-size: 18px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
		line-height: 34px;
		float: left;
		margin-left: 15px;
	}
	
	.AssetsTop_zj .Bottom h1 span {
		font-size: 12px;
		font-family: "NSimSun";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		margin-left: 5px;
	}
	
	.AssetsTop_jj {
		width: 104%;
		margin-left: -4px;
	}
	
	.AssetsTop_jj .AssetsTop_j {
		width: 133px;
		height: 102px;
		background: rgba(0, 43, 76, 1);
		border-radius: 0px 0px 0px 6px;
		float: left;
		margin-top: 4px;
		text-align: center;
		margin-left: 4px;
	}
	
	.AssetsTop_jj p {
		font-size: 22px;
		font-family: 'DIN Medium';
		font-weight: 500;
		color: rgba(0, 255, 255, 1);
		background: url(../../../../../static/images/img4.png) no-repeat center bottom;
		padding-bottom: 7px;
		background-size: 131px 3px;
	}
	
	.AssetsTop_jj h1 {
		font-size: 24px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
		line-height: 34px;
		height: 32px;
	}
	
	.AssetsTop_jj h1 span {
		font-size: 12px;
		font-family: NSimSun;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		margin-left: 5px;
	}
	
	.AssetsTop_jj .Bottom h1 {
		font-size: 18px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 255, 1);
		line-height: 34px;
		float: left;
		margin-left: 15px;
	}
	
	.AssetsTop_jj .Bottom h1 span {
		font-size: 12px;
		font-family: "NSimSun";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		margin-left: 5px;
	}
	
	.AssetsTop_jj .TwoJ {
		float: left;
		margin-top: 4px;
		text-align: center;
		margin-left: 4px;
		width: 133px;
		height: 102px;
		background: rgba(0, 43, 76, 1);
		border-radius: 0px 0px 6px 0px;
	}
	
	.AssetsToptitle {
		font-size: 18px;
		font-family: "MicrosoftYaHei";
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		padding-top: 5px;
	}
	
	.AssetsBottom {
		width: 270px;
		height: 490px;
		margin-left: 10px;
		margin-top: 15px;
	}
	
	.AssetsBottomTitleLine {
		height: 30px;
		border-bottom: 1px solid rgba(38, 99, 132, 1);
	}
	
	.AssetsBottomTitle .AssetsBottomSwitch ul li {
		margin-left: 10px;
		width: 87px;
		height: 31px;
		line-height: 30px;
		text-align: center;
		float: left;
	}
	
	.AssetsBottomTitle .AssetsBottomSwitch ul li a {
		font-size: 18px;
		font-family: "MicrosoftYaHei";
		width: 87px;
		height: 29px;
		line-height: 30px;
		background: rgba(0, 36, 61, 1);
		text-align: center;
		color: rgba(117, 203, 242, 1);
		border: 1px solid rgba(38, 99, 132, 1);
		display: block;
	}
	
	.AssetsBottomTitle .AssetsBottomSwitch ul li .active {
		width: 87px;
		height: 31px;
		background: #021A2C;
		border: 1px solid rgba(38, 99, 132, 1);
		border-bottom: none;
	}
	
	.AssetsBottomcontent ul {
		margin-left: -5px;
		margin-top: 5px;
	}
	
	.AssetsBottomcontent ul li {
		width: 130px;
		height: 44px;
		font-size: 14px;
		color: rgba(117, 203, 242, 1);
		background: rgba(0, 33, 53, 0.9);
		border: 1px solid rgba(56, 193, 255, 0.5);
		float: left;
		margin-left: 5px;
		margin-top: 5px;
		text-indent: 8px
	}
	
	.AssetsBottomcontent ul li .AssetsBottomcontentDiv {
		font-size: 14px;
		font-family: "MicrosoftYaHei";
		font-weight: 400;
		width: 100%;
		color: rgba(117, 203, 242, 1);
		margin-top: 1px;
	}
	
	.AssetsBottomcontent ul li .change {
		color: #999999;
	}
	
	.AssetsBottomcontent ul li p {
		width: 75px;
		font-size: 12px;
		font-family: "DIN Medium";
		font-weight: 400;
		float: left;
		margin-top: 5px;
	}
	
	.AssetsBottomcontent ul li p b {
		font-size: 18px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 240, 1);
		margin-right: 3px;
	}
	
	.AssetsBottomcontent ul li p:nth-child(odd) {
		width: 50px;
	}
	
	.AssetsBottomcontent ul li p span {
		font-size: 12px;
		font-family: "NSimSun";
		font-weight: 400;
	}
	.AssetsBottomInternational ul li {
		width: 270px;
		height: 53px;
		font-size: 14px;
		color: rgba(117, 203, 242, 1);
		background: rgba(0, 33, 53, 0.9);
		border: 1px solid rgba(56, 193, 255, 0.5);
		float: left;
		margin-top:8px;
		text-indent: 8px;
		margin-bottom: 3.5px;
	}
	.AssetsBottomInternational ul li .AssetsBottomInternationalDiv{
		font-size: 14px;
		font-family: "MicrosoftYaHei";
		font-weight: 400;
		width: 100%;
		color: rgba(117, 203, 242, 1);
		margin-top: 5px;
		margin-bottom: 3px;
	}
	.AssetsBottomInternational ul li p {
		width: 110px;
		font-size: 12px;
		font-family: "DIN Medium";
		font-weight: 400;
		float: left;
		margin-top: 5px;
	}
	.AssetsBottomInternational ul li p b {
		font-size: 18px;
		font-family: "DIN Medium";
		font-weight: 400;
		color: rgba(0, 255, 240, 1);
		margin-right: 3px;
	}
	.AssetsBottomInternational ul li p span {
		font-size: 12px;
		font-family: "NSimSun";
		font-weight: 400;
	}
	.AssetsBottomInternational ul li p:nth-child(odd) {
		width: 50px;
	}
	.AssetsBottomInternational ul li .pT{
		width:90px;
		text-align: right;
	}
</style>