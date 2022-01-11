<template>
	<div class="date-tools">
		<div class="date-top">
			<div class="date-years">
				<button type="button" aria-label="前一年" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="subOneYear"></button>
				<button type="button" aria-label="上个月" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left" @click="subMonth"></button>
				<a class="date-middle Z-numberf"><span @click="selectDownY">{{panelYear}}</span><span  @click="selectDownM">-</span><span @click="selectDownM">{{(panelMonth+1)>9?(panelMonth+1):'0'+(panelMonth+1)}}</span></a>
				<button type="button" aria-label="下年" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right" @click="addOneYear"></button>
				<button type="button" aria-label="下个月" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right" @click="addMonth"></button>
			</div>
			<div class="date-weeks">
				<span>周日</span>
				<span>周一</span>
				<span>周二</span>
				<span>周三</span>
				<span>周四</span>
				<span>周五</span>
				<span>周六</span>
			</div>
		</div>
		<div class="date-days">
			<template v-for="(item,index) in dayFullList">
				<div @click="getCurrentDay(item)" :class="[item.className,item.value==panelDay?'active':'']" >
	                <a class="Z-numberf">{{item.value | filterDay}} </a>
	           </div>
			</template>
		</div>
		<!-- 年下拉框 -->
		<div class="drop-down-ym" v-if="showDropDownY">
			<div class="picker-header">
				<a class="fl" @click="subYear"><<</a>
				<a class="fr" @click="addYear">>></a>
				<span class="Z-numberf">{{nowyear-yearIndex*10}}-{{nowyear-(yearIndex-1)*10}}</span>
			</div>
			<div class="drop-down-y">
				<a href="javascript:void(0);" v-for="(item,index) in yearList" @click="selectY(item)" :class="{'active':item==panelYear}"><span class="Z-numberf">{{item}}</span></a>
			</div>
		</div>
		<!-- 月下拉框 -->
		<div class="drop-down-ym" v-if="showDropDownM">
			<div class="picker-header">
				<a class="fl" @click="subOneYear"><<</a>
				<a class="fr" @click="addOneYear">>></a>
				<span @click="selectDownY" class="Z-numberf">{{panelYear}}年</span>
			</div>
			<div class="drop-down-m">
				<a href="javascript:void(0);" v-for="(item,index) in monthList" @click="selectM(item-1)" :class="{'active':item-1==panelMonth}"><span>{{item | filterMonth}}月</span></a>
			</div>
		</div>
	</div>
</template>

