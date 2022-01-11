<!--折线图-->
var textStyleC = {
  color: "#31859C",
  fontSize: Math.floor(0.7 * fontSize) > 10 ? Math.floor(0.7 * fontSize) : 10
} //刻度线标签字颜色,
var tooltipTextStyle = {
  fontSize: Math.floor(0.6 * fontSize) > 9 ? Math.floor(0.6 * fontSize) : 9
}
var splitLineC = {
  show: true,
  lineStyle: {
    color: "rgba(111,191,203,0.1)"
  }
} //网格颜色
var axisLineC = {
  lineStyle: {
    color: '#6FBFCB',
  }
} //Y轴的颜色
var axisTickC = {
  show: false
}

// JavaScript Document
function LineChart(aJson) {
  aJson.y = aJson.y || 8;
  aJson.title = aJson.title || ""
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    tooltip: {
      trigger: 'axis',
      textStyle: tooltipTextStyle
    },
    color: [aJson.color[1], aJson.color[0]], //线的颜色
    grid: {
      x: 28,
      x2: 10,
      y: aJson.y,
      y2: 36,
      borderWidth: 0
    },
    calculable: true,
    legend: { //图例组件
      show: aJson.leg,
      selectedMode: false,
      icon: 'rect',
      right: 0, //图例组件离右边的距离
      top: 0,
      itemWidth: 4, //图例标记的图形宽度
      itemHeight: fontSize * 0.8, //图例标记的图形高度
      itemGap: 10,
      data: [aJson.name[0], aJson.name[1]],
      textStyle: { //图例文字的样式
        color: '#a5aaaf',
        fontSize: fontSize * 0.7
      }
    },

    xAxis: [{
      type: 'category',
      gridIndex: 0,
      axisLabel: {
        interval: 1,
        rotate: 50,
        textStyle: textStyleC,
        formatter: function(value) {
          if (aJson.title == "24小时") {
            return value.substring(0, value.length - 1);
          } else {
            return value.substring(0, value.length);
          }

        }
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC,
      data: aJson.oxAxis,
    }],
    yAxis: [{
      name: aJson.Yname,
      nameGap: 10,
      type: 'value',
      min: 0,
      minInterval: 1,
      max: function(value) {
        return value.max + 20;
      },
      nameTextStyle: {
        color: "#8184a5",
        fontSize: fontSize * 0.7,
      },
      splitNumber: aJson.splitNumber || 5,
      axisLabel: {
        show: true,
        interval: aJson.interval,
        textStyle: textStyleC
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
        name: aJson.name[1],
        type: 'line',
        data: aJson.data2,
        smooth: true,
        symbol: "none",
        itemStyle: {
          normal: {
            lineStyle: {
              color: aJson.color[1],
              width: '3' //折线的宽度
            }
          }
        },

      },
      {
        name: aJson.name[0],
        type: 'bar',
        barGap: '0.5px',
        data: aJson.data1,
        barMaxWidth: 8,
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: { //图形样式
          normal: {
            barBorderRadius: [50, 50, 0, 0],
            color: aJson.color[0],
          },
        }
      }
    ]
  };

  return option;
}
<!--折线图完-->

function LineChartN(aJson) {
  aJson.interval = aJson.interval || 0;
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    grid: {
      x: 0,
      x2: 0,
      y: 10,
      y2: 0,
      containLabel: true,
      borderWidth: 0
    },
    calculable: true,
    tooltip: {
      trigger: 'axis',
      textStyle: tooltipTextStyle
      //formatter: function(params){
      //	console.log(params)
      //	return params[1].value+'/n'+params[0].value
      //	},
    },
    color: aJson.color,
    legend: { //图例组件
      show: false,
      icon: 'rect',
      left: 10, //图例组件离右边的距离
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 16, //图例标记的图形高度
      itemGap: 30,
      data: aJson.name,
      textStyle: { //图例文字的样式
        color: '#a5aaaf',
        fontSize: fontSize * 0.9
      }
    },
    xAxis: [{
      type: 'category',
      gridIndex: 0,
      axisLabel: {
        interval: aJson.interval,
        rotate: 60,
        textStyle: textStyleC,
        formatter: function(value) {
          return value.substring(0, value.length - 1);
        }
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC,
      data: aJson.oxAxis,
    }],
    yAxis: [{
      name: aJson.Yname,
      nameGap: 10,
      type: 'value',
      min: aJson.oMin,
      minInterval: 1,
      splitNumber: aJson.splitNumber || 5,
      max: function(value) {
        return value.max + 20;
      },
      nameTextStyle: {
        color: "#8184a5",
        fontSize: fontSize * 0.7,
      },
      axisLabel: {
        show: true,
        interval: aJson.interval,
        textStyle: textStyleC
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
        name: aJson.name[0],
        type: 'line',
        data: aJson.BJdata1,
        symbol: 'none',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: aJson.color[0],
              width: '1' //折线的宽度
            }
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(255, 87, 69, 1)' // 0% 处的颜色
            }, {
              offset: 0.5,
              color: 'rgba(255, 87, 69, 0.8)' // 0% 处的颜色
            }, {
              offset: 0.8,
              color: 'rgba(255, 87, 69, 0.5)' // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(255, 87, 69, 0.2)' // 0% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
      },
      {
        name: aJson.name[1],
        type: 'line',
        data: aJson.BJdata2,
        symbol: 'none',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: aJson.color[1],
              width: '1' //折线的宽度
            }
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#A92035' // 0% 处的颜色
            }, {
              offset: 0.2,
              color: 'rgba(182, 59, 46,0.7)' // 100% 处的颜色rgba(182, 59, 46, 1)
            }, {
              offset: 0.8,
              color: 'rgba(182, 59, 46,0.6)' // 100% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(255,255,255,0.01)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
      },
    ]
  };

  return option;
}
/*琴键柱状图*/
function barBothway(barJson) {
  //var category = [];
  //var dottedBase = +new Date();
  //alert(dottedBase)
  //var lineData = [];
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    grid: {
      left: 10,
      right: 10,
      bottom: 5,
      top: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true,
          backgroundColor: '#333'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: barJson.oxAxis,
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#0498a5',
        }
      },
    },
    yAxis: [{
      type: 'value',
      minInterval: 1,
      splitLine: {
        show: false,

      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#0498a5',
        }
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false
      }

    }],
    series: [{
      name: barJson.name[0],
      type: 'bar',
      stack: '总量',
      barMaxWidth: 6,
      itemStyle: {
        normal: {
          barBorderRadius: [50, 50, 0, 0],
          color: '#c96bd6',
        }
      },
      data: barJson.data1
    }, {
      name: barJson.name[1],
      type: 'bar',
      stack: '总量',
      barMaxWidth: 6,
      itemStyle: {
        normal: {
          barBorderRadius: [0, 0, 50, 50],
          color: '#1D8CBB',
        }
      },
      data: barJson.data2
    }]
  };
  return option;
}
<!--圆环图-->
function Pie(pieDatas, pieJson) {
  if (pieJson.lege == "false") {
    pieJson.lege = false;
  } else {
    pieJson.lege = true;
  }
  if (pieJson.emphasis == "false") {
    pieJson.emphasis = false;
  } else {
    pieJson.emphasis = true;
  }
  if (pieJson.hoverAnimation == "false") {
    pieJson.hoverAnimation = false;
  } else {
    pieJson.hoverAnimation = true;
  }
  let showlable = false;
  if (pieJson.label && pieJson.label.show) {
    showlable = pieJson.label.show;
  }
  let showposition = 'center';
  if (pieJson.label && pieJson.label.position) {
    showposition = pieJson.label.position;
  }
  pieJson.title = pieJson.title || false;
  option = {
    title: {
      show: pieJson.title,
      text: pieJson.text,
      textStyle: pieJson.textStyle,
      textAlign: 'center',
      x: '45%',
      y: '80%',
    },
    tooltip: {
      show: true,
      confine: true,
      formatter: "{b} : {c}"
    },
    color: pieJson.color,
    legend: {
      show: pieJson.lege,
      orient: 'vertical',
      right: 0,
      top: pieJson.top,
      itemWidth: 6,
      itemHeight: 16,
      itemGap: pieJson.itemGap,
      textStyle: {
        color: '#75CBF2',
        fontSize: pieJson.fontSize / 20 * fontSize,
      },
      formatter: function(name) {
        var total = 0;
        var target;
        for (var i = 0, l = pieDatas.length; i < l; i++) {
          total += pieDatas[i].value;
          if (pieDatas[i].name == name) {
            target = pieDatas[i].value;
          }
        }

        if (total == 0) {
          return name + ' 0%';
        } else {
          return name + ' ' + ((target / total) * 100).toFixed(1) + '%';
        }

      }
    },
    series: [{
      name: '',
      type: 'pie',
      radius: pieJson.radius,
      center: pieJson.center,
      avoidLabelOverlap: false,
      hoverAnimation: pieJson.hoverAnimation,
      hoverOffset: 5,
      label: {
        normal: {
          show: showlable,
          position: showposition,
          formatter: "{d} %",
        },
        emphasis: {
          show: pieJson.emphasis,
          textStyle: {
            fontSize: fontSize,
            color: '#fff',
          },
          formatter: ['{b}', '{c}'].join('\n'),
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: pieDatas
    }]
  };

  return option;

}

<!--圆环图-->
function bar(json) {
  var option = {
    color: json.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: textStyleC
    },
    grid: {
      top: 5,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: json.oxAxis,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#6FBFCB',
        }
      },
      axisLabel: Object.assign(textStyleC, {
        interval: 0,
        rotate: 60,
      })
    }],
    yAxis: [{
      type: 'value',
      minInterval: 1,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    }],
    series: [{
      name: json.name,
      type: 'bar',
      // barWidth: '60%',
      barMaxWidth: 10,
      data: json.data
    }]
  };
  return option
}
<!--圆环图-->
function bar2(json) {
  json.barWidth = json.barWidth || 8
  if (json.leg == "false") {
    json.leg = false;
  } else {
    json.leg = true;
  }
  var option = {
    color: json.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: tooltipTextStyle
    },

    legend: {
      show: true,
      //orient: 'vertical',
      right: 0,
      top: 0,
      itemWidth: 0.4 * fontSize,
      itemHeight: 0.7 * fontSize,
      itemGap: 6,
      textStyle: {
        color: '#75CBF2',
        fontSize: fontSize * 0.7,
      },
      data: ['本校', '全国']
    },
    grid: {
      top: 35,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: json.oxAxis,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#6FBFCB',
        }
      },
      axisLabel: Object.assign(textStyleC, {
        interval: 0,
        rotate: 60,
      })
    }],
    yAxis: [{
      type: 'value',
      minInterval: 1,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    }],
    series: [{
        name: json.name[0],
        type: 'bar',
        barMaxWidth: 8,
        data: json.data1,
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          }
        }
      },
      {
        name: json.name[1],
        type: 'bar',
        barMaxWidth: 8,
        data: json.data2,
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          }
        }
      },

    ]
  };
  return option
}
<!--饼图-->
function Pie2H(pieDatas, pieJson) {
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br/>{c} ({d}%)",
      textStyle: tooltipTextStyle
    },
    legend: { //图例组件
      show: true,
      selectedMode: false,
      type: 'scroll',
      orient: 'vertical',
      icon: 'rect',
      top: 15,
      right: 0, //图例组件离右边的距离
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 12, //图例标记的图形高度
      itemGap: 5,
      data: pieJson.name,
      pageIconSize: 0.7 * fontSize,
      pageIconColor: '#75CBF2',
      pageTextStyle: {
        color: '#75CBF2',
        fontSize: 0.6 * fontSize
      },
      textStyle: { //图例文字的样式
        color: '#00FFFF',
        fontSize: fontSize * 0.7,
      },
      formatter: function(name) {
        var total = 0;
        var target;
        for (var i = 0, l = pieDatas.length; i < l; i++) {
          total += pieDatas[i].value;
          if (pieDatas[i].name == name) {
            target = pieDatas[i].value;
          }
        }
        if (total == 0) {
          return name + '    --%';
        } else {
          return name + '    ' + ((target / total) * 100).toFixed(0) + '%';
        }

      }
    },
    series: [{
      name: pieJson.name,
      type: 'pie',
      radius: pieJson.radius,
      center: pieJson.center,
      data: pieDatas,
      roseType: 'angle',
      color: pieJson.color,
      label: {
        normal: {
          show: false
        }
      }
    }]
  };
  return option;

}
/*圆柱形柱状图*/
function OldUpArry(barJson) {
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    grid: {
      left: 10,
      right: 10,
      bottom: 5,
      top: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}<br />{c0}人次',
      axisPointer: {
        type: 'shadow',

        label: {
          show: true,
          backgroundColor: '#333'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: barJson.dataX,
      axisTick: false,
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        rotate: 50,
        textStyle: textStyleC
      },
      axisLine: axisLineC,
    },
    yAxis: [{
      type: 'value',
      minInterval: 1,
      splitNumber: barJson.splitNumber || 5,
      splitLine: {
        show: false,
      },
      axisLine: axisLineC,
      axisLabel: {
        show: true,
        textStyle: textStyleC,
        formatter: function(e) {
          return Math.abs(e);
        }
      },
      axisTick: {
        show: false,
      }

    }],
    series: [{
      name: '用餐',
      type: 'bar',
      stack: '总量',
      barMaxWidth: 8,
      itemStyle: {
        normal: {
          barBorderRadius: [50, 50, 0, 0],
          color: '#6ACAE6',
        }
      },
      data: barJson.barData1
    }]
  };
  return option;

}
//Customized --Pie
function CustomizedPie(pieDatas, pieJson) {
  option = {
    title: {
      text: pieJson.title,
      show: pieJson.titleshow,
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c}"
    },

    series: [{
      name: '就餐分析',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: pieDatas.sort(function(a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
        position: 'outside',
        normal: {
          //borderColor: 'rgba(25,94,127,1)',
          ///borderWidth: 1,
          textStyle: {
            fontSize: pieJson.labelfontSize / 20 * fontSize,
            color: pieJson.labelcolor,
          },
          //formatter:function(params){
          //return '{b|'+params.name+'<b/>'+(params.percent).toFixed(1)+'%}';
          //},
          formatter: '{b|{b}\n{d}%}',
          rich: {
            b: {
              color: 'rgba(117,203,242,1)',
              lineHeight: 18,
              fontSize: 14,
              align: 'center',
              padding: [2, 2],
            }
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: pieJson.labelLine,
          },
          smooth: false,
          length: 2,
          length2: 5
        },

      },
      itemStyle: {
        normal: {
          color: '#AE302C',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function(idx) {
        return Math.random() * 200;
      }
    }]
  };
  return option;
}
/*琴状图 --重写*/
function starrenbar(barJson) {
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    grid: {
      left: 0,
      right: 10,
      bottom: 5,
      top: 10,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return params[0].name + '<br />' + params[0].seriesName + '：' + params[0].value + '人次<br />' + params[1].seriesName + '：' + Math.abs(params[1].value) + '人次';
      },
      textStyle: tooltipTextStyle,
      axisPointer: {
        type: 'shadow',
        label: {
          show: false,
          backgroundColor: '#333'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: barJson.oxAxis,
      axisTick: {
        alignWithLabel: true
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: axisLineC,
    },
    yAxis: [{
      type: 'value',
      minInterval: 1,
      splitLine: {
        show: false,
      },
      splitNumber: barJson.splitNumber || 5,
      axisLine: axisLineC,
      axisLabel: {
        show: true,
        textStyle: textStyleC,
        formatter: function(e) {
          return Math.abs(e);
        }
      },
      axisTick: {
        show: false,
      }

    }],
    series: [{
      name: '晚归',
      type: 'bar',
      stack: '总量',
      barMaxWidth: 10,
      itemStyle: {
        normal: {
          barBorderRadius: [50, 50, 0, 0],
          color: '#2ED167',
        }
      },
      data: barJson.data1
    }, {
      name: '晚出',
      type: 'bar',
      stack: '总量',
      barMaxWidth: 10,
      itemStyle: {
        normal: {
          barBorderRadius: [0, 0, 50, 50],
          color: '#207096',
        }
      },
      data: barJson.data2
    }]
  };
  return option;
}

function LineChartV(aJson) {
  aJson.interval = aJson.interval || 0;
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      x: 5,
      x2: 5,
      y: 5,
      y2: 0,
	  containLabel:true
    },

    calculable: true,
    color: aJson.color,
    legend: { //图例组件
      show: false,
      icon: 'rect',
      left: 10, //图例组件离右边的距离
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 16, //图例标记的图形高度
      itemGap: 30,
      data: aJson.name,
      textStyle: { //图例文字的样式
        color: '#a5aaaf',
        fontSize: fontSize * 0.9
      }
    },
    xAxis: [{
      type: 'category',
      gridIndex: 0,
      axisLabel: {
        interval: 1,
        rotate: 50,
        textStyle: textStyleC
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC,
      data: aJson.oxAxis,
    }],
    yAxis: [{
      name: aJson.Yname,
      nameGap: 10,
      type: 'value',
      min: aJson.oMin,
      minInterval: 1,
      max: function(value) {
        return value.max + 20;
      },
      nameTextStyle: {
        color: "#8184a5",
        fontSize: fontSize * 0.7,
      },
      splitLine: splitLineC,
      axisLabel: {
        show: true,
        interval: aJson.interval,
        textStyle: textStyleC,
      },
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
      name: aJson.name,
      type: 'line',
      data: aJson.data1,
      smooth: true,
      symbol: 'none',
      itemStyle: {
        normal: {
          lineStyle: {
            color: aJson.color[0],
            width: '3' //折线的宽度
          }
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1, [{
                offset: 0,
                color: aJson.color[1]
              },
              {
                offset: 1,
                color: aJson.color[2]
              }
            ]
          )
        }
      },
    }, ]
  };

  return option;
}
//圆环图 带视觉引导线
function Ringdiagram(Jsondata, SetupJsondata) {
  var scale = fontSize / 20;
  var rich = {
    line: {
      color: SetupJsondata.fontcolor, //字体颜色
      align: 'center',
      fontSize: SetupJsondata.fontSize * scale, //字体大小
      padding: [0, 0]
    },
    hr: {
      borderColor: SetupJsondata.linecolor, //下划线颜色
      width: '100%',
      borderWidth: 1,
      height: 0,
      align: 'right',
      verticalAlign: 'bottom'
    }
  }
  option = {
    tooltip: {
      show: true,
      //formatter: "{b} : {c}"
      formatter: function(params) {
        if (SetupJsondata.title == '消费占比') {
          return params.name + ' : ' + params.value + '元'
        } else {
          return params.name + ' : ' + params.value
        }
      },
      textStyle: tooltipTextStyle
    },
    series: [{
      name: '消费占比',
      type: 'pie',
      //minAngle: 15,//最小角度
      startAngle: 150, //起始角度
      radius: SetupJsondata.radius, //圆环大小
      hoverAnimation: true,
      color: SetupJsondata.color, //圆环颜色
      label: {
        normal: {
          padding: [0, -5],
          formatter: function(params) { //格式化数据
            if (SetupJsondata.title == "不同性别消费倾向") {
              return '{line|' + (params.percent).toFixed(1) + '%}\n{hr|}\n';
            } else {
              return '{line|' + params.name + ' ' + params.percent + '%}{hr|}\n';
            }

          },
          rich: rich //设置文字与下滑线
        },
      },
      labelLine: {
        normal: {
          length: 15 * scale,
          length2: 5,
          lineStyle: {
            color: SetupJsondata.linecolor //视觉引导线颜色
          }
        }
      },
      data: Jsondata //数据
    }]
  };
  return option;
}
<!--表盘图-->
function gaugeChart(value) {
  var option = {
    tooltip: {
      show: false,
    },

    series: [{
      name: '业务指标',
      type: 'gauge',
      axisLine: { //设置表盘颜色和表盘线大小
        "lineStyle": {
          color: [
            [0.85, '#871528'],
            [0.95, '#c17c2b'],
            [1, '#3e624d']
          ],

          "width": 12,
        },
        show: true,
      },
      axisTick: { //设置大刻度颜色
        lineStyle: {
          "color": '#fff',
          width: 1,
          type: 'solid',
          opacity: '0.5',

        },
        length: '5%',
        splitNumber: 4,

      },
      splitLine: { // 分隔线
        length: 14, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          width: 1,
          color: '#fff',

        }
      },
      axisLabel: { //表盘刻度文字
        show: true,
        textStyle: {
          color: '#fff',
          fontSize: fontSize * 0.6,
        },
        formatter: function(value) {
          switch (value + "") {
            case "0":
              return "0";
            case "50":
              return "50";
            case "100":
              return "100";
          }
        }
      },
      detail: {
        show: false,
        formatter: '{value}%'
      },
      data: [{
        value: value,
        name: ''
      }]
    }]
  };
  return option;
}

