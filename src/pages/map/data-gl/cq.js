import mapPoints from './cqArea.js';
var color=['red','#0A3F5E','#75CBF2','#ED7703','#32C872','#D45079','#0A3F5E'];
function convertData(type){
	var lines=[],effects=[];
	mapPoints.features.forEach((value,index)=>{
		if(index==23||index<9){
			if(value.properties.name!='渝北区'){
				var state=value.properties.name=='永川区';
				lines.push({
					fromName:value.properties.name,
					toName:'渝北区',
					"coords": [
						value.properties.cp,
						[106.7212,29.8499]
					],
				});
				effects.push({
					name:value.properties.name,
					value:[].concat(value.properties.cp,[index]),
//					"symbolSize": state?4:2,
					itemStyle:{
						color:color[index%6]
					}
				});
			}
		}
		
	});
	effects.push({
		name:'渝北区',
		value:[106.7212,29.8499,0],
		"symbolSize":15,
		rippleEffect:{              //涟漪特效相关配置。
			scale:3,
		},
//		itemStyle:{
//			color:'#FFCC00'
//		}
	});
	if(type==1){
		return lines;
	}else{
		return effects;
	}
}



var cqData=[
{
	"name": "",
	"type": "lines",
	"coordinateSystem": "geo",
	"zlevel": 1,
	label:{
		show:false,
	},
	"effect": {
		"show": true,
		"period": 6,
		"trailLength": 0.7,
		"color": "#FF9900",
		"symbolSize": 3
	},
	"lineStyle": {
		"normal": {
			"color": "#ED7703",
			"width": 0,
			"curveness": 0.2
		}
	},
	"data":convertData(1)
},
{
	"name": "",
	"type": "lines",
	"coordinateSystem": "geo",
	"zlevel": 2,
	"effect": {
		"show": true,
		"period": 6,
		"trailLength": 0,
		color:'#FF9900',
		symbolSize:5,
		symbol:'arrow',
//		symbol:'pin',
//		"symbol": "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z",
//		"symbolSize": 15
	},
	"lineStyle": {
		"normal": {
			"color": "#0ff",
			"width": 0.5,
			"opacity": 1,
			"curveness": 0.2
		}
	},
	"data": convertData(1)
},
{
	"name": "",
	"type": "effectScatter",
	"coordinateSystem": "geo",
	"zlevel": 2,
	symbolSize:5,
	effectType:"ripple", 
	rippleEffect:{              //涟漪特效相关配置。
	    period:7,
		scale:8,
		brushType:'stroke',      //波纹的绘制方式，可选 'stroke' 和 'fill'。
	},
	"label": {
		"normal": {
			fontSize:12,
			color:'white',
			"show": false,
			"position": "right",
			"formatter": "{b}"
		}
	},
	"showEffectOn": "render",
//	"itemStyle": {
//		"normal": {
//			"color": "#a6c84c"
//		}
//	},
	"data":convertData(2)
}]


export default {
	cqData:cqData
}



