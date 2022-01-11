<template>
	<el-dialog title="舱门状态" class="SMshelter shelterDoorState" :modal-append-to-body="false" :modal="true" :visible="curr!=''" :before-close="close">
		<div class="clearFix postStateContainer">
			<div class="portStateIMg fl">
				<img class="dootImg1" :class="{openAni:list.gateSeven=='开启'}" src="../../../../static/images/shelterDoor/fc1.png"  alt="" />
				
				<img class="dootImg2 dootImg2-1" :class="{openAni:list.gateOne=='开启'}" src="../../../../static/images/shelterDoor/fc2.png"  alt="" />
				<img class="dootImg2 dootImg2-2" :class="{openAni:list.gateTwo=='开启'}" src="../../../../static/images/shelterDoor/fc2.png"  alt="" />
				<img class="dootImg2 dootImg2-3" :class="{openAni:list.gateThree=='开启'}" src="../../../../static/images/shelterDoor/fc2.png"  alt="" />
				<img class="dootImg2 dootImg2-4" :class="{openAni:list.gateFour=='开启'}" src="../../../../static/images/shelterDoor/fc2.png"  alt="" />
				<img class="dootImg2 dootImg2-5" :class="{openAni:list.gateFive1=='开启'}" src="../../../../static/images/shelterDoor/fc2.png"  alt="" />
				
				<img class="dootImg3" :class="{openAni:list.gateSix=='开启'}" src="../../../../static/images/shelterDoor/fc3.png"  alt="" />
				<img class="dootImg4" :class="{openAni:list.gateEight=='开启'}" src="../../../../static/images/shelterDoor/fc4.png"  alt="" />
				<img class="dootImg5" :class="{openAni:list.gateNine=='开启'}" src="../../../../static/images/shelterDoor/fc5.png"  alt="" />
				<img class="dootImg6" :class="{openAni:list.gateTen=='开启'}" src="../../../../static/images/shelterDoor/fc6.png"  alt="" />
			</div>
			<ul class="portStateList fr">				
					<li class="clearFix" :class="{open:list.gateSeven=='开启'}">
						<span v-show="list.gateSeven=='开启'"></span><i class="fl">通讯保障舱</i><i class="fr">{{list.gateSeven}}</i>
					</li>
					<!--<li class="clearFix" :class="{open:list.gateSix=='开启'}">
						<span v-show="list.gateSix=='开启'">!</span><i class="fl">担架舱</i><i class="fr">{{list.gateSix}}</i>
					</li>-->
					<li class="clearFix" :class="{open:list.gateEight=='开启'}">
						<span v-show="list.gateEight=='开启'"></span><i class="fl">抗震防洪舱</i><i class="fr">{{list.gateEight}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateNine=='开启'}">
						<span v-show="list.gateNine=='开启'"></span><i class="fl">防暴反恐舱</i><i class="fr">{{list.gateNine}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateTen=='开启'}">
						<span v-show="list.gateTen=='开启'"></span><i class="fl">消防灭火舱</i><i class="fr">{{list.gateTen}}</i>
					</li>
					<li class="clearFix onlineSplitLine"></li>
					
					<li class="clearFix" :class="{open:list.gateOne=='开启'}">
						<span v-show="list.gateOne=='开启'"></span><i class="fl">1号急救柜</i><i class="fr">{{list.gateOne}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateTwo=='开启'}">
						<span v-show="list.gateTwo=='开启'"></span><i class="fl">2号急救柜</i><i class="fr">{{list.gateTwo}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateThree=='开启'}">
						<span v-show="list.gateThree=='开启'"></span><i class="fl">3号急救柜</i><i class="fr">{{list.gateThree}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateFour=='开启'}">
						<span v-show="list.gateFour=='开启'"></span><i class="fl">4号急救柜</i><i class="fr">{{list.gateFour}}</i>
					</li>
					<li class="clearFix" :class="{open:list.gateFive1=='开启'}">
						<span v-show="list.gateFive1=='开启'"></span><i class="fl">5号急救柜</i><i class="fr">{{list.gateFive1}}</i>
					</li>
			</ul>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: 'portState',
		data(){
			return{
				curr:'',
				timer:"",
				list:{},//舱门状态(0 关闭|1 打开|2 打开中)
			}
		},
		beforeDestroy(){
			clearInterval(this.timer);
		},
		methods:{		
			show(item){
				var vm=this;
				vm.curr=1;
				vm.list={
					uuid:item.uuid,
					gateOne: "--",
					gateTwo: "--",
					gateThree: "--",
					gateFour: "--",
					gateFive1:'--',
					gateFive:"--",//急救柜
					gateSeven:"--",//通讯保障舱
					gateSix:"--",//担架舱
					gateEight:"--",//抗震防洪
					gateNine:"--",//反恐防爆舱
					gateTen:"--",//消防救援舱
				}				
				vm.getshelterInfoNew();
				clearInterval(this.timer);
				this.timer=setInterval(vm.getshelterInfoNew,4000);
			},
			getshelterInfoNew() { //获取方舱消息消息
				var vm=this;
				var params = {
					shelterUuid: vm.list.uuid
				};
				this.$axios.post('edu/home/cshelterInfoNew', params,{headers:{noLoading:true}})
					.then((res) => {
						var item=res.data;
						vm.getInfoSuccess(item);
					})
			},
			getInfoSuccess(item){
				var vm=this;
				for( var k in vm.list ){
					if(k!='uuid'){
						if(item.online=='离线'){
							vm.list[k]="--"
						}else{
							if(item[k]=="1"){
								vm.list[k]="开启"
							}else{
								vm.list[k]="关闭"
							}
						}
					}
					
				}
				this.$set(vm.list,'online',item.online);
				this.$set(vm.list,'uuid',item.uuid);
			},
			close(){
				this.curr='';		
				clearInterval(this.timer);
			}
		}
	}