function bar3(json, oMax) {
  json.barWidth = Math.floor((json.barWidth || 8) / 20 * fontSize);
  if (json.leg == "false") {
    json.leg = false;
  } else {
    json.leg = true;
  }
  var option = {
    color: json.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      show: json.lege,
      //orient: 'vertical',
      right: 0,
      top: -5,
      itemWidth: 4,
      itemHeight: 14,
      itemGap: 6,
      textStyle: {
        color: '#999',
        fontSize: fontSize * 0.7,
      },
    },
    grid: {
      left: 10,
      right: 5,
      bottom: 0,
      top: 5,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: json.oxAxis,
      axisTick: axisTickC,
      axisLine: axisLineC,
      axisLabel: Object.assign({
        interval: 0,
        rotate: 55
      }, textStyleC)
    }],
    yAxis: [{
      type: 'value',
      minInterval: 1,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    }],
    series: [{
      name: json.name,
      type: 'bar',
      barMaxWidth:json.barWidth,
      data: json.data1,
      itemStyle: {
        normal: {
          color: function(params) {
            var index_num = params.value;
            if (index_num == oMax) {
              return '#CE356D'
            } else {
              return '#135E81'
            }

          },

        }

      }
    }, ]
  };
  return option
}
/*堆叠柱状图*/
function StackedBar(json) {
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 1000,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: tooltipTextStyle,
      confine: true
    },
    color: json.color,
    legend: {
      data: json.legend,
      left: 0,
      itemWidth: 4,
      itemHeight: fontSize * 0.7,
      itemGap: 4,
      textStyle: {
        color: '#75CBF2',
        fontSize: fontSize * 0.7,
      },
    },
    grid: {
      top: 4 * fontSize,
      left: '1%',
      right: '2%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLabel: {
        rotate: 50,
        textStyle: textStyleC
      },
      axisLine: axisLineC,
      axisTick: axisTickC,
      data: json.oxAxis
    }],
    yAxis: [{
      type: 'value',
      name: "人次",
      minInterval: 1,
      splitNumber: json.splitNumber || 5,
      nameTextStyle: textStyleC,
      axisLabel: {
        show: true,
        textStyle: textStyleC
      },
      splitLine: {
        show: false
      },
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
        name: json.legend[0],
        type: 'bar',
        stack: '消费',
        data: json.oData1
      },
      {
        name: json.legend[1],
        type: 'bar',
        stack: '消费',
        data: json.oData2
      },
      {
        name: json.legend[2],
        type: 'bar',
        stack: '消费',
        data: json.oData3
      }
    ]
  };
  return option
}

