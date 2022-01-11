<template>
	<div id="login">
		<div class="Z-loginBG h-loginBG">
			<img src="../../static/images/login/login_bg.png" width="1920" height="1080" />
			<div class="Z-login h-login">
				<img src="../../static/images/test/login_logo.png" alt="" class="logo" v-if="isTest"/>
				<img src="../../static/images/login/login_logo.png" alt="" class="logo" v-else/>
				<div class="form-bg">
					<form id="loginForm" action="" method="post">
						<div id="warning" v-show="warning">{{warning}}</div>
						<div class="Z-login-int clearFix">
							<img src="../../static/images/icon_user.png" alt="" />
							<input type="text" v-model="userName" name="userName" value="" placeholder="请输入用户名" @change="clearTimer"/>
						</div>
						<div class="Z-login-int clearFix">
							<img src="../../static/images/icon_code.png" alt="" />
							<input class="fl" v-model="userPass" type="password" name="userPass" value="" placeholder="请输入密码" />
						</div>

						<!--<div class="Z-login-int clearFix">
			            	<img src="../../static/images/icon_user.png"  alt=""/>
			            	<input type="text" v-model="phone" name="phone" value="" placeholder="请输入手机号"/>
			        	</div>-->
						<div class="Z-login-int clearFix code-c">
							<img src="../../static/images/code.png" alt="" />
							<input class="fl" v-model="code" type="text" name="code" value="" placeholder="请输入验证码" />
							<el-button :loading="coding" class="code-btn" @click="getCode" v-if="time==0">获取验证码</el-button>
							<el-button :loading="coding" class="code-btn" v-else>{{time}}s 后重发</el-button>
						</div>
						<el-button type="primary" class="btn" :loading="loading" @click="getLogin">登录</el-button>
						<!--<input class="btn" type="button" name="present" value="登录" @click="getLogin">-->

					</form>
				</div>
			</div>
			<div class="login-timer">
				<div class="time-c">
					<a v-for="item in times" :class="{'dot':item==11}">
						<img :src="require('../../static/images/login/'+item+'.png')" />
					</a>
				</div>
				<div class="date-c fr">
					<a v-for="item in dates" :class="{'dot':item==12}">
						<img :src="require('../../static/images/login/'+item+'.png')" />
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var timer, codeTimer;
	export default {
		name: 'Login',
		data() {
			return {
				isTest:process.env.ENV_CONFIG=='sit',//是否是测试环境
				code: '',
				userName: "",
				userPass: "",
				warning: "",
				times: [],
				dates: [],
				time: 0,
				coding: false, //获取验证码
				loading: false,
			}
		},
		beforeDestroy() {
			clearInterval(timer);
			clearInterval(codeTimer)
		},
		methods: {
			validate() {
				var vm = this;
				if(vm.userName == '' || vm.userPass == '') {
					vm.warning = '请输入用户名和密码';
					return false;
				} else {
					vm.warning = '';
					return true;
				}
			},
			getLogin() { //登陆接口
				var vm = this;
				if(this.validate()) {
					if(vm.code == '') {
						this.warning = '请获取验证码';
						return;
					}
					vm.loading = true;
					this.warning = '';
					var parameter = {
						userName: this.userName,
						userPass: this.userPass,
						randomCode: this.code
					}
					this.$axios.post(process.env.API_OHTTPH + 'user/alogin', parameter,(data,mess)=>{
						vm.loading = false;
						this.warning = mess;
						vm.clearTimer();
					}).then(this.loginSucc);
				}
			},
			loginSucc(res) {
				var data = res;
				localStorage.setItem("TOKEN", data.token);
				localStorage.setItem("unitid", data.dept.uuid);
				localStorage.setItem('UNITName', data.dept.deptName);
				localStorage.setItem("OHTTP", process.env.API_OHTTP); //测试地址
				localStorage.setItem("OHTTPC", process.env.API_OHTTPC); //云端跳转地址
				localStorage.setItem("USER", JSON.stringify(data.user));
				window.setUserdata(data.dept.uuid,data.dept.deptName,data.token);
				this.$router.push({
					path: "/Index",
				});
				this.loading = false;
			},
			//获取验证码
			getCode() {
				var vm = this;
				if(this.validate()) {
					var params = {
						userName: this.userName,
						userPass: this.userPass
					}
					vm.coding = true;
					this.$axios.post(process.env.API_OHTTPH + 'user/acode', params,(data,mess)=>{
						vm.coding = false;
						vm.warning = mess;
						vm.clearTimer();
					}).then((res) => {
						vm.coding = false;
						vm.code = res.randomCode;
						vm.setTimer();
					})
				}
			},
			setTimer(){
				var vm=this;
				vm.time = 60;
				codeTimer = setInterval(function() {
					if(vm.time > 0) {
						vm.time--;
					} else {
						vm.time = 0;
						clearInterval(codeTimer)
					}
				}, 1000)
			},
			clearTimer(){
				var vm=this;
				vm.time = 0;
				clearInterval(codeTimer)
			},
			initTime() {
				var oDate = new Date();
				var oHou = oDate.getHours() > 9 ? '' + oDate.getHours() : '0' + oDate.getHours();
				var oMin = oDate.getMinutes() > 9 ? '' + oDate.getMinutes() : '0' + oDate.getMinutes();
				var oSec = oDate.getSeconds() > 9 ? '' + oDate.getSeconds() : '0' + oDate.getSeconds();
				this.times = oHou.split('').concat([11]).concat(oMin.split('')).concat([11]).concat(oSec.split(''));

				var oYea = oDate.getFullYear();
				oYea = oYea.toString();
				var oMon = oDate.getMonth() + 1 > 9 ? '' + (oDate.getMonth() + 1) : '0' + (oDate.getMonth() + 1);
				var oDay = oDate.getDate() > 9 ? '' + oDate.getDate() : '0' + oDate.getDate();
				this.dates = oYea.split('').concat([12]).concat(oMon.split('')).concat([12]).concat(oDay.split(''));
			},
		},
		mounted: function() {
			this.initTime();
			timer = setInterval(this.initTime, 1000);
		}

	}
