<template>
	<div class="emshrinkNav" >
		<div class="shrinkNav" id="shrinkNav">
			<ul>
				<li class="NO_Auth"  @click="shrink1(1,$event)" authName="al_emergency_baseinfo_realtimealarm" authDesc="实时警情">
					<p :class="{'newData':newData0}">实时警情</p>
				</li>
				<li class="NO_Auth"   @click="shrink1(2,$event)" authName="al_emergency_baseinfo_emergency" authDesc="突发事件">
					<p :class="{'newData':newData1}">突发事件</p>
				</li>
				<li class="NO_Auth"  @click="shrink1(3,$event)" authName="al_emergency_baseinfo_contingencyplan" authDesc="应急预案">
					<p :class="{'newData':newData2}">应急预案</p>
				</li>
			</ul>
		</div>
		<div class="SKRINKBox" id="SKRINKBox">
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK3" v-show="curr==1">
					<realTimeAlarm @showNew="showNew" ref="emergency1"></realTimeAlarm>
				</back-box>
			</transition>
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK2" v-show="curr==2">
					<emergency @showNew="showNew" ref="emergency2" @jumpPlan="jumpPlan"></emergency>
				</back-box>
			</transition>
			<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
				<back-box class="SKRINK SKRINK1" v-show="curr==3">
					<contingencyPlan @showNew="showNew" ref="emergency3"></contingencyPlan>
				</back-box>
			</transition>
		</div>
	</div>
</template>

<script>
	var oTher = 0;
	import contingencyPlan from './sub/contingencyPlan.vue';
	import emergency from './sub/emergency.vue';
	import realTimeAlarm from './sub/realTimeAlarm.vue';
	export default {
		components: {
			realTimeAlarm,//实时警情
			contingencyPlan,//应急预案
			emergency,//应急事件
		},
		name: 'BasicInfor',
		data() {
			return {
				curr:'',
				newData0:false,
				newData1:false,
				newData2:false,
			}
		},
		mounted: function() {
			var vm=this;
			$(window).click(function(e) {
				try{
					var target = $(e.target);
					if(!target.is('.shrinkNav *,.SKRINKBox *') &&!tagert.is('.v-modal')&&!tagert.is('.el-dialog__wrapper,.el-dialog__wrapper *')&&!target.is('.el-message-box__wrapper,.el-message-box__wrapper *')) {
						$('.shrinkNav li').removeClass('active');
						vm.curr='';
					}
				}catch(e){
					$('.shrinkNav li').removeClass('active');
					vm.curr='';
				}
			});
//			setInterval(function(){
//				vm.$refs['emergency1'].reload();
//				vm.$refs['emergency2'].reload();
//			},10000)
		},
		methods: {
			shrink(oIndex,event){
				clickshrink(oIndex,event,this)
			},
			shrink1(index,e) {
				if(this.curr==index||$(e.currentTarget).hasClass('NO_Auth')){
					return;
				}
				$('.shrinkNav li').removeClass('active');
				$(e.currentTarget).addClass('active');
				this.curr=index;
				var _this = this;
				this.bus.$emit('hideEmergencyDialog',index);
				this.$refs['emergency'+index].reload();				
			},
			//跳往应急预案
			jumpPlan(plan){
				var vm=this;
				$('.shrinkNav li').removeClass('active');
				$('.shrinkNav li:eq(2)').addClass('active');
				vm.curr=3;
				vm.$refs['emergency3'].selectPlan(plan);
			},
			//展示新消息红点
			showNew(obj){
				this['newData'+obj.index]=obj.state;
			}
		},
	}
</script>