function bar4(json) {
  json.emcolor = json.emcolor || ['#32C872', '#0478B7']
  if (json.leg == "false") {
    json.leg = false;
  } else {
    json.leg = true;
  }
  var option = {
    color: json.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: tooltipTextStyle
    },

    legend: {
      show: json.leg,
      //orient: 'vertical',
      right: 0,
      top: 0,
      itemWidth: fontSize * 0.4,
      itemHeight: fontSize * 0.8,
      itemGap: 6,
      textStyle: {
        color: '#75CBF2',
        fontSize: fontSize * 0.7,
      },
      data: ['本年', '上年']
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 30,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: json.oxAxis,
      axisLabel: {
        rotate: 60,
        textStyle: textStyleC,

      },
      axisLine: axisLineC,
      axisTick: axisTickC,
    }],
    yAxis: [{
      type: 'value',
      minInterval: 1,
      name: json.title,
      nameTextStyle: {
        color: "#31859C",
        fontSize: fontSize * 0.7,
        padding: [0, 0, 0, 15]
      },
      axisLabel: {
        show: true,
        textStyle: textStyleC
      },
      splitLine: {
        show: false,
      },
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
        name: json.name[0],
        type: 'bar',
        barMaxWidth: 8,
        data: json.data1,
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          }
        },
        emphasis: {
          itemStyle: {
            color: json.emcolor[0]
          }
        }
      },
      {
        name: json.name[1],
        type: 'bar',
        barMaxWidth: 8,
        data: json.data2,
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          }
        },
        emphasis: {
          itemStyle: {
            color: json.emcolor[1]
          }
        }
      },

    ]
  };
  return option
}

