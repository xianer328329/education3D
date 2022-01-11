<template>
	<el-dialog class="model" title="3D建模" :modal-append-to-body="true" :append-to-body="true" :visible="curr!=''" :before-close="close" width="70%" center>
	   <microMap></microMap>  
	</el-dialog>

</template>

<script>
	import microMap from '../../microMap/index.vue' //微地图
	export default {
		name: 'model',
		components: {
			microMap,//3D建模组件
		},
		data() {
			return {
				curr:'',
			}
		},
		mounted: function() {
			
		},
		methods: {
			show(){
				this.curr=1;
			},
			close(){
				this.curr='';
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.model{
		/deep/{
			.el-dialog{
				margin-top: 2% !important;
				margin-bottom: 2% !important;
				position: absolute !important;
				right: 27% !important;
				height: 94%;
				display: flex;
				flex-direction: column;
				.el-dialog__body{
					flex: 1;
					padding: 0 !important;
				}
			}
		}
	}
</style>
