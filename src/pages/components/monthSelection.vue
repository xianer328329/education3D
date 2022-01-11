<template>
	<div class="block dataSelc">
		<span class="demonstration"></span>
		 <el-date-picker
      v-model="value1"
      type="month"
      placeholder="选择月" @change="monthTimeChange" value-format="yyyy-MM">
    </el-date-picker>
	</div>

</template>

<script>
	/* eslint-disable */
	export default {
		name: 'MonthSelc',
		props: {
			ondate: {
				type:String,
				default:''
			}
		},
		data() {
			return {
				show: false,
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
				},
				value1:new Date(),
			}
		},
		methods: {
			monthTimeChange(val) {
				this.$emit('monDateTimeChange', val)
			}
		},
		mounted: function() {
		
		},
		watch: {
      		ondate(val) {
        		this.value1 = new Date(val);
      		}
    	}

	}
</script>

<style lang="stylus">
	.el-picker-panel {
    background: #002037;
    border: 1px solid #31859c;
}
	.el-month-table td .cell{
		color:#75cbf2 !important;
		    font-size: 14px;
	}
	.el-month-table td.today .cell {
     color: #409EFF;
     font-weight: 400;
         border-bottom: 1px solid #409eff;
	}
	.el-month-table td {
    padding:0px 3px;
 
	}
 	.el-date-picker__header--bordered{
 		border:none;
 		margin-bottom: 10px !important;
 	}
 	.el-month-table td .cell:hover, .el-month-table td.current:not(.disabled) .cell {
    color: #fff !important;
    background: #409EFF;
    border-radius: 50%;
}
.el-month-table td .cell{
    width: 48px !important;
    height: 48px !important;
    line-height: 48px !important;
}
.el-input__prefix{
		left: auto !important;
		right:0px;
	}
	.el-popper[x-placement^=top] .popper__arrow::after {
		border-top-color: rgba(0, 32, 55, 1);
	}
	.el-popper[x-placement^=top] .popper__arrow {
		border-top-color: rgba(49, 133, 156, 1);
	}
	.el-date-picker__header {
    background: #004e81;
    border-radius: 2px 1px 1px 1px;
    margin: 0;
    height: 36px;
    padding: 0 8px;
}
.el-date-picker__header-label, .el-picker-panel__icon-btn {
    color: #75cbf2;
}
.el-date-picker__header--bordered{
	padding-bottom: 0px !important;
	border-bottom:none !important;
	}
</style>