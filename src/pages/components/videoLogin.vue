<template>
	<div class="video_login">
		<el-dialog title="登录" :visible.sync="dialogvisibie" center :before-close="close" custom-class="video_dialog" :modal="false" :modal-append-to-body="false" :close-on-click-modal="false">
			<div class="video_form">
				<el-form :inline="true" :model="formInline">
					<el-form-item label="用户名">
						<el-input v-model="formInline.user" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="formInline.passw" placeholder="密码 "></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">登 录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { EventBus } from "@/util/event-bus.js";
	export default {
		data() {
			return {
				dialogvisibie: false,
				formInline: {},
				logintype: null,
			}
		},
		mounted() {
			let vm = this;
			EventBus.$on("videoLogin", function(obj) {
				vm.dialogvisibie = obj.flag;
				vm.logintype = obj.type;
			})
		},
		methods: {
			close() {
				this.dialogvisibie = false;
			},
			onSubmit() {
				let vm = this;
				vm.formInline.type = vm.logintype;
				EventBus.$emit("formInline", vm.formInline);
				vm.close();
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.video_login {
		.video_form {
			text-align: center;
		}
	}
</style>
<style>
	.video_dialog {
		margin-top: 3rem !important;
	}
</style>