<template>
	<div class="popshade" v-show="list.show">
		<div class="Pop3Box Popout">
			<h4 class="Z-Btitle2" v-show="list.monitor">{{list.title}}</h4>
			<h4 class="numberTimes" v-show="!list.monitor"><span>{{list.title}}<i>{{list.total}}次</i></span><span v-show="list.duration" >累计离线时长  <i>{{list.duration}}</i></span></h4>
			<h5 class="Z-close" v-on:click="closePop()"><img src="../../../../static/images/Zgb.png" alt=""/></h5>
			<div class="AlarmTableBox">
				<table class="AlarmTable AlarmTableFix" style="position:absolute; margin-bottom: 0px;">
				<tr >
					<th v-for="item of list.theader" :key="item">{{item}}</th>
				</tr>
				</table>
				<div  style="max-height:667px;overflow: auto;">
				<table class="AlarmTable">
				<tr class="thead-tr">
					<th v-for="item of list.theader" :key="item">{{item}}</th>
				</tr>
				<tr v-for="(data,index) of list.rows" :key="index">
					<td v-for="(value, key) in data" :key="value+'0'+key" :class="{'Z-Nountreated':value=='查看'}" v-on:click="MonitorLookClick(value,index,key)">{{value}}</td>
				</tr>
				
			</table>
				</div>
				
			<div class="loading" v-show="loadingshow&&(list.rows&&!list.rows.length)"><img src="../../../../static/images/gif.png" /><i>数据加载中...</i></div>
			<div class="nodataHint" v-show="nodatashow">暂无数据</div>
			</div>
			<div class="Z-lyPage fr">
				<img src="../../../../static/images/first_page.png" @click="firstPage(1)" />
				<img src="../../../../static/images/last.png" @click="firstPage(2)" />
				<p>第<input type="text" v-model="back.currentPage">页 共<span>{{page()}}</span>页 <i @click="firstPage(3)">跳转</i></p>
				<img src="../../../../static/images/next.png" @click="firstPage(4)" /><img @click="firstPage(5)" src="../../../../static/images/last_page.png" />
			</div>
		</div>
		<div class="MonitorScope" v-show="MonitorScope">
			<h4 class="Z-Btitle2">布控范围</h4>
			<h5 class="Z-close" v-on:click="closeScope()"><img src="../../../../static/images/Zgb.png" alt=""/></h5>
			<ul>
				<li v-for="(itme,index) in MonitorScopeList">{{index+1}},{{itme}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'EmergencyPop3tablet',
		data() {
			return {
				back: {
					currentPage: '1',
				},
				list: {},
				loadingshow:true,
				nodatashow:false,
				MonitorScope:false,
				MonitorScopeList:[]
			}
		},
		methods: {
			closePop() { //关闭弹框
				this.list.show = false
			},
			closeScope() { //关闭布控范围
				this.MonitorScope = false
			},
			page() {
				if(this.list.total / 15 == "0") {
					return 1
				} else {
					return Math.ceil(this.list.total / 15);
				}

			},
			firstPage(type) { //翻页
				if(type == 1) { //第一页
					if(this.back.currentPage == 1) {
						return
					} else {
						this.back.currentPage = 1;
					}

				} else if(type == 2) { //上一页
					if(this.back.currentPage > 1) {
						this.back.currentPage--;
					} else {
						this.back.currentPage = 1;
						return
					}
				} else if(type == 3) { //跳转
					if(this.back.currentPage <= 0 || this.back.currentPage > this.page()) {
						this.back.currentPage = 1;
					}
				} else if(type == 4) { //下一页
					if(this.back.currentPage < this.page()) {
						this.back.currentPage++;
					} else {
						this.back.currentPage = this.page();
						return
					}
				} else if(type == 5) { //最后一页
					if(this.back.currentPage == this.page()) {
						return
					} else {
						this.back.currentPage = this.page();
					}
				}
				if(this.list.type == "traffic") {
					this.bus.$emit('carturningPagePop3', this.back)
				} else if(this.list.type == "security") {
					this.bus.$emit('secturningPagePop3', this.back)
				}

			},
			MonitorLookClick(value, index,key2) {
				if(value != "查看") {
					return
				}else if(key2=="查看范围"&&this.list.title == "车辆联防布控"){
					this.MonitorScope = true;
					this.MonitorScopeList=this.list.controlUnit[index].split(",");
				}else {
					if(this.list.title == "车辆本校布控" || this.list.title == "车辆联防布控") {
						this.bus.$emit('MonitorLookTraffic', index)
					} else if(this.list.title == "人脸本地布控" || this.list.title == "人脸联防布控") {
						this.bus.$emit('MonitorLookSecurity', index)
					}

				}
			},
			thHeight(){
				this.$nextTick(function() {
           			$(".AlarmTableFix tr th").each(function (i, v) {
               			$(this).css("width", $(".thead-tr th").eq(i).outerWidth())
           			})
           			
				})
			}

		},
		mounted: function() {
			var _this = this;
			this.bus.$on('addPop3table', function(mes) {
				_this.list = mes;
				_this.thHeight();
				if(mes.rows.length==0){
					_this.loadingshow=false
					_this.nodatashow=true
				}else{
					_this.loadingshow=true
					_this.nodatashow=false
				}
				_this.back.currentPage = mes.currentPage
			})
			this.bus.$on('addMonitorList', function(mes) {
				_this.list = mes;
				_this.thHeight();
				if(mes.rows.length==0){
					_this.loadingshow=false
					_this.nodatashow=true
				}else{
					_this.loadingshow=true
					_this.nodatashow=false
				}
				_this.back.currentPage = mes.currentPage
			})
		},

	}
</script>

<style lang="stylus" scoped>
	.Pop3tab {
		width: 1210px;
		z-index: 999;
		top: 50%;
		left: 50%;
		margin-left: -650px;
		margin-top: -348px;
		min-height: inherit;
	}
	
	.numberTimes {
		font-size: 18px;
		color: #fff;
		margin-left: 10px;
	}
	
	.numberTimes span {
		margin-right: 95px;
	}
	
	.numberTimes i {
		color: #75CBF2;
		margin-left: 4px;
	}
	.Pop3Box{
    	width: 1210px;
    	height: 760px;
		content: "";
		display: block;
		position: absolute;
		top: 50%;
    	left: 50%;
    	margin-left: -650px;
    	margin-top: -385px;
	}
	.popshade{
		width: 1920px;
		height: 1080px;
		content: "";
		display: block;
		position: absolute;
		top: 0px;
    	left:0px;
    	z-index:9999;
    	background: rgba(0,0,0,0.4);
	}
	.Popout .AlarmTable td {
    	max-width: 300px;
    	box-sizing: border-box;
	}
	.AlarmTableBox{
		height: 684px;
		position:relative;
		margin-top: 10px;
	}
	.AlarmTableBox .AlarmTable{
		margin: 0px;
	}
	.AlarmTableFix{
		z-index: 6;
	}
	.MonitorScope{
		height: 584px;
    	border: 1px solid #38c1ff;
    	background: #002037 !important;
    	position: absolute !important;
    	top: 191px;
    	left:700px;
    	padding: 10px;
   		width: 400px;
    	z-index: 30;
    	box-sizing: border-box;
	}
	.MonitorScope .Z-Btitle2{
		font-size:18px;
		color:#fff;
	}
	.MonitorScope ul{
		height: 525px;
		margin-top: 10px;
		overflow: auto;
	}
	.MonitorScope li{
		font-size: 16px;
    	line-height:30px;
    	color: #75CBF2;
    	margin-bottom: 5px;
	}
</style>