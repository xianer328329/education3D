<template>
	<div class="module indexPage">
		<div class="section-left">			
			<back-box class="border-anim">
				<!-- class="setGrey"-->
				<Basic-infor></Basic-infor>
				<index-fire authName="al_index_fire_fire_home_alarmtrend" authDesc="校园消防" class="NO_Auth"></index-fire>
			</back-box>
			<back-box class="border-anim">
				<index-security authName="al_index_home_campussecurity" authDesc="校园安防" class="NO_Auth"></index-security>
			</back-box>
			<back-box class="">
				<index-traffic authName="al_index_traffic" authDesc="车辆管控" class="NO_Auth"></index-traffic>				
			</back-box>
			<back-box class="border-anim">				
				<index-staff authName="al_index_peopleControl" authDesc="人员管控" class="NO_Auth"></index-staff>
			</back-box>
		</div>
		<div class="section-bottom">
			<back-box class="border-anim" v-for="(item,k) in selectedModules" :key="k">
				<component :is="item.name" :authDesc="k"  :authName="item.authName" :class="item.class"></component>
			</back-box>
			<back-box class="border-anim" v-for="(item,k) in 4" :key="k" v-if="count==0"></back-box>
		</div>
	</div>
</template>

<script>
/* eslint-disable */

import IndexFire from './components/fire'
import IndexSecurity from './components/security'
import IndexTraffic from './components/traffic'
// import IndexFood from './components/food'
// import IndexFood from './components/food(2)'
import IndexLife from './components/life'
import IndexElectricity from './components/electricity'
// import IndexEnergy from './components/energy'
import IndexChemical from './components/Chemical'
// import IndexChemical from './components/Chemical(2)'
import IndexOperation from './components/operation'
import fireOperation from './components/fireOperation'
import BasicInfor from './components/BasicInformation'
import IndexStaff from './components/staff'

export default {
	name: 'Index',
	components: {
		IndexFire,//校园消防
		IndexSecurity,//校园安防
		IndexTraffic,//车辆管控
		// IndexFood,//数据安全
		IndexLife,//就餐
		// IndexEnergy,//能耗监管
		IndexChemical,//宣教应急
		IndexOperation,//安防运维
		fireOperation,//消防运维
		BasicInfor,//基础信息
		IndexStaff,//人员管控
		IndexElectricity,//用电安全
	},
	data(){
		return{
			count:0,
			selectedModules:{},
			defaultModules:{
				'宣教应急':{
					name:'IndexChemical',
					authName:'al_index_shelter',
					class:'NO_Auth'
				},
				'用电安全':{
					name:'IndexElectricity',
					authName:'al_index_elec',
					class:'NO_Auth'
				},
				'安防运维':{
					name:'IndexOperation',
					authName:'al_index_security_maintenance',
					class:'NO_Auth'
				},
				'消防运维':{
					name:'fireOperation',
					authName:'al_index_FIRE_MAINTENANCE',
					class:'NO_Auth'
				},
			},			
			modules:{
				'校园就餐':{
					name:'IndexLife',
					authName:'al_index_traffic_life',
					class:'NO_Auth'
				},
			},
		}
	},
	mounted:function(){
		moduleType=0;
		this.modules={...this.defaultModules,...this.modules}
		this.getConfigs();
	},
	methods:{
		getConfigs(){
			this.$axios.post(process.env.API_OHTTPH + "system/dict/aqueryList", {
				"dictType":UNITID,
				"dictName": '首页模块'
			}).then(res => {
				var data=res || [],selectedModules={};
				this.count=4;
				if(data.length<4){
					selectedModules={...this.defaultModules};
				}else{
					data.forEach(item=>{
						if(this.modules[item.dictValue]){
							selectedModules[item.dictValue]=this.modules[item.dictValue]
						}
					})
				}
				this.selectedModules=selectedModules;
				this.$nextTick(()=>{
					addAuthList()
				})
			}).catch(res=>{
				this.$nextTick(()=>{
					addAuthList()
				})
			})  
		},  
	}
}
</script>

<style lang="scss" scoped>
	.map-index{
		.section-left>.Z-border{
			width: 23.125%;
			height: 21.851%;
			&:nth-last-of-type(2){
				bottom: 21.851%;
			}
			&:nth-last-of-type(3){
				bottom: 43.702%;
			}
			&:nth-last-of-type(4){
				bottom: 65.553%;
			}
		}
		.section-bottom>.Z-border{
			width: 18.177%;
			height: 21.851%;
			&:nth-of-type(2){
				left: 18.177%;
			}
			&:nth-of-type(3){
				left: 36.354%;
			}
			&:nth-of-type(4){
				left: 54.531%;
			}
		}
	}
</style>

<style lang="scss">
	// 切换标签样式
	.indexPage{
		.Zslide .el-carousel__indicator.is-active button{
			border:none !important;
		}
		.el-carousel__indicator:hover button{
			opacity: 1 !important;
		}
		.amountBoxUp .amount span{
			max-width:8rem;
			margin-left: auto !important;
			margin-right: auto !important;
		}
	}
</style>