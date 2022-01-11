<template>
  <el-dialog :title="curr==2?'回放':'实时视频'" center class="video-modal emergency-modal noModal" :close-on-click-modal="false" :modal-append-to-body="false" :modal="false" :visible="curr!=''" :before-close="close" width="42.5rem">
    <el-carousel height="31.9rem" v-loading="loading" :autoplay="false" indicator-position="none" :arrow="cameras.length>1?'always':'never'">
      <el-carousel-item v-for="(item,index) in cameras" :key="index">
        <v :datas="item" :isReal="curr==1"></v>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
  import v from '../../components/videoComponent.vue';
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
        cameras: [], //方舱摄像头
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
      autoPlay(item) {
        var vm = this;
        vm.cameras = [];
        vm.initial = 0;
        vm.curr = item.type; //1是实时,2是回放
        vm.list = Object.assign({}, item);
        vm.getCameraConfig();
      },
      //获取摄像头配置信息
      getCameraConfig() {
        var vm = this;
        vm.loading = true;
        vm.$axios.post('edu/home/cshelterInfoNew', { shelterUuid: vm.list.shelterUuid }).then(function(res) {
          var cameras = res.camerList || [], arr = [], firmType = 2;
          cameras.forEach((data, index) => {
            if (!data.cameAddr || !data.snvrAddr) return;

            if (data.cameBrand == '海康') firmType = 1;
            else if (data.cameBrand == '宇视') firmType = 3;
            else firmType = 2;
			
			let obj={
				...data,
				isplayback:vm.curr,
				subPlatform:firmType,
				startTime:vm.list.alarmTime||'',
				deviceCode:data.deviceCode||'',
				deviceName:data.cameName,
				deviceIp:data.cameAddr,
				deviceUser:data.cameUser,
				devicePass:data.cameUpwd,
				nvrDeviceIp:data.snvrAddr,
				nvrDeviceUser:data.snvrUser,
				nvrDevicePass:data.snvrUpwd,
				deviceNo:data.snvrTnum,
			}
			vm.bus.getVideoPlayUrl(obj);
            if (vm.list.cameraUuid) {
              	if (obj.cameraUuid == vm.list.cameraUuid) arr = [obj];
            } else {
				if (obj.isStandard == 1) {
					arr.push(obj);
				}
            }
          });
          vm.cameras = arr;
          if (vm.cameras.length == 0) {
            vm.loading = false;
            vm.$message.error('没有获取到相应摄像头');
            return;
          }
          vm.initVideo();
        })
      },
      //关闭video控件
      closeVideo(type) {
        var vm = this;
        this.list = {};
        this.curr = '';
      },
      close() {
        var vm = this;
        if (vm.curr == 4) { this.$emit('close') };
        vm.cameras = [];
        this.closeVideo();
      }
    }
  }
</script>

<style lang="scss">
  .video-modal {
    .el-dialog__body {
      padding: 0px !important;
      background: #171e32 !important;

      .el-carousel__arrow {
        background: rgba(31, 45, 61, 1);

        .el-icon-arrow-left,
        .el-icon-arrow-right {
          color: white;
        }
      }
    }

    .playback video {
      height: 34.75rem;
    }
	.el-carousel{
		height: 31.9rem;
	}
    video {
      margin-top: 0px;
      width: 42.5rem !important;
      height: 31.9rem;
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
</style>
