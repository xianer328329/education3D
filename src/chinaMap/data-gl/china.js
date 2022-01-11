import mapPoints from './chinaArea.js';
var lineColors = ['#00ffff', '#d04a4a', '#ff9900', '#32c872'];
//地图样式
var bmap = {
	//	show:false,
	center: [106.5344, 29.5477],
	zoom: 10,
	roam: false,
	mapStyle: {
		styleJson: [{
				"featureType": "water",
				"elementType": "all",
				"stylers": {
					"color": "#021019"
				}
			},
			{
				"featureType": "highway",
				"elementType": "geometry.fill",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "highway",
				"elementType": "geometry.stroke",
				"stylers": {
					"color": "#147a92"
				}
			},
			{
				"featureType": "arterial",
				"elementType": "geometry.fill",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "arterial",
				"elementType": "geometry.stroke",
				"stylers": {
					"color": "#0b3d51"
				}
			},
			{
				"featureType": "local",
				"elementType": "geometry",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "land",
				"elementType": "all",
				"stylers": {
					"color": "#08304b"
				}
			},
			{
				"featureType": "railway",
				"elementType": "geometry.fill",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "railway",
				"elementType": "geometry.stroke",
				"stylers": {
					"color": "#08304b"
				}
			},
			{
				"featureType": "subway",
				"elementType": "geometry",
				"stylers": {
					"lightness": -70
				}
			},
			{
				"featureType": "building",
				"elementType": "geometry.fill",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "all",
				"elementType": "labels.text.fill",
				"stylers": {
					"color": "#857f7f"
				}
			},
			{
				"featureType": "all",
				"elementType": "labels.text.stroke",
				"stylers": {
					"color": "#000000"
				}
			},
			{
				"featureType": "building",
				"elementType": "geometry",
				"stylers": {
					"color": "#022338"
				}
			},
			{
				"featureType": "green",
				"elementType": "geometry",
				"stylers": {
					"color": "#062032"
				}
			},
			{
				"featureType": "boundary",
				"elementType": "all",
				"stylers": {
					"color": "#1e1c1c"
				}
			},
			{
				"featureType": "manmade",
				"elementType": "geometry",
				"stylers": {
					"color": "#022338"
				}
			},
			{
				"featureType": "poi",
				"elementType": "all",
				"stylers": {
					"visibility": "off"
				}
			},
			{
				"featureType": "all",
				"elementType": "labels.icon",
				"stylers": {
					"visibility": "off"
				}
			},
			{
				"featureType": "all",
				"elementType": "labels.text.fill",
				"stylers": {
					"color": "#2da0c6",
					"visibility": "on"
				}
			}
		]
	}
};

function convertData(type) {
	var lines = [],
		effects = [];
	mapPoints.features.forEach((value, index) => {
		if(value.properties.name != '北京') {
			var state = value.properties.name == '重庆';
			lines.push({
				fromName: value.properties.name,
				toName: '北京',
				"coords": [
					value.properties.cp, [116.4551, 40.2539]
				],
				lineStyle: {
					color: lineColors[index % 4]
				},
			});
			effects.push({
				name: value.properties.name,
				value: [].concat(value.properties.cp, [state ? 100 : 0]),
				"symbolSize": state ? 20 : 10,
				itemStyle: {
					color: state ? '#75cbf2' : lineColors[index % 4]
				}
			});
		}
	});
	effects.push({
		name: '北京',
		value: [116.4551, 40.2539, 0],
		"symbolSize": 25,
		itemStyle: {
			//			color:'#FFCC00',
			color: 'transparent',
		},
		label: {
			offset: [-32, -2],
			formatter: '{flag|}',
			rich: {
				flag: {
					width: 30,
					height: 30,
					backgroundColor: {
						image: require('../data-gl/asset/flag.png')
					},
				},
			}
		}
	});
	if(type == 1) {
		return lines;
	} else {
		return effects;
	}
	//	console.log(JSON.stringify(lines1))
}

var chinaData = [{
		"name": "",
		"type": "lines",
		"coordinateSystem": "geo",
		"zlevel": 1,
		label: {
			show: false,
		},
		"effect": {
			"show": true,
			"period": 6,
			"trailLength": 0.7,
			//		"color": "#FF9900",
			"symbolSize": 3
		},
		"lineStyle": {
			"color": "#ED7703",
			"width": 0,
			"curveness": 0.2
		},
		"data": convertData(1)
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
			//		color:'#FF9900',
			symbolSize: 5,
			//		symbol:'pin',
			//		"symbol": "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z",
			//		"symbolSize": 15
		},
		"lineStyle": {
			"color": "#0ff",
			"width": 0.5,
			"opacity": 1,
			"curveness": 0.2
		},
		"data": convertData(1)
	},
	{
		"name": "",
		"type": "effectScatter",
		"coordinateSystem": "geo",
		"zlevel": 2,
		symbolSize: 12,
		"rippleEffect": {
			"brushType": "stroke"
		},
		//	emphasis:{
		//		label:{
		//			show:false
		//		}
		//	},
		"label": {
			"normal": {
				fontSize: 16,
				color: 'white',
				"show": true,
				"position": "right",
				"formatter": "{b}"
			}
		},
		"showEffectOn": "render",
		"itemStyle": {
			"normal": {
				"color": "#a6c84c"
			}
		},
		"data": convertData(2)
	}
]
export default {
		bmap: bmap,
		chinaData: chinaData
	}
	