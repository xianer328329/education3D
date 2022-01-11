<template>
 <div class="alarmList-mian">
  <el-dialog title="报警列表" class="h-dialog h-dialog-dropdown defence-modal" :center="true" :modal-append-to-body="false"
  width="55%" :visible="dialogVisible" :before-close="closedetails">
   <div class="listOrChart">
    <img src="../../../assets/icon/icon-list.png" @click="listToCharts('list')">
    <img src="../../../assets/icon/icon-charts.png" @click="listToCharts('charts')">
   </div>

   <div class="alarm-from QueryParameters">
    <div class="alarm-type">
     <span v-for="item in dictList" :class="classObject(item.dictValue)" :key="item.uuid" @click="addAlarmType(item.dictValue)">{{item.dictValue}}</span>
    </div>
    <div class="alarm-from-ul">
     <ul class="Z-QueryList clearFix mag-top" id="data-box">
      <li>
       <p class="lable">状态</p>
       <el-select v-model='seachInfo.alarmStatus' clearable placeholder="请选择状态">
        <el-option :value="item.value" v-for="item in options" :label="item.label" :key="item.label"></el-option>
       </el-select>
      </li>
      <li>
       <span class="lable">报警日期</span>
       <div class="timeQuery">
        <div class="block twodate">
         <el-date-picker v-model="dateTime" :clearable="true" type="daterange" range-separator="" start-placeholder="开始日期"
         end-placeholder="结束日期" @change="twodateQuery" value-format="yyyy-MM-dd HH:mm:ss">
         </el-date-picker>
        </div>
       </div>
      </li>
      <li>
       <p class="lable">楼宇</p>
       <el-cascader v-model="seachInfo.deviceBuild" change-on-select :options="nodeList" clearable @change="handleChange"></el-cascader>
      </li>
      <li>
       <p class="lable">设备编号</p>
       <el-input v-model="seachInfo.deviceName" placeholder="请输入设备编号"></el-input>
      </li>
      <li v-show="seachInfo.deviceName">
       <p class="lable">线路</p>
       <el-select v-model="seachInfo.alarmNode" clearable placeholder="请选择线路">
        <el-option :value="it.nodeName" v-for="(it,index) in lineList" :label="it.nodeName" :key="index"></el-option>
       </el-select>
      </li>
      <li v-on:click='query'>
       <div class="QueryBtn">查询</div>
      </li>
     </ul>
    </div>
   </div>
   <div v-show="curr=='list'">
    <div class="alarm-list">
     <div class="v-table">
      <el-table :data="alarmList" size="mini" height="14.3rem" stripe :border="false" @row-click="rowClick">
       <el-table-column label="报警类型" :show-overflow-tooltip="true" prop="alarmType">
       </el-table-column>
       <el-table-column label="报警时间" :show-overflow-tooltip="true" prop="alarmTime">
        <template slot-scope="scope">{{scope.row.alarmTime|time}}</template>
       </el-table-column>
       <el-table-column label="设备号" :show-overflow-tooltip="true" prop="deviceName">
       </el-table-column>
       <el-table-column label="位置" :show-overflow-tooltip="true" prop="alarmSite">
       </el-table-column>
       <el-table-column label="线路" :show-overflow-tooltip="true" prop="alarmNode">
       </el-table-column>
       <el-table-column label="数值" :show-overflow-tooltip="true" prop="alarmUnum">
        <template slot-scope="scope">
         <span>{{scope.row.alarmUnum||'--'}}</span>
        </template>
       </el-table-column>
       <el-table-column label="状态" :show-overflow-tooltip="true" prop="alarmStatus">
        <template slot-scope="scope">
         <span :class="{red:scope.row.alarmStatus==1}">{{scope.row.alarmStatus==1?'未处理':'已处理'}}</span>
        </template>
       </el-table-column>
      </el-table>
      <page :pager="pageInfo" @pageChange="changePage"></page>
     </div>
    </div>
   </div>
   <div v-show="curr=='charts'">
    <div class="v-table">
     <div class="title-box proportion">
      <div class="atrend-title fr">
       <a @click="switcharts(1)" class="atrem-boderf" :class="{'activechar':active==1}">面积图</a>
       <a @click="switcharts(2)" class="atrem-boderc" :class="{'activechar':active==2}">柱状图</a>
       <a @click="switcharts(3)" class="atrem-boderr" :class="{'activechar':active==3}">环形图</a>
      </div>
     </div>
     <div id="chartsbox"></div>
    </div>
   </div>
  </el-dialog>
 </div>