<script>
	export default({
		props: ['events'],
		data() {
			return {
				current:{},
				yearList: [],
				monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				weekList: [],
				dayFullList: [], //所有的天数列表，前面空位补0
				panelYear: '', //仪表盘显示的年
				panelMonth: '', //仪表盘显示的月（从0开始）
				panelDay: '', //仪表盘显示的天（从1开始）
				firstDay: '', //每月第一天
				lastDay: '', //每月最后一天也即每月多少天
				firstDayisWhat: '', //第一天星期几0-6（星期日到星期六）
				showDropDownY: false,
				showDropDownM: false,
				yearIndex:1,
				nowyear:new Date().getFullYear(),
			}
		},
		filters: {
			filterDay(value) {
				return parseInt(value.slice(-2));
			},
			filterMonth(value) {
				var months=['一', '二','三','四','五','六','七','八', '九', '十', '十一', '十二'];
				return months[value-1];
			},
		},
		mounted() {
			this.initYears();
			this.dateInit();
		},
		methods: {
			initYears(){//初始化年份选择
				var years=[];
				for(var i=this.nowyear-(this.yearIndex-1)*10;i>this.nowyear-this.yearIndex*10;i--){
					if(i>0){
						years.unshift(i);
					}
				}
				this.yearList=years;
			},
			dateInit(year = (new Date()).getFullYear(), month = (new Date()).getMonth()) {//初始化日历
				let self = this;
				let y = year;
				let m = month;
				self.panelYear = year;
				self.panelMonth = month;
				self.firstDay = (new Date(y, m, 1)).getDate(); //每月第一天
				self.lastDay = (new Date(y, m + 1, 0)).getDate(); //每月最后一天也即每月多少天
				self.firstDayisWhat = (new Date(y, m, 1)).getDay(); //第一天星期几0-6（星期日到星期六）
				
				var prev=new Date(y, m, 0);//上个月
				var prevDay=(prev.getDate()); //上个月最后一天
				
				let beginTmp=[];//上个月数据
				for(var j=prevDay;j>prevDay-self.firstDayisWhat;j--){
					beginTmp.unshift({
						className:'prev',
						value:prev.getFullYear()+'-'+self.addPreZero(m)+'-'+self.addPreZero(j),
						events:[]
					});
				}
								
				let lastFullTmp = []; //当前月日期，初始化完整的月的每天格式为年月日2018-06-27
				for(let i = 1; i <= self.lastDay; i++) {
					var obj={
						className:'current',
						value:self.panelYear +'-'+self.addPreZero(self.panelMonth + 1)+'-'+self.addPreZero(i),
						events:[]
					}
					if(new Date(obj.value).Format('yyyy-MM-dd')==new Date().Format('yyyy-MM-dd')){
						obj.className='today';	
					}
					
					if(new Date(obj.value).getDay()==6){
						obj.className=obj.className.concat(' last');
					}
					lastFullTmp.push(obj);
					
				}
				
				//填充下个月数据
				var now=new Date(y, m+1, 0);//当前月
				var next=new Date(y, m+1, 1);//下个月
				var nowDay=now.getDay();//当前月最后一天星期几
				var day=0,len=42-(lastFullTmp.length+beginTmp.length)>6?14:7;
				for(var j=nowDay+1;j<len;j++){
					var obj={
						className:'next',
						value:next.getFullYear()+'-'+self.addPreZero(next.getMonth()+1)+'-'+self.addPreZero(++day),
						events:[]
					};
					if(j==6){
						obj.className=obj.className.concat(' last');
					}
					lastFullTmp.push(obj);
				}
				self.dayFullList = beginTmp.concat(lastFullTmp); //用结构的方式生成年月日完整的新日期数组
			},
			subMonth() {//上个月
				let self = this;
				if(self.panelMonth > 0) {
					self.panelMonth--;
				}else{
					self.panelYear--;
					self.panelMonth=11;
				}
			},
			addMonth() {//下个月
				let self = this;
				if(self.panelMonth < 11) {
					self.panelMonth++;
				}else{
					self.panelYear++;
					self.panelMonth=0;
				}
			},
			addOneYear(){
				this.panelYear++;
			},
			subOneYear(){
				if(this.panelYear>0){
					this.panelYear--;
				}
			},
			addYear(){
				if(this.yearIndex>1){
					this.yearIndex--;
					this.initYears();
				}
			},
			subYear(){
				if(this.nowyear-this.yearIndex*10>0){
					this.yearIndex++;
					this.initYears();
				}
			},
			getCurrentDay(item) {//选中日期
				this.current=item;
				this.panelDay = item.value;
			},
			selectDownY() {//下拉年
				let self = this;
				self.showDropDownY = true;
				self.showDropDownM = false;
			},
			selectDownM() {//下拉月
				let self = this;
				self.showDropDownM = true;
			},
			selectY(year) {//选年
				let self = this;
				self.panelYear = year;
				self.showDropDownY = false;
				self.showDropDownM = true;
			},
			selectM(month) {//选月
				let self = this;
				self.panelMonth = month;
				self.showDropDownM = false;
			},
			addPreZero(num) { //小于9的需要添加0前缀
				if(num==0){
					return 12;
				}
				return(num > 9) ? num : ('0' + num);
			},
			removePreZero(num) { //小于9的需要去除0前缀
				return parseInt(num);
			}
		},
		watch: {
			panelMonth(newVal, oldVal) { //检测月份变化
				this.dateInit(this.panelYear, this.panelMonth);
			},
			panelYear(newVal, oldVal) { //检测年份变化
				this.dateInit(this.panelYear, this.panelMonth);
			},
			panelDay(newVal, oldVal) { //检测具体日期变化
				var vm=this;
				this.$emit('changeDate', vm.current.events);
			},
			events(){
				var vm=this;
				vm.dayFullList.forEach(function(obj){
					obj.events=[];
				})
				this.events.forEach(function(value){
					vm.dayFullList.forEach(function(item){
						var timestart =  new Date(Date.parse(value.eventTime.replace(/-/g,"/"))).getTime();
						var timeend =  new Date(Date.parse((item.value+' 00:00:00').replace(/-/g,"/"))).getTime();
						var hours=(timestart-timeend)/1000/60/60;
						if(hours>=0&&hours<24){
							if(item.className.indexOf('hasData')==-1){
								item.className=item.className.concat(' hasData');
								item.events=[value];
							}else{
								item.events.push(value);
							}
						}
						if(item.className.indexOf('today')!=-1&&vm.panelDay==''){
							vm.getCurrentDay(item);
						}
					})
				});
				this.$emit('changeDate', vm.current.events);
			},
			dayFullList(){
				var vm=this;
				this.$emit('refresh',{
					endTime:vm.dayFullList[vm.dayFullList.length-1].value,
					startTime:vm.dayFullList[0].value,
				});
			}
		},
	})
