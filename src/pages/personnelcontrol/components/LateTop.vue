<template>
  <div class="latetop">
    <div class="c-title">晚出晚归TOP榜</div>
    <div class="C-toplist clearFix backboxContainer">
      <ul class="hd">
        <li :class="{'active':index==0}" @click="getnightInOutTopN(0)">最近30天</li>
        <li :class="{'active':index==1}" @click="getnightInOutTopN(1)">最近12个月</li>
      </ul>
      <div class="Cbdul C-bdulfistli clearFix">
        <div class="vertical-middle-c">
          <div class="vertical-middle">
            <div class="fl BlockData">
              <div class="BlockDataTitle">
                <div class="C-bdullitext">晚出班级TOP3</div>
              </div>
              <transition-group class="uli" name="fade" tag="div" enter-active-class="animated flipInX" leave-active-class="animated">
                <p v-for="(data,index) in Thirtydayoutlist" :key="data.nightStaffCount+index+data.nightDeptName" v-show="listshow" @click="userdetail(2,data)">
                  <i class="fr color0ff Z-numberf">{{data.nightStaffCount}}<small>人次</small></i>
                  <span :title="data.nightDeptName">{{data.nightDeptName}}</span>
                </p>
              </transition-group>
            </div>
            <div class="fr BlockData">
              <div class="BlockDataTitle">
                <div class="C-bdullitext">晚归班级TOP3</div>
              </div>
              <transition-group class="uli" name="fade" tag="div" enter-active-class="animated flipInX" leave-active-class="animated">
                <p v-for="(data,index) in Thirtydayintlist" :key="data.nightStaffCount+index+data.nightDeptName" v-show="listshow" @click="userdetail(1,data)">
                  <i class="fr color0ff Z-numberf">{{data.nightStaffCount}}<small>人次</small></i>
                  <span :title="data.nightDeptName">{{data.nightDeptName}}</span>
                </p>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="晚出晚归TOP详情" :modal-append-to-body="false" top="41vh" :visible="visible" :before-close="closeSub" custom-class="dialog-userdetail">
      <PersonnelDetails ref='PersonnelDetails'></PersonnelDetails>
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
        listshow: true,
        nightTypelist: [{ //调用接口传入参数
          "time": "30Day"
        }, {
          "time": "12Month"
        }],
        index: 0, //切换下标
        Thirtydayoutlist: [{
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }], //30天晚出人员
        Thirtydayintlist: [{
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }], //30天晚归人员
        OneHundredAndTwentydayinlist: [{
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }], //120天晚归人员
        OneHundredAndTwentydayoutlist: [{
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }, {
          nightDeptName: "--",
          nightStaffCount: "--"
        }], //120天晚出人员
      }
    },
    mounted: function() {
      this.getnightInOutTopN(0); //获取晚出晚归数据
    },
    methods: {
      closeSub() {
        this.$refs.PersonnelDetails.tableData.currentPage = 1;
        this.visible = false;
      },
      userdetail(type, val) {
        // type 1 为玩出 2为晚归
        //this.index 1为30天 2为1月
        this.visible = true;
        var indexName = '';
        if (this.index == 0) {
          indexName = "30Day";
        } else if (this.index == 1) {
          indexName = "12Month";
        }
        var _this = this;
        this.$nextTick(function() {
          _this.bus.$emit("userdetailData", type, val.nightDeptName, 3, indexName);
        })
      },
      getnightInOutTopN(index) { // 并发调用接口
        this.OneHundredAndTwentydayinlist = [{
            nightDeptName: "--",
            nightStaffCount: "--"
          }, {
            nightDeptName: "--",
            nightStaffCount: "--"
          }, {
            nightDeptName: "--",
            nightStaffCount: "--"
          }], //120天晚归人员
          this.OneHundredAndTwentydayoutlist = [{
            nightDeptName: "--",
            nightStaffCount: "--"
          }, {
            nightDeptName: "--",
            nightStaffCount: "--"
          }, {
            nightDeptName: "--",
            nightStaffCount: "--"
          }] //120天晚出人员
        this.listshow = false;
        this.index = index
        var url = '/traffic/people/nightInOutTopN/' + UNITID + "?nightType=" + this.nightTypelist[index].time;
        this.$axios.post(url).then((res) => {
          if (res.inDeptTopNList && res.inDeptTopNList.length > 0) {
            this.Thirtydayintlist = res.inDeptTopNList;
          } else {
            this.Thirtydayintlist = [{
              nightDeptName: "--",
              nightStaffCount: "--"
            }, {
              nightDeptName: "--",
              nightStaffCount: "--"
            }, {
              nightDeptName: "--",
              nightStaffCount: "--"
            }] //30天晚归人员
          }
          if (res.outDeptTopNList && res.outDeptTopNList.length > 0) {
            this.Thirtydayoutlist = res.outDeptTopNList;
          } else {
            this.Thirtydayoutlist = [{
              nightDeptName: "--",
              nightStaffCount: "--"
            }, {
              nightDeptName: "--",
              nightStaffCount: "--"
            }, {
              nightDeptName: "--",
              nightStaffCount: "--"
            }] //30天晚出人员
          }
          this.listshow = true;
        }).catch(() => {
          this.listshow = true;
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .latetop .c-title {
    color: #75CBF2;
    position: absolute;
    font-family: "Microsoft Yahei";
  }

  .latetop .C-toplist {
    width: 100%;
    height: 100%;
    margin-top: 0px;
    position: relative;
    overflow: hidden;
  }

  .latetop .C-toplist .hd {
    position: absolute;
    z-index: 1;
    top: 0px;
    text-align: center;
    right: 0px;
  }

  .latetop .C-toplist .hd li {
    padding: 0 0.25rem;
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

  .latetop .C-toplist .hd .active {
    border: 1px solid rgba(0, 255, 255, 1);
    background: rgba(0, 255, 255, 0.2);
  }

  .latetop .C-left {
    width: 226px;
    height: 300px;
    float: left;
  }

  .latetop .C-bdulfistli {
    position: absolute;
    top: 2.5rem;
    bottom: 0px;
    left: 0px;
    width: 100%;

    .vertical-middle-c {
      height: 100%;
    }
  }

  .latetop .C-bdulli {
    position: relative;
    top: -29px;
  }

  .latetop .C-bdulli .C-li {
    width: 228px;
    height: 42px;
    line-height: 42px;
    background: rgba(10, 63, 94, 1);
    border: 1px solid rgba(10, 80, 122, 1);
    margin-bottom: 6px;
    font-size: 16px;
    color: rgba(117, 203, 242, 1);
    padding: 0 4px;
    box-sizing: border-box;
  }

  .latetop .nowrap {
    font-size: 16px;
    color: rgba(117, 203, 242, 1);
    display: inline-block;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .latetop .C-right {
    float: left;
    position: relative;
    margin-left: 12px;
  }

  .latetop .C-bdulli .C-li .ngli {
    font-size: 22px;
    color: #00FFFF;
  }

  .latetop .C-bdulli .C-li small {
    font-size: 12px;
    color: #75CBF2;
    font-family: "Microsoft Yahei";
    margin-left: 6px;
  }

  .BlockData .uli p {
    text-align: left;
    height: 2.6rem;
    line-height: 2.6rem;
  }

  .BlockData .uli p span {
    float: none;
    display: block;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
