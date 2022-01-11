<template>
	<div class="block twodate">
    <el-date-picker
      v-model="value6"
      type="daterange"
      range-separator=""
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="logTimeChange" 
      value-format="yyyy-MM-dd"
      >
    </el-date-picker>
 </div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: 'TwoSelc',
		data() {
			return {
				show: false,
				value6:"",
			}
		},
		methods: {
			logTimeChange(val) {
				this.$emit('twodateTimeChange', val)
			}
		},
		mounted: function() {
			var _this=this
			this.bus.$on('dateTimeInt',function(mes){
				_this.value6="";
			})
		},

	}
</script>

<style lang="stylus">
	.twodate{}
	#data-box .el-date-editor--daterange.el-input__inner{
		width:13.85rem;
		height:1.4rem;
	}
	.el-picker-panel {
		background: rgba(0, 32, 55, 1);
		border: 1px solid rgba(49, 133, 156, 1);
	}
	.Z-QueryList .timeQuery .el-icon-date{
		display:none;
	}
	.Z-QueryList .timeQuery .el-range-input{padding-left:0;}
	.Z-QueryList .timeQuery  .el-range-separator{
		width: 1rem;
		border-top: 1px solid #999;
		margin-top: 1rem;
		display: inline-block;
		line-height:0;
	}
	.el-date-range-picker__header div {
   color: #75cbf2;
	}
	.el-date-editor .el-range__close-icon {
    font-size: 1rem;
    color: #c0c4cc;
    width: 2rem;
    display: inline-block;
    float: right;
    line-height: 1rem;
	}
	.el-date-range-picker__content.is-left{border-right:1px solid #31859c;}
	.el-popper[x-placement^=top] .popper__arrow::after {
		border-top-color: rgba(0, 32, 55, 1);
	}
	.el-popper[x-placement^=top] .popper__arrow {
		border-top-color: rgba(49, 133, 156, 1);
	}
	
	.el-date-table td.today span {
		color: #34affd;
		font-weight: 500;
	}
	.el-input__prefix{
		left: auto;
		right:0px;
	}
	.el-date-picker__header {
		background: rgba(0, 78, 129, 1);
		border-radius: 2px 1px 1px 1px;
		margin: 0;
		height: 36px;
		padding: 0 8px
	}
	
	.el-date-picker__header-label,
	.el-picker-panel__icon-btn {
		color: #75CBF2;
	}
	
	.el-date-table th {
		color: #75CBF2;
		font-size: 14px;
		border-bottom: solid 1px #31859C;
	}
	
	.el-date-table td.prev-month,
	.el-date-table td.next-month,
	.el-date-table td.prev-month {
		color: #31859C;
	}
	
	.el-date-table td.available {
		color: #75CBF2;
	}
	
	.el-date-table td.today {
		border-bottom: 1px solid #34affd;
	}
	
</style>