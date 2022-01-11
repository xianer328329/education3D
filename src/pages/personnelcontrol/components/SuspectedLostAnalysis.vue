<template>
	<div class="supeal">
		<div class="c-title">疑似异常分析</div>
		<div class="CslideBoxul clearFix backboxContainer">
			<ul class="hd">
				<li :class="{'active':index==0}" @click="getloseUserAnaly(0)">最近48小时</li>
				<li :class="{'active':index==1}" @click="getloseUserAnaly(1)">最近7天</li>
				<li :class="{'active':index==2}" @click="getloseUserAnaly(2)">最近30天</li>
				<li :class="{'active':index==3}" @click="getloseUserAnaly(3)">最近120天</li>
			</ul>
			<div class="bdul clearFix">
				<div class="pie-CenterBox fl  CPIE ">
					<h4>男女生占比</h4>
					<div class="pie-pie" id="circular"></div>
					<div class="boy-girlratio clearFix">男生<i class="color0ff Z-numberf fr">{{TwentyfourManratio}}<small>%</small></i></div>
					<div class="boy-girlratio GirlsGirlratio clearFix">女生<i class="color0ff Z-numberf fr">{{TwentyfourWomanratio}}<small>%</small></i></div>
				</div>
				<div class="BlockData classTOP6 fr vertical-middle-c">
					<div class="vertical-middle">
						<div class="BlockDataTitle">
							<div class="C-bdullitext">班级TOP6</div>
						</div>
						<transition-group class="uli" name="fade" tag="div" enter-active-class="animated flipInX" leave-active-class="animated">					
							<p v-for="(data,index) in loseUserAnalylist" :key="data.lostStaffCount+index+data.lostDeptName" v-show="listshow" @click="userdetail(data)">
								<i class="fr color0ff Z-numberf">{{data.lostStaffCount}}<small>人</small></i>
								<span :title="data.lostDeptName">{{data.lostDeptName}}</span>
							</p>
						</transition-group>
					</div>
				</div>
			</div>
		</div>
		<el-dialog title="疑似异常详情" :modal-append-to-body="false" top="41vh" :visible="visible" :before-close="closeSub" custom-class="dialog-userdetail">
			<PersonnelDetails></PersonnelDetails>
		</el-dialog>
	</div>
</template>