</script>

<style lang="scss">
.SMshelter .el-dialog{
	width:31rem;
	max-height:20.7rem;
}
.shelterDoorState .el-dialog__body{
	padding-top: 0px;
	padding-bottom: 0px;
	padding-right: 0px;
}
.SMshelter .el-dialog__header{
	text-align: left;
}
.postStateContainer{
	position: relative;
}
.SMshelter .portStateIMg{
	width: 27rem;
    height: 17.5rem;
    background: url(../../../../static/images/shelterDoor/shelter.png) no-repeat 50%;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    background-size: 100%;
    background-position: -6.6rem 2px;
}
.SMshelter .portStateIMg img{
	position: absolute;
	transform-origin:top right;
	display: none;
}
.SMshelter .portStateIMg .dootImg1{
	top: 2.4rem;
    left: 0.6rem;
    transform: rotateY(45deg);
    height: 11.15rem;
    width: 1.5rem;
}
.SMshelter .portStateIMg .dootImg2{
	/*top: 169px;*/
    left: 3.3rem;
    width: 1.9rem;
    height: 0.75rem;
}

.SMshelter .portStateIMg .dootImg2-1{
	top: 8.45rem;
}

.SMshelter .portStateIMg .dootImg2-2{
	top: 9.15rem;
}

.SMshelter .portStateIMg .dootImg2-3{
	top: 9.9rem;
}

.SMshelter .portStateIMg .dootImg2-4{
	top: 10.6rem;
}

.SMshelter .portStateIMg .dootImg2-5{
	top: 11.35rem;
}

.SMshelter .portStateIMg .dootImg3{	
    top: 7.55rem;
    left: 5.55rem;
    width: 2.6rem;
    height: 5.85rem;
}
.SMshelter .portStateIMg .dootImg4{
	top: 2.85rem;
    left: 8.8rem;
    width: 2.25rem;
    height: 10.25rem;
}
.SMshelter .portStateIMg .dootImg5{
	top: 3rem;
    left: 11.4rem;
    width: 2.05rem;
    height: 9.8rem;
}
.SMshelter .portStateIMg .dootImg6{
	top: 3.05rem;
    left: 13.8rem;
    width: 1.85rem;
    height: 9.4rem;
}
.SMshelter .portStateIMg .openAni{
	display: block;
	animation:openDoot 2s infinite;
}
.SMshelter .portStateList{
	width:10.6rem;
	padding: 2rem 0.8rem;
	background:rgba(28,36,58,1);
}
.SMshelter .portStateList li{
	line-height: 2rem;
	position:relative;
	margin: 0px 0.95rem 0px 1.45rem;
}
.SMshelter .portStateList li.onlineSplitLine{
	border-top: 1px solid #343D56;
	margin: 1.5rem 0px;
}
.SMshelter .portStateList .open i{
	color:#D0533F;
}

.SMshelter .portStateList li i{
	color:#ccc;
}
.SMshelter .portStateList li span{
	position:absolute;
	width: 0.9rem;
	height: 0.9rem;
	left: -1.2rem;
	top: 50%;
	transform: translateY(-50%);
	background: url(../../../../static/images/shelterDoor/tip.png) no-repeat center;
}
@keyframes openDoot{
	from{
		transform:rotateY(0deg);
	}
	to{
		transform: rotateY(130deg);
	}
}
</style>
