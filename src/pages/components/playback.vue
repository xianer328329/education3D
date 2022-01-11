<template>
  <div class="el-dialog__wrapper playbackVideo" v-show="curr!=''">
	  <div class="el-dialog el-dialog--center">
		  <div class="el-dialog__header"><span class="el-dialog__title">{{list.deviceName||'回放'}}</span><button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close"><i class="el-dialog__close el-icon el-icon-close"></i></button></div>
		  <div class="el-dialog__body">
			  <div class="el-carousel" v-loading="loading">
					<v :datas="{...item,showSmart}" :isReal="curr==1" v-for="(item,index) in cameras" :key="index"></v>
			  </div>
				<el-form :inline="true" label-width="7rem">
					<el-form-item label="选择日期">
						<el-date-picker v-model="date" placeholder="请选择日期" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-form-item label="选择时间">
						<el-time-picker is-range popper-class="playback-time" :clearable="false" value-format="HH:mm:ss" v-model="time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
						 </el-time-picker>
					</el-form-item>
					<el-button type="primary" @click="getCameraConfig">查询</el-button>
					<!-- <el-switch v-model="showSmart" :active-value="true" :inactive-value="false" active-text="智能信息" inactive-text="" v-if="cameras.length>0&&cameras[0].subPlatform==5"></el-switch> -->
				</el-form>
		  </div>
	  </div>
  </div>
</template>

<script>
  
  import v from './videoComponent.vue';
  export default {
    name: 'playVideo',
    components: {
      v
    },
    data() {
      return {
        curr: '',//1实时，2回放
        loading: false,
        initial: 0,
        list: {}, //当前选中的告警
        cameras:[], //视频
		date:new Date().Format('yyyy-MM-dd'),//日期
		time:this.getTime(),
		showSmart:true,//海康显示智能信息配置
      }
    },
    mounted() {
      var vm = this;
    },
    methods: {
      //初始化视频控件
      initVideo() {
        var vm = this;
        vm.loading = false;
      },
      autoPlay(type,item) {
        var vm = this;
        vm.cameras =[];
        vm.initial = 0;
        vm.curr = type; //1是实时,2是回放
        vm.list = Object.assign({}, item);
		this.date=new Date().Format('yyyy-MM-dd');//日期
		this.time=this.getTime();		
        vm.getCameraConfig();
      },
	  // 获取默认时间
	  getTime(){
			return ['00:00:00','23:59:59']
	  },
      //获取摄像头配置信息
      getCameraConfig() {
        var vm = this;
        vm.loading = true;
		vm.cameras=[];
		setTimeout(()=>{
			this.$nextTick(()=>{
				vm.cameras =[this.bus.getVideoPlayUrl({...this.list,startTime:this.date+' '+this.time[0],endTime:this.date+' '+this.time[1]})];
				vm.initVideo();
			})
		},100)
      },
      //关闭video控件
      close() {
        var vm = this;
        vm.cameras =[];
        this.list = {};
        this.curr = '';
      }
    }
  }
</script>

<style lang="scss">
  .playbackVideo {
	  z-index: 2000;
	  .el-dialog{
		 width: 52rem; 
		 margin-top: 1rem !important;
	  }
    .el-dialog__body {
      padding:0px !important;
      background: #171e32 !important;

      .el-carousel__arrow {
        background: rgba(31, 45, 61, 1);

        .el-icon-arrow-left,
        .el-icon-arrow-right {
          color: white;
        }
      }
    }
	.el-carousel,video{
		height: 25.5rem;
	}
    video {
      margin-top: 0px;
      width: 42.5rem !important;
    }
  }

  .el-dialog__wrapper.noModal {
    left: auto;
    right: 17rem;
    bottom: auto;
    top: 7.05rem;

    .el-dialog {
      margin: 0px !important;
    }
  }
  
  
  .playbackVideo{
	  .el-form{
		  padding-top: 1rem;
	  }
	  .el-date-editor.el-input, .el-date-editor.el-input__inner,.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
		  width: 13.5rem;
	  }
	  input,.el-range-separator,.el-switch__label{		  
		  font-size: 0.8rem !important;
		  color: #75CBF2 !important;
	  }
	  .el-switch__label{
		  margin-left: 0.5rem;
		  span{
			  font-size: 0.8rem !important;
		  }
	  }
	  .el-switch__core{
		  margin-left: 0.5rem;
		  width: 2rem !important;
		  height:1rem !important;
		  &:after{
			  top: 0.05rem;
			  width: 0.8rem;
			  height: 0.8rem;
		  }
	  }
	  .el-switch.is-checked .el-switch__core::after{
		  margin-left: -0.85rem;
	  }
	  .el-range-editor{
		  .el-range-input{
		  	 background: transparent !important;
		  }
	  }
	  .el-range__icon,.el-icon-date,.el-range-separator{
		  line-height: 1.6rem !important;
		  vertical-align: middle !important;
	  }
	  .el-range-input{
		  vertical-align: middle;
	  }
	  .el-range__close-icon{
		  width: 2rem;
		  font-size: 0.8rem;
	  }
	  .el-button{
		  height: 2rem;
		  padding: 0.6rem 0.8rem;
	  }
  }
</style>



<style lang="scss">
	.playback-time{
		&.el-picker-panel,.el-time-spinner__item,.el-time-panel__btn{
			color: #bbb;
			&.confirm,&.active:not(.disabled){
				color: #75CBF2;
			}
		}
		.el-time-spinner__item{
			background: transparent !important;
		}
	}
</style>