</template>

<script>
 import page from './page.vue'
 export default {
  components: {
   page
  },
  data() {
   return {
    nodeList: [],
    alamtype: [{
     value: '1',
     label: '报警'
    }, {
     value: '2',
     label: '预警'
    }],
    options: [{
     value: '',
     label: '不限'
    }, {
     value: '1',
     label: '未处理'
    }, {
     value: '0',
     label: '已处理'
    }],
    alarmType: '',
    active: 1,
    currnumber: 0,
    dateTime: [],
    dialogVisible: false,
    curr: 'list',
    buildList: [],
    alarmList: [],
    dictList: [],
    earlydictList: [],
    policedictList: [],
    typeList: [],
    chartsList: [],
    seachInfo: {
     alarmNode: '',
     alarmStatus: '',
     deviceBuild: [],
     deviceName: '',
     startDate: '',
     endDate: '',
     alarmClass: ''
    },
    lineList: [],
    pageInfo: {
     total: 0,
     pageSize: 10,
     currentPage: 1
    }
   }
  },
  watch: {
   'seachInfo.alarmClass': function(newVal, oldVal) {
    let vm = this
    if (newVal === '') {
     return
    }
    vm.typeList = vm.settypeList()
    vm.query()
   },
   'seachInfo.deviceName': function(newVal, oldVal) {
    let vm = this;
    vm.getdevicenodesearh();
   },

  },
  filters: {
   time(val) {
    if (!val) {
     return '--'
    }
    return val.substr(0, val.length - 3)
   }
  },
  computed: {
   classObject: function(i) {
    return function(i) {
     return {
      active: this.typeList.includes(i)
     }
    }
   }
  },
  mounted() {
   let vm = this
   this.bus.$off('changeListprop').$on('changeListprop', function(type, data) {
    if (vm.currnumber > 1) {
     return
    }
    vm.show(type, data)
    vm.currnumber += 1
   })
   if (vm.buildList.length === 0) {
    var obj = vm.getdict()
    vm.policedictList = obj.dict1 || []
    vm.earlydictList = obj.dict2 || []
   }
  },
  methods: {
   query() {
    if (this.curr === 'list') {
     this.AlarmList()
    } else {
     this.getchardata()
    }
   },
   async show(type, data) {
    /* type 1 报警
            2 预警
            3 未处理
            4 报警总数
            5 elecSafetyList.vue 带参设备点位跳转
            6 报警点位elecSafetyPopup.vue 线路带参跳转
            7 报警点位elecSafetyPopup.vue 编号带参跳转
            8 设备点位 elecSafetyPopup.vue 设备带参跳转
    */
    let vm = this
    vm.alarmType = type
    // vm.seachInfo.startDate = vm.formatDate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30), 'yyyy-MM-dd hh:mm:ss');
    // vm.seachInfo.endDate = vm.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
    vm.buildList.length > 0 ? '' : vm.getbuild()
    vm.nodeList.length > 0 ? '' : vm.getnode()
    switch (type) {
     case 1:
     case 2:
      vm.seachInfo.alarmClass = type === 1 ? '1' : '2' // alarmClass 1报警 2 预警
      vm.seachInfo.startDate = vm.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      vm.seachInfo.endDate = vm.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      break
     case 3:
      vm.seachInfo.alarmStatus = '1' // alarmStatus 1未处理 0 已处理
      break
     case 4:
      vm.seachInfo.alarmStatus = ''
      break
     case 5:
     case 7:
      vm.seachInfo.deviceName = data.deviceName
      vm.seachInfo.deviceBuild = [data.deviceBuild]
      break
     case 6:
      vm.seachInfo.deviceBuild = [data.deviceBuild]
      vm.seachInfo.deviceName = data.deviceName
      vm.seachInfo.alarmNode = data.alarmNode
      break
     case 8:
      vm.seachInfo.deviceName = data.deviceName
      vm.seachInfo.deviceBuild = [data.deviceBuild]
      vm.seachInfo.startDate = data.createTime
      vm.dateTime = [vm.seachInfo.startDate, vm.seachInfo.endDate]
      break
     default:
      break
    }
    vm.dateTime = [vm.seachInfo.startDate, vm.seachInfo.endDate]
    vm.typeList = vm.settypeList()
    vm.query()
    vm.dialogVisible = true
   },
   getchardata() {
    let vm = this
    let params = {
     'alarmStatus': this.seachInfo.alarmStatus,
     'deviceBuild': '',
     'alarmType': this.typeList.join(','),
     'startDate': '',
     'endDate': '',
     'alarmNode': this.seachInfo.alarmNode,
     'deviceName': this.seachInfo.deviceName
    }
    this.seachInfo.alarmClass && (params.alarmClass = this.seachInfo.alarmClass)
    if (!this.seachInfo.startDate || !this.seachInfo.endDate) {
     // return this.$message.error('开始时间或结束时间不能为空')
    } else {
     let startDate = new Date(this.seachInfo.startDate)
     startDate.setHours(0, 0, 0)
     params.startDate = startDate
     params.startDate = vm.formatDate(startDate, 'yyyy-MM-dd hh:mm:ss')
     let endDate = new Date(this.seachInfo.endDate)
     endDate.setHours(23, 59, 59)
     params.endDate = vm.formatDate(endDate, 'yyyy-MM-dd hh:mm:ss')
    }
    if (this.seachInfo.deviceBuild.length > 0) {
     params.deviceBuild = this.seachInfo.deviceBuild[0];
     params.deviceUnit = this.seachInfo.deviceBuild[1];
     params.deviceRoom = this.seachInfo.deviceBuild[2]
    }
    this.$axios.post('/elec/safety/aselectlistview', params).then(res => {
     this.chartsList = res.dataList.reverse() || []
     this.initcharts(this.active)
    })
   },
   AlarmList() {
    let vm = this
    let params = {
     'currentPage': this.pageInfo.currentPage,
     'pageSize': this.pageInfo.pageSize,
     'alarmStatus': this.seachInfo.alarmStatus,
     'deviceBuild': '',
     'alarmType': this.typeList.join(','),
     'startDate': '',
     'endDate': '',
     'alarmNode': this.seachInfo.alarmNode,
     'deviceName': this.seachInfo.deviceName
    }
    this.seachInfo.alarmClass && (params.alarmClass = this.seachInfo.alarmClass)
    if (!this.seachInfo.startDate || !this.seachInfo.endDate) {
     // return this.$message.error('开始时间或结束时间不能为空')
    } else {
     let startDate = new Date(this.seachInfo.startDate)
     startDate.setHours(0, 0, 0)
     params.startDate = startDate
     params.startDate = vm.formatDate(startDate, 'yyyy-MM-dd hh:mm:ss')
     let endDate = new Date(this.seachInfo.endDate)
     endDate.setHours(23, 59, 59)
     params.endDate = vm.formatDate(endDate, 'yyyy-MM-dd hh:mm:ss')
    }
    if (this.seachInfo.deviceBuild.length > 0) {
     params.deviceBuild = this.seachInfo.deviceBuild[0];
     params.deviceUnit = this.seachInfo.deviceBuild[1];
     params.deviceRoom = this.seachInfo.deviceBuild[2]
    }
    this.$axios.post('/elec/safety/aselectlist', params).then((res) => {
     this.alarmList = res.dataList || []
     this.pageInfo.total = res.total
    })
   },
   rowClick(row, index) {
    this.bus.$emit('setAlarmPoint', 1, row)
    this.closedetails()
   },
   getnode(data) {
    this.$axios.post('/elec/safety/aselectnodesearh', {}).then(res => {
     this.nodeList = res || []
    })
   },
   handleChange() {},
   getdevicenodesearh() {
    if (this.seachInfo.deviceName === '') {
     return
    }
    this.$axios.post('/elec/safety/aselectdevicenodesearh', {
     "deviceName": this.seachInfo.deviceName
    }).then(res => {
     this.lineList = res;
    })
   },
   async getbuild() {
    var data = await this.$axios.post('/elec/safety/aselectdevicebuild', {}).then(res => {
     return res
    })
    this.buildList = data || []
   },
   dict1() {
    return this.$axios.post(process.env.API_OHTTPH + '/system/dict/aqueryList', {
     'dictType': 'elecAlarm',
     'dictName': '报警'
    })
   },
   dict2() {
    return this.$axios.post(process.env.API_OHTTPH + '/system/dict/aqueryList', {
     'dictType': 'elecAlarm',
     'dictName': '预警'
    })
   },
   async getdict() {
    let vm = this
    var obj = await vm.$axios.all([vm.dict1(), vm.dict2()]).then(vm.$axios.spread(function(dict1, dict2) {
     return {
      dict1: dict1,
      dict2: dict2
     }
    }))
    vm.policedictList = obj.dict1 || []
    vm.earlydictList = obj.dict2 || []
    return obj
   },
   settypeList() {
    let vm = this
    var typeList = []
    vm.dictList = vm.earlydictList.concat(vm.policedictList)
    if (vm.dictList.length > 0) {
     if (vm.alarmType === 1) {
      vm.policedictList.forEach((item) => {
       typeList.push(item.dictValue)
      })
     } else if (vm.alarmType === 2) {
      vm.earlydictList.forEach((item) => {
       typeList.push(item.dictValue)
      })
     } else {
      vm.dictList.forEach((item) => {
       typeList.push(item.dictValue)
      })
     }
    } else {
     vm.getdict()
    }
    vm.typeList = typeList
    return typeList
   },
   changePage(page) {
    this.pageInfo = $.extend(this.pageInfo, JSON.parse(page))
    this.AlarmList()
   },
   twodateQuery(res) {
    if (res) {
     this.seachInfo.startDate = res[0]
     this.seachInfo.endDate = res[1]
    }
    if (!this.seachInfo.startDate || !this.seachInfo.endDate) {
     return this.$message.error('开始时间或结束时间不能为空')
    }
   },
   addAlarmType(item) {
    var index = this.typeList.indexOf(item)
    if (index !== -1) {
     this.typeList.splice(index, 1)
    } else {
     this.typeList.push(item)
    }
   },
   listToCharts(curr) {
    let vm = this
    vm.curr = curr
    if (curr === 'charts') {
     vm.seachInfo.startDate = vm.formatDate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * 6),
      'yyyy-MM-dd hh:mm:ss') // 半年
    } else {
     vm.seachInfo.startDate = vm.formatDate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
      'yyyy-MM-dd hh:mm:ss')
    }
    vm.seachInfo.endDate = vm.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
    vm.dateTime = [vm.seachInfo.startDate, vm.seachInfo.endDate]
    vm.query()
   },
   switcharts(active) {
    this.active = active
    this.initcharts(active)
   },
   initcharts(active) {
    let vm = this
    var myCharts = echarts.init(document.getElementById('chartsbox'))
    var xdata = []
    var ydata = []
    var startDate = new Date(vm.seachInfo.startDate)
    var endDate = new Date(vm.seachInfo.endDate)
    var dataList = []

    for (var i = startDate; i <= endDate; i.setMonth(i.getMonth() + 1)) {
     var alarmTime = vm.formatDate(i, 'yyyy-MM')
     dataList.push(alarmTime)
    }
    // dataList.push(vm.formatDate(vm.seachInfo.endDate, 'yyyy-MM'))
    dataList.forEach((item) => {
     var num = 0
     this.chartsList.forEach((it) => {
      if (!it.num) {
       it.num = 0
      }
      if (it.MONTH == item) {
       num = it.num
      }
     })
     ydata.push(num)
     xdata.push(item)
    })
    if (active === 1) {
     myCharts.setOption(vm.setoption(xdata, ydata), true)
    } else if (active === 2) {
     myCharts.setOption(vm.setbaroption(xdata, ydata), true)
    } else {
     myCharts.setOption(vm.setpieoptions(), true)
    }
    myCharts.resize()
    allCharts.push(myCharts)
   },
   setpieoptions() {
    var arr = this.chartsList || []
    arr = arr.map(function(item, index, arr) {
     const i = arr.find(_item => item.alarmType === _item.alarmType)
     if (i !== item) {
      i.num += item.num
      return undefined
     } else {
      i.num = item.num
      return i
     }
    }).filter(item => item !== undefined)
    var nameList = []
    arr.forEach((item) => {
     item.value = item.num
     item.name = item.alarmType
     nameList.push(item.alarmType)
    })
    var options = {
     color: ['#7159e8', '#6674d1', '#c5e2f1', '#7bb8df', '#313964', '#007ace', '#03679c', '#03457d',
      '#202e78'
     ],
     tooltip: {
      trigger: 'item',
      textStyle: {
       color: '#82ECFD',
       fontFamily: 'DIN Medium',
       fontSize: (16 / 20) * 16
      },
      borderWidth: 1,
      borderColor: '#0b6189',
      backgroundColor: '#0b3a5e',
      formatter: function(params) {
       return params.name + '</br>' + params.value + '&nbsp;&nbsp;&nbsp;' + params.percent +
        '%'
      }
     },
     legend: {
      orient: 'vertical',
      top: '10',
      right: '35',
      itemHeight: 9,
      itemWidth: 18,
      icon: 'orient',
      symbolKeepAspect: false,
      textStyle: {
       color: '#4d91b0',
       fontWeight: '400',
       fontFamily: 'Microsoft YaHei',
       fontSize: (16 / 20) * 16
      },
      data: nameList
     },
     series: [{
      type: 'pie',
      // roseType:'area',
      radius: ['60%', '85%'],
      center: ['28%', '50%'], // 图的位置，距离左跟上的位置
      avoidLabelOverlap: false,
      label: {
       normal: {
        show: false,
        position: 'center'
       },
       emphasis: {
        show: false,
        textStyle: {
         fontSize: '30',
         fontWeight: 'bold'
        }
       }
      },
      labelLine: {
       normal: {
        show: false
       }
      },
      data: arr
     }]
    }
    return options
   },
   setbaroption(xdata, ydata) {
    var options = {
     tooltip: {
      trigger: 'axis',
      textStyle: {
       color: '#82ECFD',
       fontFamily: 'DIN Medium',
       fontSize: (16 / 20) * 16
      },
      borderWidth: 1,
      borderColor: '#0b6189',
      backgroundColor: '#0b3a5e',
      formatter: function(params) {
       return params[0].value + '</br>' + params[0].name
      },
      position: function(point, params, dom, rect, size) {
       // 固定在顶部
       return [point[0], '10%']
      },
      axisPointer: {
       type: 'shadow'
      }
     },
     grid: {
      left: '20',
      top: '20',
      right: '20',
      bottom: '40',
      containLabel: false
     },
     legend: {
      show: false,
      right: 0,
      top: 0,
      // icon: 'rect',
      itemheight: 6,
      itemWidth: 20,
      textStyle: {
       color: '#4d91b0'
      }
     },
     xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: xdata,
      axisLabel: {
       formatter: function(params) {
        var arr = params.split('-')
        var moth = arr[0] + arr[1]
        return moth
       },
       textStyle: {
        color: '#4D91B0',
        fontSize: (14 / 20) * 14
       }
      },
      axisLine: {
       show: false,
       lineStyle: {
        color: '#164254'
       }
      },
      axisTick: {
       show: false
      },
      splitLine: {
       show: false
      }
     },
     yAxis: {
      type: 'value',
      axisLine: {
       lineStyle: {
        color: '#4D91B0'
       }
      },
      axisTick: false,
      splitLine: {
       lineStyle: {
        color: '#4D91B0'
       }
      }
     },
     series: [{
      name: '本期',
      type: 'bar',
      // barWidth: '18',
      itemStyle: {
       color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
        offset: 1,
        color: 'rgba(26,139,183,1)'
       }, {
        offset: 0.8,
        color: 'rgba(26,139,183,0.8)'
       }, {
        offset: 0.5,
        color: 'rgba(26,139,183,0.5)'
       }])
      },
      data: ydata
     }]
    }
    return options
   },
   setoption(xdata, ydata) {
    var options = {
     tooltip: {
      trigger: 'axis',
      textStyle: {
       color: '#82ECFD',
       fontFamily: 'DIN Medium',
       fontSize: (16 / 20) * 16
      },
      borderWidth: 1,
      borderColor: '#0b6189',
      backgroundColor: '#0b3a5e',
      formatter: function(params) {
       var arr = params[0].name.split(' ')
       var list = arr[0].split('-')
       return params[0].value + '</br>' + list[0] + '年' + list[1] + '月'
      }
     },
     grid: {
      left: '30',
      top: '10',
      right: '30',
      bottom: '40',
      containLabel: false
     },
     xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xdata,
      axisLabel: {
       textStyle: {
        color: '#4D91B0',
        fontSize: (14 / 20) * 14
       },
       formatter: function(params) {
        if (params) {
         var arr = params.split(' ')
         var list = arr[0].split('-')
         return list[0] + list[1]
        }
        return params
       }
      },
      axisLine: {
       lineStyle: {
        color: '#164254'
       }
      },
      axisTick: {
       show: false
      },
      splitLine: {
       show: false
      }
     },
     yAxis: {
      show: false,
      type: 'value'
     },
     series: [{
      data: ydata,
      type: 'line',
      smooth: '1',
      symbol: 'none',
      itemStyle: {
       normal: {
        color: '#72d2e4',
        lineStyle: {
         color: '#72d2e4',
         width: 1
        },
        areaStyle: {
         color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: 'rgba(98, 183,200, 0.3)'
         }, {
          offset: 0.5,
          color: 'rgba(98, 183,200, 0.5)'
         }, {
          offset: 0.8,
          color: 'rgba(98, 183,200, 0.8)'
         }, {
          offset: 1,
          color: 'rgba(98, 183,200, 1)'
         }])
        }
       }
      }
     }]

    }
    return options
   },
   closedetails() {
    this.dialogVisible = false
    this.currnumber = 0
    this.seachInfo = {
     alarmStatus: '',
     deviceBuild: [],
     deviceName: '',
     startDate: '',
     endDate: '',
     alarmClass: '',
     alarmNode: ''
    }
    this.curr = 'list'
   },
   formatDate(value, fmt) {
    if (!value) {
     return '--'
    }
    let getDate = new Date(value)
    let o = {
     'M+': getDate.getMonth() + 1,
     'd+': getDate.getDate(),
     'h+': getDate.getHours(),
     'm+': getDate.getMinutes(),
     's+': getDate.getSeconds(),
     'q+': Math.floor((getDate.getMonth() + 3) / 3),
     'S': getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
     fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
     if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[
       k]).length)))
     }
    }
    return fmt
   }
  },
  beforeDestroy() {
   this.bus.$off('changeList')
  }
 }