function barline(json) {
  if (json.leg == "false") {
    json.leg = false;
  } else {
    json.leg = true;
  }
  option = {
    color: json.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: tooltipTextStyle
    },
    legend: {
      show: true,
      //orient: 'vertical',
      right: 0,
      top: 10,
      itemWidth: fontSize * 0.4,
      itemHeight: fontSize * 0.8,
      itemGap: 6,
      textStyle: {
        color: '#75CBF2',
        fontSize: fontSize * 0.7,
      },
      data: ['同期', '本期']
    },
    grid: {
      left: 10,
      right: 0,
      bottom: 0,
      top: 10,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: json.oxAxis,
      axisLabel: {
        rotate: 60,
        textStyle: textStyleC,

      },
      axisLine: axisLineC,
      axisTick: axisTickC,
    }],
    yAxis: [{
        minInterval: 1,
        name: json.title,
        nameTextStyle: {
          color: "#31859C",
          fontSize: fontSize * 0.7,
          padding: [0, 0, 0, 15]
        },
        axisLabel: {
          show: true,
          textStyle: textStyleC
        },
        splitLine: {
          show: false,
        },
        axisLine: axisLineC,
        axisTick: axisTickC
      },
      {
        type: 'value',
        show: false,
        name: json.title,
        nameTextStyle: {
          color: "#31859C",
          fontSize: fontSize * 0.7,
        },
        axisLabel: {
          show: true,
          textStyle: textStyleC
        },
        splitLine: {
          show: false,
        },
        axisLine: axisLineC,
        axisTick: axisTickC
      }
    ],
    series: [{
        name: json.name[0],
        barMaxWidth: 8,
        type: 'bar',
        itemStyle: {
          normal: {
            barBorderRadius: [50, 50, 0, 0],
          }
        },
        data: json.data1
      },
      {
        name: json.name[1],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        smooth: true,
        data: json.data2
      }
    ]
  };
  return option
}

