<template>
	<el-dialog :title="title" class="SMshelter" :modal-append-to-body="false" :modal="true" :visible="curr!=''" :before-close="close">
		<div class="tab clearFix">
			<p class="fl" :class="{active:active==1}" @click="changeTab(1)">库存装备</p>
			<p class="fl" :class="{active:active==2}" @click="changeTab(2)">异常新增</p>
			<p class="fr active" >{{active==1?'库存总数':'异常总数'}}：{{active==1?matertotal:total}}</p>
		</div>
		<template >
				<el-table :data="materialList"  stripe height="400px"  :highlight-current-row="true" v-show="active==1">
					<el-table-column prop="equipClassify" label="装备分类" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="standard" label="标配库存">
					</el-table-column>
					<el-table-column prop="actual" label="实际库存">
						<template slot-scope="scope">
							<span :class="{'unnormal':scope.row.actual!=scope.row.standard}">{{scope.row.actual}}</span>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="expMaterialList"  stripe height="400px"  :highlight-current-row="true"  v-show="active==2">
					<el-table-column prop="equipClassify" label="装备分类" :show-overflow-tooltip="true">
					</el-table-column>
					<el-table-column prop="equipCount" label="数量">
					</el-table-column>
				</el-table>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		name: 'smInventory',
		data(){
			return{
				total:'',
				matertotal:'',
				curr:'',
				title:'',
				active:1,
				uuid:'',
				expMaterialList:null,//异常新增
				materialList:null,//库存装备
			}
		},
		mounted(){
			var vm=this;
		},
		methods:{		
			show(uuid,title){
				var vm=this;
				this.uuid=uuid;
				this.title=title;
				vm.curr=1;
				this.active=1;
				this.getData();
			},
			getData(){
				this.$axios.post('edu/home/bremaEqui', {uuid:this.uuid})
				.then(this.remaEquiSucc)
			},
			remaEquiSucc(res){
				this.expMaterialList=res.expMaterialList||[];//异常新增
				this.materialList=res.materialList||[];//库存装备
				var total=0;
				var matertotal=0;
				this.expMaterialList.forEach((item)=>{
					if(!item.equipCount){
						item.equipCount=0;
					}
					total+=parseInt(item.equipCount);
				})
				var mData=this.materialList;
				this.materialList.forEach((item)=>{
					if(!item.actual){
						item.actual=0;
					}
					matertotal +=parseInt(item.actual);
				})
				this.total=total;
				this.matertotal=matertotal;
			},
			close(){
				this.curr='';
			},
			changeTab(type){
				this.active=type;
				this.getData();
			}
		}
	}
</script>

<style lang="scss">
.SMshelter .el-dialog{
	width:31re,;
	max-height:715px;
	min-height:400px;
	.unnormal{
		color:#FF2F2E !important;
	}
}

.SMshelter .el-message-box{
	background:none !important;
}

.SMshelter .tab {
	margin-bottom:10px;
}
.SMshelter .tab p{
	display: inline-block;
    margin-right: 0.5rem;
    line-height: 1.5rem;
    height: 1.5rem;
    padding:0 0.4rem;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    background-color: #4D5773;
    color:#fff;
}
.SMshelter .tab .active{
	background-color: #D0533F;
}
</style>