</script>

<!--赵的样式-->
<style lang="scss">
	#login {
		width: 100%;
		height: 100%;
		position: relative;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		overflow: hidden;
		.btn {
			width: 17rem;
			height: 2.5rem;
			background: #0d7ec6;
			border: none;
			outline: none;
			font-size: 1.5rem;
			color: #fff;
			line-height: 2.5rem;
			margin-top: 1.5rem;
			margin-left: -2rem;
			cursor: pointer;
			padding: 0px;
		}
		.Z-loginBG>img{
			min-width: 100%;
			min-height: 100%;
		}
	}

	.Z-loginBG {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		transform-origin: 0 0;
	}

	.Z-loginBG .Z-title {
		position: absolute;
		top: 4.5rem;
		left: 7.4rem;
	}

	.Z-loginBG .Z-login {
		width: 26.6rem;
		height: 26.5rem;
		background: url(../../static/images/loginKBG.png) no-repeat center;
		position: absolute;
		bottom: 1.6rem;
		right: 1.25rem;
		box-sizing: border-box;
	}

	#loginForm {
		text-align: center;
		margin-top: 6.5rem;
	}

	#loginForm .Z-login-int {
		width: 21.15rem;
		height: 2.4rem;
		border: 1px solid #75cbf2;
		margin-left: 1.4rem;
		margin-bottom: 1.2rem;
		background: rgba(117, 203, 242, 0.1)
	}

	#loginForm .Z-on {
		border: 1px solid #296595;
		box-shadow: 0 0 4px #296595;
	}

	.Z-login-int img {
		width: 2.4rem;
		height: 2.4rem;
		float: left;
	}

	.Z-login-int input {
		float: left;
		width: 15rem;
		height: 2.4rem;
		border: none;
		outline: none;
		background: transparent;
		color: #fff;
		margin-left: 0.6rem;
		font-size: 0.9rem;
		line-height: 2.4rem;
	}


	input:-webkit-autofill,
	textarea:-webkit-autofill,
	select:-webkit-autofill {
		-webkit-text-fill-color: #ededed !important;
		-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
		background-color: transparent;
		background-image: none;
		transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
	}

	input {
		background-color: transparent;
	}

	input::-webkit-input-placeholder {
		color: rgba(255, 255, 255, 0.7);
	}

	input::-moz-placeholder {
		color: rgba(255, 255, 255, 0.7);
	}

	input:-ms-input-placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
</style>

<!--黄的样式-->
<style lang="scss">
	.bgZoom .h-loginBG {
		.h-login {
			width: auto;
			height: auto;
			bottom: 4rem;
			right: 6rem;
			background:none;
			.logo{
				max-height: 4.5rem;
			}
			.form-bg {
				width: 30rem;
				height: 20rem;
				background: url(../../static/images/login/form_bg.png) no-repeat center;
				background-size: 100% 100%;
			}
			#warning {
				position: absolute;
				top: 5.75rem;
				left: 4.375rem;
				color: #0ff;
			}
			#loginForm {
				text-align: center;
				margin-top: 0px;
				padding-top: 3.25rem;
				.Z-login-int {
					margin-left: auto;
					margin-right: auto;
					&.code-c {
						width: 12.9rem;
						margin-left: 4.375rem;
						position: relative;
						input {
							width: 6.7rem;
						}
						.code-btn {
							position: absolute;
							left: 13.45rem;
							top: -1px;
							z-index: 3;
							width: 7.75rem;
							line-height: 2.4rem;
							height: 2.5rem;
							background: rgba(51, 191, 255, 0.1);
							border: 1px solid rgba(117, 203, 242, 1);
							box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.3);
							color: #00FFFF;
							cursor: pointer;
							padding: 0px;
							border-radius: 0px;
							&:focus,
							&:active {
								outline: none;
							}
						}
					}
				}
				.btn {
					width: 21.25rem;
					margin-left: 0px;
					margin-top: 1.1rem;
				}
			}
		}
		.login-timer {
			position: absolute;
			left: 6.45rem;
			top: 6.7rem;
			z-index: 2;
			img {
				display: inline-block;
				vertical-align: middle;
			}
			.time-c {
				margin-bottom: 1.5rem;
				font-size: 0px;
				margin-right: -0.75rem;
				a {
					img {
						width: 5.25rem;
					}
					&.dot img {
						padding: 0px 1rem;
						width: 1rem;
					}
				}
			}
			.date-c {
				a {
					img {
						width: 3rem;
					}
					&.dot {
						img {
							width: 1rem;
							padding: 0px 0.25rem;
							vertical-align: bottom;
						}
					}
				}
			}
		}
	}
</style>