</script>

<style lang="scss">
 .alarmList-mian {
  .el-cascader__label {
   font-size: 0.9rem;
  }

  #chartsbox {
   margin-top: 3rem;
   height: 15rem;
   width: 100%;
  }

  .activechar {
   background: #004e81 !important;
   color: #ffffff !important;
  }

  .title-box {
   font-size: 0.9rem;
   position: relative;
  }

  .title-box span {
   padding-left: 1.5rem;
  }

  .atrend-title {
   position: absolute;
   top: -2rem;
   right: 0rem;
   cursor: pointer;
   display: table;
   word-spacing: -1em;
  }

  .atrem-boderr {
   border-top-right-radius: 11px;
   border-bottom-right-radius: 11px;
  }

  .atrem-boderf {
   border-top-left-radius: 11px;
   border-bottom-left-radius: 11px;
  }

  .atrend-title a {
   background: #001423;
   padding: 0rem 0.5rem;
   font-size: 0.7rem;
   border: 1px solid #194a5d;
   font-family: 'Microsoft YaHei Regular, Microsoft YaHei Regular-Regular';
   font-weight: 400;
   color: #74c1e5;
   letter-spacing: 0.05rem;
  }

  .Z-QueryList {
   display: flex;
   justify-content: flex-start;
   flex-wrap: wrap;
  }

  .Z-QueryList li {
   display: inline-block;
   white-space: nowrap;
   margin-bottom: 10px;
   flex-basis: 318px;
  }

  .Z-QueryList .lable {
   width: 60px;
   text-align: right;
  }

  .alarm-list {
   height: auto;
  }

  .red {
   color: #d1aa14 !important;
  }

  .v-table {
   margin-top: 1rem;
  }

  .QueryParameters {
   padding-left: 0px;
   margin-top: 0px;

   .el-cascader {
    display: inline-block;
    position: relative;
    font-size: 0.9rem;
    line-height: 1.4rem;
    height: 1.4rem;
   }

   .el-input__icon {
    line-height: 1.4rem;
    width: 1.25rem;
   }

   .el-input {
    width: 14rem;
    height: 1.4rem;
   }

   .el-input .el-input__inner {
    width: 14rem;

   }

  }

  .Z-QueryList select {
   width: 10.5rem;
  }

  .mag-top {
   margin-top: 0.5rem;
  }

  .alarm-from-ul {
   margin-top: 1rem;
   margin-left: 1rem;
  }

  .alarm-type span {
   min-width: 3.75rem;
   height: 1.2rem;
   padding: 0.2rem 0.5rem;
   line-height: 1.2rem;
   color: #6dc0e6;
   text-align: center;
   font-size: 0.7rem;
   font-family: 'Microsoft YaHei Regular';
   font-weight: 400;
   border: 1px solid #0478b7;
   background: rgba(4, 120, 183, 0.5);
   border-radius: 2px;
   margin: 0 0.25rem;
   display: inline-block;
   cursor: pointer;
   margin-top: 0.5rem;
  }

  .active {
   color: #01f0f2 !important;
   border: 1px solid #01e6eb !important;
  }

  .listOrChart {
   position: absolute;
   top: 0.6rem;
   right: 2rem;
   z-index: 999;

  }

  .listOrChart img {
   display: inline-block;
   height: 20px;
   width: 26px;
   margin-right: 0.5rem;
   cursor: pointer;
  }
 }
</style>