<script>
	import PersonnelDetails from './PersonnelDetails.vue'
	export default {
		components: {
			PersonnelDetails, //详情弹窗
		},
		data() {
			return {
				listshow: true,
				Hour: [{ //获取异常人员时间数组
					"Time": "48Hour"
				}, {
					"Time": "7Day"
				}, {
					"Time": "30Day"
				}, {
					"Time": "120Day"
				}],
				index: 0, //图标切换下标
				TwentyfourManratio: "--%", //48男生比率
				TwentyfourWomanratio: "--%", //48女生比率
				loseUserAnalylist: [{
					lostDeptName: "--",
					lostStaffCount: "--"
				}, {
					lostDeptName: "--",
					lostStaffCount: "--"
				}, {
					lostDeptName: "--",
					lostStaffCount: "--"
				}, {
					lostDeptName: "--",
					lostStaffCount: "--"
				}, {
					lostDeptName: "--",
					lostStaffCount: "--"
				}, {
					lostDeptName: "--",
					lostStaffCount: "--"
				}], //班级异常人员数据表
				loseUserAnalypie: {}, //男女比例pie图
				SevendayAnalylist: [], //7天数据
				pieJsondata: { //pie图样式
					'color': ["#0087C4", "#FF8DC3"],
					'radius': '80%',
					'center': ['50%', '50%'],
					'emphasis': 'false',
					'lege': 'false',
					'itemGap': 14,
					'fontSize': 18,
					'top': 10,
				},
				pietitle: [{
					value: 0,
					name: "男生"
				}, {
					value: 0,
					name: "女生"
				}],
				visible: false,
			}
		},
		mounted: function() {
			this.getloseUserAnaly(0); //获取疑似异常人员 按班级 TOP6
			this.TwentyfourPie()
		},
		methods: {
			userdetail(val) {
				this.visible = true;
				//				console.log(this.Hour[this.index].Time);
				this.$nextTick(function() {
					this.bus.$emit("userdetailData", this.Hour[this.index].Time, val.lostDeptName, 2, null);
				})
			},
			closeSub() {
				this.visible = false;
			},
			getloseUserAnaly(index) { //获取疑似异常分析模块数据 包括pie图
				this.listshow = false;

				this.index = index;
				var url = '/traffic/people/loseUserAnaly/' + UNITID + "?lostType=" + this.Hour[index].Time;
				this.$axios.post(url).then((res) => {
					if(res.deptTopNList && res.deptTopNList.length > 0) {
						this.loseUserAnalylist = res.deptTopNList;
					}
					this.loseUserAnalypie = res.lostSexMap || [];
					this.TwentyfourAnalysispie(); //48 小时异常学生 男-女比例图
					this.listshow = true;
				}).catch(() => {
					this.listshow = true;
				})

			},
			/*异常学生 男-女比例图*/
			TwentyfourAnalysispie() { //48小时pie图
				var Twentyfour = this.loseUserAnalypie.lostManCount + this.loseUserAnalypie.lostWomanCount;
				if(Twentyfour) {
					//48小时男生占比
					this.TwentyfourManratio = (this.loseUserAnalypie.lostManCount / Twentyfour * 100).toFixed(2);
					//48小时女生占比
					this.TwentyfourWomanratio = (this.loseUserAnalypie.lostWomanCount / Twentyfour * 100).toFixed(2);
				} else if(Twentyfour == "0") {
					this.TwentyfourManratio = '0.00';
					this.TwentyfourWomanratio = '0.00';
				}
				//48小时pie数据
				this.pietitle = [{
						value: this.loseUserAnalypie.lostManCount,
						name: "男生"
					},
					{
						value: this.loseUserAnalypie.lostWomanCount,
						name: "女生"
					},
				]
				//关闭图例
				this.pieJsondata.lege = "false";
				this.pieJsondata.emphasis = "false";
				this.TwentyfourPie();

			},
			TwentyfourPie() {
				//关闭图例
				this.pieJsondata.lege = "false";
				this.pieJsondata.emphasis = "false";
				this.$nextTick(function(){
					var myChart = echarts.init(document.getElementById("circular"));
					myChart.setOption(Pie(this.pietitle, this.pieJsondata), true);
					myChart.resize();
					allCharts.push(myChart);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.color0ff {
		color: #0ff
	}
	
	.supeal .c-title {
		color: #75CBF2;
		position: absolute;
		font-family: "Microsoft Yahei";
	}
	
	.supeal .CslideBoxul .hd {
		position: absolute;
		z-index: 1;
		top: 0px;
		text-align: center;
		right: 0px;
	}
	
	.supeal .CslideBoxul .hd .on {
		font-size: 18px;
		color: #75CBF2;
	}
	
	.supeal .CslideBoxul .hd li {
		float: left;
		margin-right: 0.2rem;
		line-height: 1.1rem;
		padding: 0 0.25rem;
		display: inline-block;
		border: 1px solid rgba(255, 255, 255, 1);
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
		border-radius: 2px;
		font-size: 0.8rem;
		color: rgba(254, 254, 254, 1);
	}
	
	.supeal .CslideBoxul {
		width: 100%;
		height:100%;
		margin-top:0px;
		position: relative;
		overflow: hidden;
	}
	
	.supeal .CslideBoxul .hd .active {
		border: 1px solid rgba(0, 255, 255, 1);
		background: rgba(0, 255, 255, 0.2);
	}
	.bdul{
		position:absolute;
		top:2.5rem;
		bottom:0px;
		left:0px;
		width:100%;
	}
	.supeal .CPIE {
		width: 31%;
		height:100%;
		position: relative;
		float: left
	}
	
	.supeal .CPIE h4 {
		font-size: 0.8rem;
		font-weight: 400;
		color: rgba(117, 203, 242, 1);
		text-align: center
	}
	
	.supeal .CPIE .pie-pie {
		height: 60%;
		width: 100%;
	}
	
	.supeal .boy-girlratio {
		color: rgba(117, 203, 242, 1);
		font-size: 0.8rem;
		font-weight: 400;
		padding: 0 0.5rem;
	}
	
	.supeal .boy-girlratio:before {
		content: "";
		display: inline-block;
		width: 0.2rem;
		height: 0.7rem;
		background: #0087C4;
		margin-right: 0.3rem;
	}
	
	.supeal .GirlsGirlratio:before {
		background: #FF8DC3;
	}
	
	.supeal .boy-girlratio i {
		margin-left: 0.35rem;
		margin-top: 0.25rem;
	}
	
	.supeal .boy-girlratio small {
		font-size: 0.6rem;
		color: #75CBF2;
		margin-left: 0.15rem;
	}
	#Sevenday {
		height: 100%;
		width: 100%;
	}
	
	.classTOP6.BlockData {
		width: 65%;
		height: 100%;
	}
	
	.classTOP6 .uli {
		width: 100%;
	}
	
	.classTOP6 .uli p {
		text-align: left;
		height: 1.8rem;
		line-height: 1.8rem;
	}
	
	.classTOP6 .uli p span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display:block;
		float:none;
		padding-right:0.5rem;
	}
</style>