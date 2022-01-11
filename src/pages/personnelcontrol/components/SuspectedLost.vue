<template>
	<div class="suspe">
		<h4 class="mdTitle">疑似异常</h4>
		<el-carousel class="Zslide CslideBox backboxContainer" indicator-position="outside" trigger="click" arrow="never" :interval="interval">
			<el-carousel-item class="pieL-RBox clearFix Campus">
				<div class="vertical-middle-c">
					<div class="vertical-middle clearFix">
						<div class="fl BlockData">
							<div class="BlockDataTitle">
								<div class="C-bdullitext">最近48小时</div>
							</div>
							<div class="uli">
								<p class="fist" @click="userdetail(48,false)">
									<span>疑似异常</span>
									<i class="fr color0ff Z-numberf">{{loseUserCount.Twentyfourcount}}<small>人</small></i>
								</p>
								<p v-for="data in loseUserCount.Twentyfourlist" @click="userdetail(48,data)">
									<span>{{data.lostStaffGrade}}级</span>
									<i class="fr color0ff Z-numberf">{{data.lostStaffCount}}<small>人</small></i>
								</p>
							</div>
						</div>
						<div class="fr BlockData">
							<div class="BlockDataTitle">
								<div class="C-bdullitext">最近7天</div>
							</div>
							<div class="uli">
								<p class="fist" @click="userdetail(7,false)">
									<span>疑似异常</span>
									<i class="fr color0ff Z-numberf">{{loseUserCount.Sevendaycount}}<small>人</small></i>
								</p>
								<p v-for="data in loseUserCount.Sevendaylist" @click="userdetail(7,data)">
									<span>{{data.lostStaffGrade}}级</span>
									<i class="fr color0ff Z-numberf">{{data.lostStaffCount}}<small>人</small></i>
								</p>
							</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
			<el-carousel-item class="pieL-RBox clearFix Campus">
				<div class="vertical-middle-c">
					<div class="vertical-middle">
						<div class="fl BlockData">
							<div class="BlockDataTitle">
								<div class="C-bdullitext">最近30天</div>
							</div>
							<div class="uli">
								<p class="fist" @click="userdetail(30,false)">
									<span>疑似异常</span>
									<i class="fr color0ff Z-numberf">{{loseUserCount.Thirtydaycount}}<small>人</small></i>
								</p>
								<p v-for="data in loseUserCount.Thirtydaylist" @click="userdetail(30,data)">
									<span>{{data.lostStaffGrade}}级</span>
									<i class="fr color0ff Z-numberf">{{data.lostStaffCount}}<small>人</small></i>
								</p>
							</div>
						</div>
						<div class="fr BlockData">
							<div class="BlockDataTitle">
								<div class="C-bdullitext">最近120天</div>
							</div>
							<div class="uli">
								<p class="fist" @click="userdetail(120,false)">
									<span>疑似异常</span>
									<i class="fr color0ff Z-numberf">{{loseUserCount.OneHundredAndTwentydaycount}}<small>人</small></i>
								</p>
								<p v-for="data in loseUserCount.OneHundredAndTwentydaylist" @click="userdetail(120,data)">
									<span>{{data.lostStaffGrade}}级</span>
									<i class="fr color0ff Z-numberf">{{data.lostStaffCount}}<small>人</small></i>
								</p>
							</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
		<el-dialog title="疑似异常详情" :modal-append-to-body="false" :visible="visible" :before-close="closeSub" custom-class="dialog-userdetail">
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
				visible: false,
				interval: 10000,
				autoplay: false,
				Hour: [{ //获取异常人员时间数组
					"Time": "48Hour"
				}, {
					"Time": "7Day"
				}, {
					"Time": "30Day"
				}, {
					"Time": "120Day"
				}],
				loseUserCount: { //疑似异常模块数据
					Twentyfourcount: "--", //24小时异常人员总和
					Sevendaycount: "--", //7天异常人员总和
					Thirtydaycount: "--", //30天异常人员总和
					OneHundredAndTwentydaycount: "--", //120天异常人数总和
					Twentyfourlist: [{
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}], //24小时疑似异常数据表
					Sevendaylist: [{
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}], //7天数据表
					Thirtydaylist: [{
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}], //30天数据表
					OneHundredAndTwentydaylist: [{
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}, {
						lostStaffGrade: "--",
						lostStaffCount: "--"
					}], //120天数据表
				},

			}
		},
		mounted: function() {
			this.getloseUserCount(); //获取疑似异常人员名单 按年假
		},
		methods: {
			closeSub() {
				this.visible = false;
			},
			userdetail(type, val) {
				this.visible = true;

				console.log(val);
				if(val == false) {
					var str = "";
					var typeChange = "";
					if(type == 48) {
						this.loseUserCount.Twentyfourlist.forEach((value, ) => {
							str += "'" + value.lostStaffGrade + "'" + ",";
						});
						typeChange = '48Hour'
					} else if(type == 7) {
						this.loseUserCount.Sevendaylist.forEach((value, ) => {
							str += "'" + value.lostStaffGrade + "'" + ",";
						});
						typeChange = '7Day'
					} else if(type == 30) {
						this.loseUserCount.Thirtydaylist.forEach((value, ) => {
							str += "'" + value.lostStaffGrade + "'" + ",";
						});
						typeChange = '30Day'
					} else if(type == 120) {
						this.loseUserCount.OneHundredAndTwentydaylist.forEach((value, ) => {
							str += "'" + value.lostStaffGrade + "'" + ",";
						});
						typeChange = '120Day'
					}
					if(str.length > 0) {
						str = str.substr(0, str.length - 1);
					}
					val = "(" + str + ")";
				} else {
					val = "('" + val.lostStaffGrade + "')";
					if(type == 48) {
						typeChange = '48Hour'
					} else if(type == 7) {
						typeChange = '7Day'
					} else if(type == 30) {
						typeChange = '30Day'
					} else if(type == 120) {
						typeChange = '120Day'
					}
				}
				this.$nextTick(function() {
					this.bus.$emit("userdetailData", typeChange, val, 1, null);
				})
			},
			getTwentyfourlist() { //获取24小时疑似异常人员
				return this.$axios.post('/traffic/people/loseUserCount/' + UNITID + "?lostType=" + this.Hour[0].Time);
			},
			getSevendaylist() { //获取7天时疑似异常人员
				return this.$axios.post('/traffic/people/loseUserCount/' + UNITID + "?lostType=" + this.Hour[1].Time);
			},
			getThirtydaylist() { //获取30天疑似异常人员
				return this.$axios.post('/traffic/people/loseUserCount/' + UNITID + "?lostType=" + this.Hour[2].Time);
			},
			getOneHundredAndTwentydaylist() { //获取120天疑似异常人员
				return this.$axios.post('/traffic/people/loseUserCount/' + UNITID + "?lostType=" + this.Hour[3].Time);
			},
			getloseUserCount() { //并发调用接口 获取异常人员名单
				var _this = this;
				//按年级级获取所有疑似异常的人 
				this.$axios.all([this.getTwentyfourlist(), this.getSevendaylist(), this.getThirtydaylist(), this.getOneHundredAndTwentydaylist()])
					.then(
						this.$axios.spread(function(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist) {
							_this.getloseUserCountSucc(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist)
						})
					)
			},
			getloseUserCountSucc(Twentyfourlist, Sevendaylist, Thirtydaylist, OneHundredAndTwentydaylist) {
				if(Twentyfourlist.lostList && Twentyfourlist.lostList.length > 0) { //存入24小时数组
					var sum = 0
					this.loseUserCount.Twentyfourlist = Twentyfourlist.lostList;
					for(var i = 0; i < this.loseUserCount.Twentyfourlist.length; i++) {
						sum += this.loseUserCount.Twentyfourlist[i].lostStaffCount;
					}
					this.loseUserCount.Twentyfourcount = sum
				}
				if(Sevendaylist.lostList && Sevendaylist.lostList.length > 0) { //存入7天数组
					var sum1 = 0
					this.loseUserCount.Sevendaylist = Sevendaylist.lostList
					for(var i = 0; i < this.loseUserCount.Sevendaylist.length; i++) {
						sum1 += this.loseUserCount.Sevendaylist[i].lostStaffCount;
					}
					this.loseUserCount.Sevendaycount = sum1
				}
				if(Thirtydaylist.lostList && Thirtydaylist.lostList.length > 0) { //存入30天数组
					var sum2 = 0;
					this.loseUserCount.Thirtydaylist = Thirtydaylist.lostList
					for(var i = 0; i < this.loseUserCount.Thirtydaylist.length; i++) {
						sum2 += this.loseUserCount.Thirtydaylist[i].lostStaffCount;
					}
					this.loseUserCount.Thirtydaycount = sum2
				}
				if(OneHundredAndTwentydaylist.lostList && OneHundredAndTwentydaylist.lostList.length > 0) { //存入120天数组
					var sum3 = 0;
					let List = OneHundredAndTwentydaylist.lostList
					let yearList = [];
//					for(let j = 0; j < 3; j++) {
//						let dates = new Date();
//						let year = this.formatdate(dates.setFullYear(dates.getFullYear() - j), 'yyyy');
//						yearList.push(year);
//					}
					for(var i = 0; i < List.length; i++) {
						sum3 += List[i].lostStaffCount;
					}
//					for(let i = 0; i < yearList.length; i++) {
//						let obj = {
//							lostStaffGrade: yearList[i],
//							lostStaffCount: '0',
//						};
//						List.unshift(obj);
//					}
					this.loseUserCount.OneHundredAndTwentydaylist = List;
					this.loseUserCount.OneHundredAndTwentydaycount = sum3
				}
			},
			formatdate(value, fmt) {
				const newvalue = new Date(value)
				let getDate = new Date(newvalue);
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
		}
	}
</script>

<style lang="stylus" scoped>
	.color0ff {
		color: #0ff;
	}
	
	.CslideBox {
		position: relative;
		overflow: hidden;
	}
	
	.suspe .pieL-RBox,.vertical-middle-c{
		height:100%;
	}
	
	.BlockData {
		margin-top: 0.5rem;
	}
</style>
<style>
	.suspe .el-carousel__indicators {
		display: none
	}
</style>