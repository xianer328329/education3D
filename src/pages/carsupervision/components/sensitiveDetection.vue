<template>
	<div class="h-container">
		<span class="boxtitle">敏感监测</span>
		<div class="h-content">
			<!--车辆筛查-->
			<div class="section section1" >
				<div class="Z-border h-border">
				  <i class="Z-bLT Z-b"></i>
		          <i class="Z-bRT Z-b"></i>
		          <i class="Z-bLB  Z-b"></i>
		          <i class="Z-bRB Z-b"></i>
		          <h4 class="h-title">{{carMoreUnit.computeUnit}}+车辆筛查</h4>
	            </div>
	            <div class="unit-car">
	            	<div class="h-bar"></div>
	            	<ul>
	            		<li class="vertical-middle-c">
	            			<div class="vertical-middle">
								<span class="Z-numberf">24h</span>
								<i class="car-icon" :class="['car-icon','car1']"></i>
								<b class="Z-numberf">{{carMoreUnit.unitAnaly24}}</b>
							</div>
	            		</li>
	            		<li class="vertical-middle-c">
	            			<div class="vertical-middle">
								<span class="Z-numberf">48h</span>
								<i class="car-icon" :class="['car-icon','car2']"></i>
								<b class="Z-numberf">{{carMoreUnit.unitAnaly48}}</b>
							</div>
	            		</li>
	            		<li class="vertical-middle-c">
	            			<div class="vertical-middle">
								<span class="Z-numberf">72h</span>
								<i class="car-icon" :class="['car-icon','car3']"></i>
								<b class="Z-numberf">{{carMoreUnit.unitAnaly72}}</b>
							</div>
	            		</li>
	            		<li class="vertical-middle-c">
	            			<div class="vertical-middle">
								<span class="Z-numberf">96h</span>
								<i class="car-icon" :class="['car-icon','car4']"></i>
								<b class="Z-numberf">{{carMoreUnit.unitAnaly96}}</b>
							</div>
	            		</li>
	            		<li class="vertical-middle-c">
	            			<div class="vertical-middle">
								<span class="Z-numberf">120h</span>
								<i class="car-icon" :class="['car-icon','car5']"></i>
								<b class="Z-numberf">{{carMoreUnit.unitAnaly120}}</b>
							</div>
                		</li>
	            	</ul>
	            </div>
			</div>
			<!--车牌筛查-->
			<div class="section section2">
				<div class="Z-border  h-border">
				  <i class="Z-bLT Z-b"></i>
		          <i class="Z-bRT Z-b"></i>
		          <i class="Z-bLB  Z-b"></i>
		          <i class="Z-bRB Z-b"></i>
		          <h4 class="h-title">车牌筛查</h4>
		        </div>
		        <div class="h-C clearFix">
		        	<div class="h-C1">
		        		<ul class="h-gjc1List" id="plateScreen">
		        			<li :class="'h-key'+(index+1)" v-if="index<10" v-for="(item,index) in carPlats">{{item.carPlate}}</li>
		        		</ul>
		        	</div>
		        </div>
	        </div>
	        <!---->
	        <div class="section section3">
		        <div class="h-btn-group">
		        	<a @click="operate(1)" :class="{'active':curr==1}">24h</a>
		        	<a @click="operate(2)" :class="{'active':curr==2}">48h</a>
		        	<a @click="operate(3)" :class="{'active':curr==3}">72h</a>
		        </div>
		        <ul class="h-car">
		        	<li :class="{'active':item.carPlate==car.carPlate}" v-for="(item,index) in cars" @click="showTrail(item)">
		        		<i class="Z-numberf">{{index+1}}</i>
		        		<span>{{item.carPlate}}</span>
		        		<b class="Z-numberf">{{item.analyCount}}</b>
		        	</li>
		        </ul>
	        </div>
	        
	        <div class="h-timeline">
	        	<ul>
	        		<li v-for="item in days" class="Z-numberf" :class="{'active':item.date==nowDate.date}" @click="changeDate(item)">{{item.day}}</li>
	        	</ul>
	        </div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				curr:1,
				carMoreUnit:{
					unitAnaly24:"--",
					unitAnaly48:"--",
					unitAnaly72:"--",
					unitAnaly96:"--",
					unitAnaly120:"--",
				},//5+单位
				cars:[],//车牌筛查表格列表
				carPlats:[],//车牌
				car:{},//当前选中车辆
				days:[],//30天
				nowDate:{},
			}
		},
		mounted(){
			this.getDays();
			this.getData();
			this.getCarPlats();
		},
		beforeDestroy(){
			this.bus.$emit('getTrail',JSON.stringify({type:2}))
		},
		methods:{
			//获取数据
			getData(){
				this.getCarMoreUnit();
				this.getCarFilter();
			},
			//选择车辆
			showTrail(item){
				this.car=item;
				this.getTrail();
			},
			//获取轨迹
			getTrail(){
				if(this.car.carPlate){
					var params={
						curr:this.curr,
						carPlate:this.car.carPlate,
						'date':this.nowDate['date'],
						type:1
					};
					this.bus.$emit('getTrail',JSON.stringify(params))
				}
			},
			//获取最近30天
			getDays(){
				var sDate=new Date();
				sDate.setDate(sDate.getDate() - 29);
				var eDate = new Date();
				var arr=[];
				for (var vdate = new Date(sDate); vdate <= eDate;vdate.setDate(vdate.getDate() + 1)) {
					arr.push({
						day:vdate.Format('dd'),
						'date':vdate.Format('yyyy-MM-dd')
					});
				}
				this.days=arr;
				this.nowDate=arr[arr.length-1];
			},
			//切换日期
			changeDate(item){
				var vm=this;
				vm.nowDate=item;
				this.getData();
			},
			//切换时间选项，24/48..
			operate(i){
				this.curr=i;
				this.getCarFilter();
			},
			//获取5+单位
			getCarMoreUnit(){
				var vm=this;
				var params = new FormData();
        		params.append('date',new Date(vm.nowDate['date']).toJSON());
				this.$axios.post('traffic/pass/carMoreUnit',params).then(function(res){
					 var data=res,arr=[];
					vm.carMoreUnit=data;
				})
			},
			//获取车牌
			getCarPlats(){
				var vm=this;
				this.$axios.post('traffic/pass/carMoreScreening',{}).then(function(res){
					 vm.carPlats=res.moreDetail;
				})
			},
			//车牌筛查
			getCarFilter(){
				var vm=this;
				var params = new FormData();
        		params.append('date',new Date(vm.nowDate['date']).toJSON());
				params.append('timeFlag',vm.curr*24);
				this.$axios.post('traffic/pass/carMoreDetail',params).then(function(res){
					vm.cars=res.moreDetail;
					vm.car=vm.cars.length>0?vm.cars[0]:{};
					vm.getTrail();
				})
			},
		}
	}
