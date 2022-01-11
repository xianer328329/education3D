<template>
	<div class="h-pager">
	  <el-pagination
	    layout="next,slot"
	    :total="tableData.total" @current-change="changePage" :current-page="tableData.currentPage" :page-size="tableData.pageSize">
	   		<el-button class="end" @click="lastPage"></el-button>
	  </el-pagination>
	  <span class="page-count">共{{Math.ceil(tableData.total/tableData.pageSize)}}页</span>
	  <el-pagination
	    layout="slot,prev,jumper"
	    :total="tableData.total" @current-change="changePage" :current-page="tableData.currentPage" :page-size="tableData.pageSize">
	   		<el-button  class="first" @click="firstPage"></el-button>
	  </el-pagination>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				tableData:{}
			}
		},
		props:{
			pager:Object
		},
		watch:{
			pager(newvalue){
				this.tableData=newvalue;
			}
		},
		mounted(){
			this.tableData=this.pager;
		},
		methods:{
			lastPage(){
				if(this.tableData.currentPage<Math.ceil(this.tableData.total/this.tableData.pageSize)){
					this.tableData.currentPage=Math.ceil(this.tableData.total/this.tableData.pageSize);
					this.changePage(this.tableData.currentPage);
				}
			},
			firstPage(){
				if(this.tableData.currentPage!=1){
					this.tableData.currentPage=1;
					this.changePage(this.tableData.currentPage);
				}
			},
			changePage(page){
				this.tableData.currentPage=page;
				this.$emit('pageChange',JSON.stringify(this.tableData));
			}
		}
	}
</script>

<style>
</style>