</script>

<style lang="scss" scoped>
	.date-middle,.date-btn {
		display: inline-block;
		line-height: 48px;
		font-size: 20px;
		color:#75CBF2;
		cursor: pointer;
		text-align: center;
		vertical-align: middle;		
	}
	
	.date-tools {
		position: relative;
		width: 350px;
		min-height: 340px;
		margin: auto;
		overflow: hidden;
		user-select: none;
		*{
			font-size: 16px;
		}
		.date-btn {
			width: 34px;
			border-radius: 50%;
			font-size: 28px;
		}
		.date-years {
			text-align: center;
			*{
				font-size: 16px;
				color: #4AACDB;
			}
			.el-picker-panel__icon-btn{
				margin-top: 16px;
				padding: 0px 5px;
			}
		}
		
		.date-weeks {
			display: flex;
			justify-content: space-between;
			color: #64B9E2;
			background:rgba(10,63,94,0.28);
			border:1px solid rgba(11,11,11,0.28);
			span {
				display: inline-block;
				width: 50px;
				height: 50px;
				line-height: 50px;
				text-align: center;
			}
		}
	}

	.date-days {
		&>div {
			display: inline-block;
			width: 50px;
			height: 40px;
			background-color:transparent;
			box-sizing: border-box;
			text-align: center;
			cursor: pointer;		
			&.prev,&.next{
				a{
					color: #31859C;
				}
			}
			&.current{
				a{
					color: #75CBF2;
				}
			}
			&.today{
				a{
					color:white;
					position: relative;
					&:after{
						content: '';
						position: absolute;
						bottom: 5px;
						left: 7px;
						width: 16px;
						border-bottom: 1px solid white;
					}
				}
			}
			&.hasData{
				a{
					color:#75CBF2 ;
					border-color:#75CBF2;	
					&:hover{
						border-color: #ED7703;
					}
					&:after{
						border-bottom-color:#75CBF2;
					}
				}
			}
			&.active{
				a{
					color: #ED7703;
					&:after{
						border-color:#ED7703;
					}
				}
				&.hasData a{
					border-color:#ED7703;	
					&:after{
						border-bottom-color:#ED7703 ;
					}
				}
			}
			a {
				color: #004E81;
				display: inline-block;
				width: 30px;
				height: 30px;
				line-height: 30px;
				margin-top: 0.35rem;
				border-radius: 50%;
				text-align: center;
				border:1px solid transparent; 
				transition:all .1s linear; 
				&:hover {
					color: #ED7703;
				}
			}
		}
	}


	.drop-down-ym {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 32, 55, 1);
		.picker-header{
		    background: #004e81;
		    border-radius: 2px 1px 1px 1px;
		    margin: 0;
		    line-height: 36px;
		    padding: 0 8px;
		    cursor: pointer;
		    color: #75cbf2;
		    text-align: center;
		    a{
		    	 color: #75cbf2;
		    }
		    *{
		    	font-size: 16px;
		    }
		}
		.drop-down-y,.drop-down-m {
			overflow: auto;
			font-size: 0px;
			padding: 10px;
			max-height: 100%;
			&::-webkit-scrollbar {
				display: none;
			}
			a {
			    width: 25%;
			    height: 60px;
			    display: inline-block;
			    line-height: 60px;
			    border-radius: 50%;
			    text-align: center;
			    padding: 5px 0px;
			    span{
			    	display: inline-block;
			    	width:50px;
			    	height: 50px;
			    	line-height: 50px;
			    	border-radius: 50%;
			    	font-size: 16px;
			    	color:#75cbf2;
			    }
				&:hover {
					span{
						color: #fff;
						background-color: rgba(10, 130, 229, 0.774);
					}
				}
				&.active {
					span{
						color: #fff;
						background-color: rgba(10, 130, 229, 0.774);
					}
				}
			}
		}
	}
</style>