</script>

<style lang="stylus" scoped="scoped">
.boxtitle{
	color:#75CBF2;
}
.h-content{
	position: absolute;
	left:10px;
	top:5px;
	right:10px;
	bottom:5px
}
.h-timeline{
	position: absolute;
	width: 66.66%;
	bottom: 5px;
	left: 0px;
	white-space: nowrap;
	overflow: visible;
	font-size: 0px;
	li{
		font-size: 0.75rem;
		color: #999999;
		display: inline-block;
		padding: 0px 1.5px;
		cursor: pointer;
		
	}
	li:hover{
		color: #0ff;
	}
	li.active{
		color: #0ff;
		background: rgba(0, 255, 255, 0.2);
	}
}
.ml25{
	margin-left: 10px;
	margin-right: -10px;
}
.ml40{
	margin-left: 40px;
}
.section{
	float: left;
	width: 33.33%;
	height:100%;
	text-align: center;
}
.h-C{
	clear:both;
	height: calc(100% - 5rem);
}
.Z-border{
	display: inline-block;
	text-align: center;
	padding:0.15rem 0.9rem;
}
.h-title{
	color: #75CBF2;
	font-size: 0.8rem;
}

.h-btn-group{
	text-align: right;
}
.h-btn-group a{
	display: inline-block;
	text-align: center;
	width:3.5rem;
	line-height:1.3rem;
	background:rgba(255, 255, 255, 0.2);
	color:rgba(254,254,254,1);
	border:1px solid rgba(255,255,255,1);
	cursor: pointer;
	margin-left: 0.5rem;
}
.h-btn-group a.active{
	border:1px solid rgba(0,255,255,1);
	background: rgba(0, 255, 255, 0.2);
}
.h-border{
	float: right;
	margin-bottom: 1rem;
}
/*5+单位数据筛查*/
.section1{
	margin-left: -10px;
}
.unit-car{
	position: relative;
	height:calc(100% - 5rem);
   overflow: visible;
   clear: both;
}
.h-bar{
	position: absolute;
	right: 0px;
	top: 0px;
	bottom: 0px;
	width:14px;
	background:linear-gradient(to top,rgba(4,120,183,1) 7%,rgba(243,161,37,1) 50%,rgba(208,74,74,1) 99%);
}
.unit-car ul{
	position: relative;
	height:100%;
    margin-right: 15px;
}
.unit-car li{
	height:20%;
	font-size: 0.9rem;
	color: #75CBF2;
	text-align: left;
	overflow: hidden;
	margin-right: 2rem;
	line-height: 1.2rem;
	*{
		vertical-align: middle;
	}
	
}
.unit-car li span{
	display: inline-block;
	width: 3.5rem;
	text-align: right;
}
.unit-car li b{
	float: right;
	width: 3.5rem;
	text-align: right;
}
.car-icon{
	display: inline-block;
	width: 0.9rem ;
	height: 0.7rem;
	margin: 0px 0.25rem;
	background-size:100% !important;
}
.car1{
	background: url(../../../../static/images/carSupervision/car.png);
}
.car2{
	background: url(../../../../static/images/carSupervision/car-1.png);
}
.car3{
	background: url(../../../../static/images/carSupervision/car-2.png);
}
.car4{
	background: url(../../../../static/images/carSupervision/car-3.png);
}
.car5{
	background: url(../../../../static/images/carSupervision/car-4.png);
}
/*24h*/
.section3{
	overflow: hidden;
}
.h-car{
	margin-top: 10px;
	height: calc(100% - 4rem);
	overflow: auto;	
	margin-left: 2.4rem;
	margin-right -25px;
}

