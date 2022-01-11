<template>
	<div class="searchForPictures-historyLists">
		<div class="QueryParameters">
			<ul class="Z-QueryList clearFix el-form">
				<li>
					<span class="lable">搜索日期</span>
					<div class="timeQuery">
						<el-date-picker v-model="d" :clearable="false" type="daterange" value-format="yyyy-MM-dd" range-separator="" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
					</div>
				</li>
				<li class="QueryBtn" @click='query'>查询</li>
			</ul>
		</div>
		<div class="flex1 results  clearFix" ref="results" @scroll="scroll">
			<div class="container card">
				<div class="item" v-for="(item,index) in lists" :key="item.uuid" @click="jumpLists(item)">
					<div class="img-container">
						<!--  :preview-src-list="[item.faceUrl]" -->
						<el-image fit="cover" :src="item.faceUrl"  class="faceUrl"></el-image>
						<i class="el-icon-delete delIcon" @click.stop="del(item,index)"></i>
					</div>
					<div class="content">
						<p>{{item.createTime}}</p>
					</div>
				</div>
			</div>
			<div  class="searchForPictures-loading"  v-if="loading">
				<img src="../../../../static/images/emergency/searchForPictures/loading.png"/>
				<p>检索中</p>
			</div>
			<div class="searchForPictures-loading" v-else-if="lists.length==0"><p>暂无数据</p></div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			var startDate=new Date();
			startDate.setTime(startDate.getTime()-30*24*60*60*1000);
			return{
				loading:false,
				lists:[],
				d:[startDate.Format('yyyy-MM-dd'),new Date().Format('yyyy-MM-dd')],//告警日期
				search:{
					"currentPage": 1,
					"pageSize": 12,
				},
				total:0,//总条数
			}
		},
		mounted() {
			this.query();
		},
		methods:{
			query(){
				this.search.currentPage=1;
				this.getLists();
			},
			getLists(){
				let params={
					...this.search,					  
					"beginTime": this.d?(this.d[0]+" 00:00:00"):'',
					"endTime":this.d?(this.d[1]+" 23:59:59"):'',
				}
				this.loading=true;
				this.$axios.post('home/getCaptureSearchHistory',params).then(res=>{
					var lists=res.data||[];
					this.lists=this.search.currentPage==1?lists:this.lists.concat(lists);
					this.total=res.total||0;
					this.loading=false;
				})
			},
			scroll(e){
				var resultsRef=this.$refs.results;
				if(resultsRef.scrollHeight-resultsRef.scrollTop-resultsRef.offsetHeight<80){
					var totalPage=Math.ceil(this.total/this.search.pageSize);
					if(totalPage>this.search.currentPage){
						this.search.currentPage+=1;
						this.getLists();
					}
				}				
			},
			// 删除
			del(item,index){
				this.$confirm("确定删除该搜索记录?", '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  // customClass: "PromptDelete",
				  type: 'warning'
				}).then((res) => {
					this.$axios.post('home/deleteCaptureSearch',{facePicUrl:item.faceUrl}).then(res=>{
						this.lists.splice(index,1);
						this.total--;
					})
				}).catch(()=>{})
				
			},
			jumpLists(item){
				this.$emit('searchCallback',{
					type:2,
					componentName:'upload',
					search:{
						d:null,
						facePicUrl:item.faceUrl,
						currentPage:1,
						pageSize:12
					},
				})
				this.curr='';
			},
		}
	}
</script>

<style lang="scss">
	.searchForPictures-historyLists{
		.QueryParameters{
			padding-left: 0px;
			margin-bottom: 1rem;
			.timeQuery{
				width: 13rem;
			}
			li+li{
				margin-left: 0.5rem;
			}
		}
		.el-form .el-date-editor--daterange.el-input__inner{
			height: 1.4rem;
		}
		.results{
			.item{
				.img-container{				
					position: relative;
					padding-top: 100%;
				}
				.faceUrl{
					position: absolute;
					left: 0px;
					top: 0px;
					bottom: 0px;
					width: 100%;
					z-index: 1;
				}
				p{				
					margin-top: 0.2rem;
					text-align: center;
				}
				.el-image__error, .el-image__placeholder{
					background: transparent !important;
				}
				.delIcon{
					color: #4D91B0;
					position: absolute;
					right: 0.3rem;
					top: 0.3rem;
					font-size: 1.2rem; 
					z-index: 10;
					cursor: pointer;
				}
			}
		}
	}
</style>