function Pie2T(pieDatas, pieJson) {
  pieJson.lege = pieJson.lege || false;
  pieJson.tValue = pieJson.tValue || true;
  pieJson.target = pieJson.target || true;
  pieJson.top = pieJson.top || 30;
  pieJson.left = pieJson.left || 200;
  pieJson.itemGap = pieJson.itemGap || 9;
  pieJson.fontSize = pieJson.fontSize || 18;
  pieJson.fontSize2 = pieJson.fontSize2 || 16;
  if (pieJson.label == 'false') {
    pieJson.label = false;
  } else {
    pieJson.label = true;
  }
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br/>{c} ({d}%)"
    },
    legend: { //图例组件
      show: pieJson.lege,
      selectedMode: false,
      orient: 'vertical',
      icon: 'rect',
      top: pieJson.top,
      left: pieJson.left, //图例组件离右边的距离
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 16, //图例标记的图形高度
      itemGap: pieJson.itemGap,
      data: pieJson.name,
      textStyle: { //图例文字的样式
        color: '#75CBF2',
        fontSize: pieJson.fontSize,
      },
      formatter: function(name) {
        var total = 0;
        var target;
        for (var i = 0, l = pieDatas.length; i < l; i++) {
          total += pieDatas[i].value;
          if (pieDatas[i].name == name) {
            target = pieDatas[i].value;
          }
        }
        if (pieJson.target == true) {
          return name + '    ' + toDub(target) + '    ' + ((target / total) * 100).toFixed(0) + '%';
        } else {
          return name + '    ' + ((target / total) * 100).toFixed(1) + '%';
        }
      }
    },
    series: [{
      name: pieJson.name,
      type: 'pie',
      radius: pieJson.radius,
      center: pieJson.center,
      data: pieDatas,
      roseType: 'angle',
      color: pieJson.color,
      label: {
        normal: {
          position: 'outside',
          formatter: function(params) {
            var percent = 0;
            var total = 0;
            for (var i = 0; i < pieDatas.length; i++) {
              total += pieDatas[i].value;
            }
            percent = ((params.value / total) * 100).toFixed(0);
            if (pieJson.tValue == true) {
              return '{a|' + percent + '%}\n{b|' + params.name + '}'
            } else if (pieJson.tValue == 'false') {
              return '{b|' + params.name + '}'
            }
          },
          show: pieJson.label,
          textStyle: {
            fontWeight: 'normal',
            color: '#75CBF2',
          },
          rich: {
            a: {
              fontSize: fontSize * 1.2,
              color: '#75CBF2',
              fontFamily: 'Helvetica-Roman-SemiB',
            },
            b: {
              fontSize: pieJson.fontSize2 / 20 * fontSize,
              color: '#75CBF2',
            }
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: '#75CBF2'
          },
          smooth: 0,
          length: 1,
          length2: 5,
        }
      },
      itemStyle: {
        normal: {
          // color:pieJson.color,
          shadowBlur: 100,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  return option;

}

function Pie2Hline(pieDatas, pieJson) {
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{b}<br/>{c} ({d}%)"
    },
    legend: { //图例组件
      show: true,
      selectedMode: false,
      orient: 'vertical',
      icon: 'rect',
      top: 15,
      right: 0, //图例组件离右边的距离
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 12, //图例标记的图形高度
      itemGap: 5,
      data: pieJson.name,
      textStyle: { //图例文字的样式
        color: '#00FFFF',
        fontSize: fontSize * 0.7,
      },
      formatter: function(name) {
        var total = 0;
        var target;
        for (var i = 0, l = pieDatas.length; i < l; i++) {
          total += pieDatas[i].value;
          if (pieDatas[i].name == name) {
            target = pieDatas[i].value;
          }
        }
        return name + '    ' + ((target / total) * 100).toFixed(0) + '%';
      }
    },
    series: [{
      name: pieJson.name,
      type: 'pie',
      radius: pieJson.radius,
      center: pieJson.center,
      data: pieDatas,
      roseType: 'angle',
      color: pieJson.color,
      label: {
        normal: {
          show: false
        }
      }
    }]
  };
  return option;

}

/*普通饼图*/
function ordinaryPie(oPieDatas, oPieJson) {
  var option = {
    title: {
      text: oPieJson.text,
      right: 15,
      top: '30',
      textStyle: {
        color: "#74d4ff",
        fontSize: fontSize * 0.9,
      }
    },
    tooltip: {
      show: false
    },
    color: oPieJson.color,
    series: [{
      type: 'pie',
      radius: oPieJson.radius,
      center: oPieJson.center,

      labelLine: {
        normal: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          smooth: 0,
          length: 5,
          length2: 5,
        }
      },
      label: {
        color: '#a5aaaf',
        formatter: "{b}{d}%"
      },
      data: oPieDatas,
      itemStyle: { //itemStyle有正常显示：normal，有鼠标hover的高亮显示：emphasis
        emphasis: { //normal显示阴影,与shadow有关的都是阴影的设置
          shadowBlur: 10, //阴影大小
          shadowOffsetX: 0, //阴影水平方向上的偏移
          shadowColor: 'rgba(0, 0, 0, 0.5)' //阴影颜色
        }
      }
    }]
  };
  return option;
}
// 柱状图加折线图 自定义xAxis.interval
function Linebar(aJson) {
  aJson.y = aJson.y || 5;
  aJson.title = aJson.title || ""
  var option = {
    animationEasing: 'SinusoidalIn',
    animationDuration: 10000,
    tooltip: {
      trigger: 'axis',
    },
    color: [aJson.color[1], aJson.color[0]], //线的颜色
    grid: {
      x: 28,
      x2: 10,
      y: aJson.y,
      y2: 36,
      borderWidth: 0
    },
    calculable: true,
    legend: { //图例组件
      show: aJson.leg,
      selectedMode: false,
      icon: 'rect',
      left: 80, //图例组件离右边的距离
      top: 0,
      itemWidth: 6, //图例标记的图形宽度
      itemHeight: 16, //图例标记的图形高度
      itemGap: 30,
      data: [aJson.name[0], aJson.name[1]],
      textStyle: { //图例文字的样式
        color: '#a5aaaf',
        fontSize: fontSize * 0.7
      }
    },

    xAxis: [{
      type: 'category',
      gridIndex: 0,
      axisLabel: {
        interval: aJson.xAxisinterval,
        rotate: 50,
        textStyle: textStyleC,
        formatter: function(value) {
          if (aJson.title == "24小时") {
            return value.substring(0, value.length - 1);
          } else {
            return value.substring(0, value.length);
          }

        }
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC,
      data: aJson.oxAxis,
    }],
    yAxis: [{
      name: aJson.Yname,
      nameGap: 10,
      type: 'value',
      min: 0,
      minInterval: 1,
      max: function(value) {
        return value.max + 20;
      },
      nameTextStyle: {
        color: "#8184a5",
        fontSize: fontSize * 0.7,
      },
      axisLabel: {
        show: true,
        interval: aJson.interval,
        textStyle: textStyleC
      },
      splitLine: splitLineC,
      axisLine: axisLineC,
      axisTick: axisTickC
    }],
    series: [{
        name: aJson.name[1],
        type: 'line',
        data: aJson.data2,
        smooth: true,
        symbol: "none",
        itemStyle: {
          normal: {
            lineStyle: {
              color: aJson.color[1],
              width: '3' //折线的宽度
            }
          }
        },

      },
      {
        name: aJson.name[0],
        type: 'bar',
        barGap: '0.5px',
        data: aJson.data1,
        barMaxWidth: 8,
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: { //图形样式
          normal: {
            barBorderRadius: [50, 50, 0, 0],
            color: aJson.color[0],
          },
        }
      }
    ]
  };

  return option;

}

function Pie222(pieDatas, pieJson) {
  //alert(pieDatas[0].name)
  // console.log(pieDatas)
  if (pieJson.lege == "false") {
    pieJson.lege = false;
  } else {
    pieJson.lege = true;
  }
  if (pieJson.emphasis == "false") {
    pieJson.emphasis = false;
  } else {
    pieJson.emphasis = true;
  }
  pieJson.title = pieJson.title || false;

  option = {
    title: {
      show: pieJson.title,
      text: pieJson.text,
      textStyle: pieJson.textStyle,
      textAlign: 'center',
      x: '45%',
      y: '73%',
    },
    tooltip: {
      show: true,
      formatter: "{b} : {c}",
      textStyle: tooltipTextStyle
    },
    color: pieJson.color,
    legend: {
      show: pieJson.lege,
      orient: 'vertical',
      right: 0,
      top: pieJson.top,
      itemWidth: 6,
      itemHeight: 16,
      itemGap: pieJson.itemGap,
      textStyle: {
        color: '#75CBF2',
        fontSize: pieJson.fontSize / 20 * fontSize,
      },
      formatter: function(name) {
        var total = 0;
        var target;
        for (var i = 0, l = pieDatas.length; i < l; i++) {
          total += pieDatas[i].value;
          if (pieDatas[i].name == name) {
            target = pieDatas[i].value;
          }
        }

        if (total == 0) {
          return name + ' 0%';
        } else {
          return name + ' ' + ((target / total) * 100).toFixed(1) + '%';
        }

      }
    },
    series: [{
      name: '',
      type: 'pie',
      radius: pieJson.radius,
      center: pieJson.center,
      avoidLabelOverlap: false,
      hoverOffset: 5,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: pieJson.emphasis,
          textStyle: {
            fontSize: fontSize,
            color: '#fff',
          },
          formatter: ['{b}', '{c}'].join('\n'),
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: pieDatas
    }]
  };

  return option;

}