.h-car li{
	margin-right 25px;
	text-align: left;
	padding-bottom: 0.2rem;
	padding-top: 0.5rem;
	border-bottom: 1px solid rgba(0,255,255,0.5);
	font-size: 0.9rem;
	color: #75CBF2;
	cursor: pointer;
}
.h-car li i{
	display: inline-block;
	width:1.25rem;
	line-height:1.3rem;
	border:1px solid #75CBF2;
	border-radius:0.2rem;
	text-align: center;
	margin-right: 0.3rem;
}
.h-car li b{
	float: right;
	display: inline-block;
	width: 4.5rem;
	text-align: center;
	position: relative;
	height: 100%;
	font-weight: bold;
}
.h-car li b:before,.h-car li b:after{
	content: '';
	position: absolute;
	left: 0px;
	bottom: -8px;
	width:7px;
	height:6px;
	background-color:rgba(255,255,255,0.2);
}
.h-car li b:after{
	left: auto;
	right: 0px;
}
.h-car li.active{
	border-bottom: 1px solid #00FFFF;
}
.h-car li.active *{
	color: #00FFFF;
}
.h-car li.active i{
	border:1px solid rgba(0,255,255,1);
}
.h-car li.active b:before,.h-car li.active b:after{
	background-color:#00FFFF;
}
/*车牌筛查*/
.section2 .h-border{
	margin-right: 3.5rem;
}
.h-gjc1List {
	margin: 0 auto;
	position: relative;
}

.h-C2List {
	height: 100%;
	overflow: hidden;
}

.h-C2List li {
	width: 235px;
	line-height: 34px;
	border-bottom: 1px solid rgba(0, 255, 255, 1);
	cursor: pointer;
	padding: 0 5px;
}

.h-C2List li span {
	font-size: 18px;
	font-family:"DIN Medium";
	font-weight: 400;
	color: rgba(0, 255, 255, 1);
}

.h-C1 {
	width: 100%;
	height:100%;
	position:relative;
}

.h-C2 {
	width: 250px;
	position: relative;
	top: -5px;
}

.h-on {
	color: #00ffff;
}

.h-gjc {
	float: left;
	width: 260px;
	overflow: hidden;
	position: relative;
}

.h-gjc1List {
	height:100%;
	margin: 0 auto;
	position: relative;
}

.h-gjc1List li {
	font-size: 1rem;
	color: #ED7703;
	opacity: 0.1;
	position: absolute;
	/*top: 0px;
	left: 0px;*/
}

.h-gjc1List li {
	animation: h-key 10s linear infinite;
	white-space: nowrap;
}

.h-gjc1List .h-key1 {
	animation-duration: 5s;
	right: 16%;
	top:-10%;
}

.h-gjc1List .h-key2 {
	animation-duration: 4s;
	right: 8%;
	top: 25%;
}

.h-gjc1List .h-key3 {
	animation-duration: 15s;
	left: 47.2%;
	top: 33%;
}

.h-gjc1List .h-key4 {
	animation-duration: 10s;
	right: 0px;
	top: 7%;
}

.h-gjc1List .h-key5 {
	animation-duration: 9s;
	left: 4%;
	top: 41%;
}

.h-gjc1List .h-key6 {
	animation-duration: 5s;
	left: 60%;
	top: 56%;
}

.h-gjc1List .h-key7 {
	animation-duration: 13s;
	left: 14%;
	top: 18%;
}

.h-gjc1List .h-key8 {
	animation-duration: 4s;
	left: 2%;
	top: 69%;
}

.h-gjc1List .h-key9 {
	animation-duration: 16s;
	left: 34.4%;
	top: 77%;
}

@keyframes h-key {
	0% {
		transform: scale(0.4, 0.4) translate(0, 0);
		opacity: 0;
	}
	90% {
		opacity: 1;
	}
	100% {
		transform: scale(1.2, 1.2) translate(20px, 15px);
		opacity: 0;
	}
}
</style>