<style lang="scss" scoped>	
	.emshrinkNav{
		position:absolute;
		right: 25.75rem;
		top:4.15rem;
	}
	.emshrinkNav .shrinkNav {
		position:relative;
		top:0px;
		right:0px;
		
	}
	.SKRINK{
		z-index: 7 !important;
	}
	.SKRINK1 {
		width: 35rem !important;
		right: 42px !important;
		top:0px !important;
		padding:20px 42px 10px 25px !important;
	}
	
	.SKRINK2 {
		width: 22rem !important;
		right: 42px !important;
		padding: 1.25rem  !important;
		top:0px !important;
		padding-right: 2rem !important;
	}
	.SKRINK3 {
		width: 24rem !important;
		right: 42px !important;
		top:0px !important;
		padding: 0px !important;
	}
	
	
	.newData{
		position: relative;
		&:after{
			content:'';
			position: absolute;
			right:-9px;
			top: -6px;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: red;
			
		}
	}
	.shrinkNav .active{
		color: #00FFFF !important;
		cursor: pointer !important;
	}
</style>

<style lang="scss">
	.text-center{
		text-align: center;
	}
	.inline{
		display: inline-block;
	}
	.h-el-cascader.el-cascader{
		line-height: 2rem;
		height: 2rem;
		.el-input__icon{
			line-height: 1rem;
		}
	}
	.SKRINK{
		.alarmBtn{
			cursor: pointer;
			display: inline-block;
			min-width: 4.45rem;
			text-align: center;
			box-sizing: border-box;
			&.big{
				min-width: 6rem;
				padding-top:0.3rem;
				padding-bottom: 0.3rem;
			}
		}
		.emergency-btn{
			color: white;
			background: #ED7703;
			padding: 0.25rem 0.4rem;
			font-size: 0.8rem;
			border-radius:2px;
			img{
				display: inline-block;
				width: 0.75rem;
				height: 0.85rem;
				position: relative;
				top: 0.1rem;
				margin-right: 0.1rem;
			}
			&.transprent-bg{
				background: transparent;
				color: #ED7703;
				border: 1px solid #ED7703;
			}
		}
		.blue-btn{
			font-size: 0.8rem;
			color: #00FFFF;
			line-height: 1.4rem;
		}
		.success-btn{
			font-size: 0.8rem;
			color: white;
			background: #0478B7;
			padding: 0.25rem 0.35rem;
			border-radius:2px;
		}
		.red-btn{
			font-size: 0.8rem;
			color: white;
			background: #D04A4A;
			padding: 0.25rem 0.35rem;
			border-radius:2px;
		}
	}
	.mt25{
		margin-top: 1.25rem;
	}
	.mt10{
		margin-top: 0.5rem;
	}
	.mt20{
		margin-top: 1rem;
	}
	.mt30{
		margin-top: 1.5rem;
	}
	.mb10{
		margin-bottom: 0.5rem;
	}
	.mb20{
		margin-bottom: 1rem;
	}
	.ml35{
		margin-left: 1.75rem;
	}
	.mr5{
		margin-right: 0.25rem;
	}
	.mr10{
		margin-right: 0.5rem;
	}
	.mr40{
		margin-right: 2rem;
	}
	.mt4{
		position: relative;
		top: 0.2rem;
	}
	.mb-none{
		margin-bottom: 0px !important;
		position: relative;
		top: -0.1rem;
	}
	.h-self-select{
		position: relative;
		display: inline-block;
		.el-select-dropdown{
			position: absolute !important;
			left: 0px !important;
			right: 0px !important;
			top: 1.5rem !important;
			bottom: auto !important;
			min-width: auto !important;
		}
		.el-scrollbar__wrap:hover{
			margin-right: 0px !important;
		}
		
	}
	.emergency-modal.el-dialog__wrapper{
		
		.el-dialog{
			margin-top: 4.2rem !important;//2rem
			margin-bottom: 1rem !important;
			.el-dialog__body{
				max-height: 700px;
				overflow-y: auto;
				overflow-x: hidden;
			}
		}
		
	}
	.has-length{
		position: relative;
		span{
			position: absolute;
			right: 5px;
			line-height: 30px;
			bottom: 0px;
			font-size: 14px;
			color: #0478B7;
		}
	}
	.h-group-table{
		border: 1px solid #31859C;
		&.el-table{
			th,td{
				.cell{
					color: #0ff;
					font-size: 0.8rem;
				}
			}
			.el-table__empty-text{
				font-size: 0.8rem;
			}
		}
	}
	.h-input-number{
		&.el-input-number{
			width: auto;
		}
	}
	.modal-visible{
		.el-dialog__body{
			overflow: visible !important;
		}
	}
	.h-emergency-radio{
		color: #75CBF2;
		.el-radio__input{
			border-radius: 50%;
		}
		.el-radio__label{
			display: inline-block;
			font-size: 0.9rem;
			vertical-align: middle;
		}
		.el-radio__inner{
			width: 0.9rem;
			height: 0.9rem;
			background-color: transparent;
			border: 1px solid #6BBBE0;
			border-radius: 50%;
			overflow: hidden;
		}
		.el-radio__input.is-checked .el-radio__inner{
			background: transparent;
			border-color:#0ff;
			&:after{
				width: 0.4rem;
				height: 0.4rem;
				background-color: #0ff;
			}
		}
		.el-radio__input.is-checked+.el-radio__label,.el-radio__label{
			color: #75CBF2;
		}
	}
	.h-el-cascader{
		
	}
	.h-EV-ul{
		/*margin-top: 20px;*/
		text-align: left;
		li {
			padding: 0.225rem 0px;
			line-height: 1.2rem;
			&:after{
				content: '';
				display: table;
				clear: both;
			}
			i {
				margin-right: 0.25rem;
				font-size: 0.8rem;
				vertical-align: top;
			}
			label{
				float: left;
				font-size: 0.8rem;
				color: #75CBF2;
				vertical-align: top;
				margin-right: 0.5rem;
				position:relative;
				padding-right:0.75rem; 
				&:after{
					content: '：';
					position: absolute;
					right: -5px;
					bottom: 0px;
				}
			}
			span{
				display: block;
				overflow: hidden;
				font-size: 0.8rem;
				font-weight: 400;
				color: #00FFFF;
				vertical-align: top;
				word-break: break-all;
				text-align: justify;
			}
		}
		
	}
	.colorred {
		color: #E5222D;
	}	
	.coloryellow {
		color: #ED7703;
	}
	
	/*折叠面板*/
	.event-collapse.el-collapse{
		border: none;
		margin-top: 1.25rem;
		.el-carousel__mask, .el-cascader-menu, .el-cascader-menu__item.is-disabled:hover, .el-collapse-item__header, .el-collapse-item__wrap{
			background-color: transparent;
		}
		.el-collapse-item{
			margin-bottom: 1rem;
			&:last-of-type{
				margin-bottom: 0px;
			}
			&.is-active .el-collapse-item__header{
				border-bottom-color: #ED7703;
			}
			.el-collapse-item__header{
				height: auto;
				line-height: normal;
				padding-bottom: 3px;
				border-bottom: 1px solid #4AACDB;
				.title{
					color:rgba(117,203,242,1);
					font-size: 0.8rem;
					overflow: hidden;
				}
				.el-icon-arrow-right{
					&:before{
						content: '';
						display: inline-block;
						width:11px;
						height: 11px;
						background: url(../../../../static/images/emergency/arrow_bottom.png) no-repeat;
					}
					&.is-active:before{
						background: url(../../../../static/images/emergency/arrow_bottom_active.png) no-repeat;
					}
				}
				.el-collapse-item__arrow,.el-collapse-item__arrow.is-active{
					transform: rotate(0deg);
				}
			}
			.el-collapse-item__wrap{
				border: none;
				.el-collapse-item__content{
					padding-top: 0.5rem;
					padding-bottom: 0px;
				}
				.content{
					color: white;
					font-size: 0.8rem;
					word-break: break-all;
				}
			}
		}
	}
	.video-list li:last-of-type{
		margin-bottom: 0px !important;
	}
</style>