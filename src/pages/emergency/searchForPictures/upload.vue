<template>
		<div class="searchForPictures-upload">
			<div class="top-container">
				<div class="img">
					<!--  accept="image/*  image/jpg,image/jpeg" -->
					<el-upload class="avatar-uploader" action="" :show-file-list="false" accept="image/*" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<template v-else>
							<img src="../../../../static/images/emergency/searchForPictures/img.png"  class="placeholder"/>
							<p>点击上传图片</p>
						</template>
					</el-upload>
				</div>
				<div class="flex1">
					<el-form label-width="8rem" label-position="left">
						<el-form-item label="告警日期">
							<el-date-picker v-model="d"  type="daterange" :clearable="false" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
						</el-form-item>
						<el-form-item label="相似度大于">
							<el-input-number :min="60" :max="100" v-model="search.faceSimilarity" :controls="false"></el-input-number><i class="percent">%</i>
						</el-form-item>
					</el-form>
					<el-button type="primary" class="searchBtn" @click="query">查询</el-button>
				</div>
			</div>
			<div class="fr">
				<img src="../../../../static/images/emergency/searchForPictures/list-active.png" class="display-icon" v-if='display==2'/>
				<img src="../../../../static/images/emergency/searchForPictures/list.png" class="display-icon" v-else  @click="display=2"/>
				
				<img src="../../../../static/images/emergency/searchForPictures/card-active.png" class="display-icon" v-if='display==1'/>
				<img src="../../../../static/images/emergency/searchForPictures/card.png" class="display-icon" v-else  @click="display=1"/>
			</div>
			
			<div class="results flex1" ref="results" @scroll="scroll">
				<div class="container" :class="{'lists':display==2,'card':display==1}">
					<div class="item" v-for="item in lists" :key="item.uuid">
						<el-image  fit="cover" :src="item.snapImage" :preview-src-list="[item.snapImage]" class="faceUrl"></el-image>
						<div class="content" @click="showMapInfoBox(item)">
							<p :title="item.deviceName">{{item.deviceName||''}}</p>
							<p :title="item.captureTime">{{item.captureTime||''}}</p>
							<p :title="item.faceSimilarity">相似度 {{item.faceSimilarity||''}}%</p>
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
			startDate.setTime(startDate.getTime()-7*24*60*60*1000);
			return{
				imageUrl:'',
				files:'',
				display:1,//列表显示方式 1card、2列表
				loading:false,
				lists:[],//列表
				d:[startDate.Format('yyyy-MM-dd'),new Date().Format('yyyy-MM-dd')],//告警日期
				search:{
					"currentPage": 1,
					"pageSize": 12,
					faceSimilarity:80
				},
				total:0,//总条数
				req:'',//请求地址
			}
		},
		props:{
			row:{
				type:Object,
				default:()=>{}
			},
			curr:{
				// type:Number,
				// default:()=>1
			}
		},
		mounted() {
			this.loading=false;
			this.files='';
			this.search.currentPage=1;
			if(this.curr==1){
				this.imageUrl='';
				this.search.facePicUrl='';
			}else{
				this.imageUrl=this.row.facePicUrl||'';
				this.search.facePicUrl=this.row.facePicUrl||'';
				this.d=this.row.d;
				this.query();
			}
			let videoUrl=JSON.parse(localStorage.getItem('videoUrl')||'[]');
			if(videoUrl.length>1){
				this.req=videoUrl[1].params_value
			}else{
				this.$message.error('未配置以图搜图的请求地址')
			}
		},
		methods:{
			query(){
				this.search.currentPage=1;
				this.searchForPictures();
			},
			async searchForPictures(){
				if(this.files){
					if(!this.search.facePicUrl)this.search.facePicUrl=await this.uploadFile();
				}else{
					if(!this.search.facePicUrl){
						this.$message.error('请选择图片');
						return;
					}
				}
				this.loading=true;
				let params={
					...this.search,
					// "facePicUrl": 'https://edu.cqtss.net:36063/fastdfs/G1/M00/03/8D/wKgBKmE5bZGAKzHlAADgnQkreXI308.jpg',						  
					"beginTime": this.d?(this.d[0]+" 00:00:00"):'',
					"endTime":this.d?(this.d[1]+" 23:59:59"):'',
					'function':'captureSearch'
				}
				
				if(this.files&&this.search.currentPage==1){
					this.$axios.post(this.req,params,(data,mess)=>{
						this.loading=false;
						this.$message.error(mess);
					}).then(res=>{
						this.getLocalData(params);
					})
				}else{
					this.getLocalData(params);
				}
				
			},
			getLocalData(params,filter){
				return this.$axios.post('home/getCaptureSearch',params).then(res=>{
					var lists=(res.data||[]).map(item=>{
						item.alarmTime=item.captureTime;//抓拍时间
						item.blackSimilary=item.faceSimilarity;//相似度
						item.candidateImage=item.faceUrl;//目标图片
						item.snapImage=item.snapImage;//抓拍图片
						return item;
					})
					if(!filter){
						this.lists=this.search.currentPage==1?lists:this.lists.concat(lists);
						this.total=res.total||0;
					}
					this.loading=false;
					return res.data
				})
			},
			scroll(e){
				var resultsRef=this.$refs.results;
				if(resultsRef.scrollHeight-resultsRef.scrollTop-resultsRef.offsetHeight<80){
					var totalPage=Math.ceil(this.total/this.search.pageSize);
					if(totalPage>this.search.currentPage){
						this.search.currentPage+=1;
						this.searchForPictures();
					}
				}				
			},
			showMapInfoBox(row,type){
				var vm=this;
				var params = {
					title:'以图搜图',
					subtitle:'抓拍比对',
					type: "searchForPictures",
					lon:row.longitude,													
					lat:row.latitude,
					personImg: true,
					butCenter:["抓拍图片", "视频回放", "联动视频"],
					rows:{
						'相似度':row.faceSimilarity,
						'设备位置':row.deviceName,
						'设备编号':row.deviceCode,
						'抓拍时间':row.captureTime,
						'当日轨迹':'',
					},
					curr:'showTrack',
					alarmId:row.uuid||'',
					alarmType:this.search.alarmType,
					mess:{
						...row,	
						blackSimilary:row.faceSimilarity,//相似度
						candidateImage:row.faceUrl,//目标图片
						snapImage:row.snapImage,//抓拍图片
					},
					uuid:row.uuid,//告警id
					deviceCode:row.deviceCode,
					deviceUuid:row.deviceUuid,
					buildName:row.deviceName,
					alarmTime:row.alarmTime,
					position:'',
					d:[new Date(row.alarmTime).Format('yyyy-MM-dd'),new Date(row.alarmTime).Format('yyyy-MM-dd')],
					trackFilterFunction:async (d)=>{
						return await vm.getLocalData({
							...vm.search,
							// "facePicUrl": 'https://edu.cqtss.net:36063/fastdfs/G1/M00/03/8D/wKgBKmE5bZGAKzHlAADgnQkreXI308.jpg',
							currentPage:1,
							pageSize:1000,
							"beginTime": d?(d[0]+" 00:00:00"):'',
							"endTime":d?(d[1]+" 23:59:59"):'',
						},'filter')
					},
				}
				if(type=='subClick') return params;
				this.bus.$emit('addMapPop',params)
			},
			beforeAvatarUpload(file) {
				var vm = this;
				const isJPG = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].indexOf(file.type);
				const isLt1M = file.size / 1024 / 1024 < 1;
				if(isJPG == -1) {
					this.$message.error('上传图片只能是 jpg,jpeg,png,gif格式!');
					return;
				}
				if(!isLt1M) {
					this.$message.error('上传图片大小不能超过1MB!');
					return;
				}	
				var fileReader = new FileReader();
				fileReader.onload = function(e) {
					vm.imageUrl = e.target.result;
				}
				fileReader.readAsDataURL(file);
				this.search.facePicUrl='';
				this.files = file;
				return false;
			},
			uploadFile(file) {			  
			  this.loading=true;
			  let params = new FormData();
			  params.append("fileBins", this.files);
			  params.append("fileName", this.files.name);
			  return this.$axios.post("file/nupload", params,(data,mess)=>{				  
				  	this.loading=false;
					this.$message.error(mess);
			  }).then((res) => {
					return process.env.IMG_URL + res.file.filePath;
			  })
			},
		}
	}
</script>

<style lang="scss">
	.searchForPictures-upload{		
		.top-container{
			display: flex;
			margin-top: 1rem;
			position: relative;
			.img{
				display: inline-block;
				width: 8.5rem;
				height: 8.5rem;
				margin-right: 1rem;
			}
			.avatar-uploader .el-upload {
				border: 1px dashed #0B79A3;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				overflow: hidden;
				width: 100%;
				height: 8.5rem;
				display: block;
				text-align: center;
				// margin:4rem auto 0px;
				&:after{
					content: '';
					display: inline-block;
					height: 100%;
					vertical-align: middle;
				}
				img{
					display: inline-block;
					vertical-align: middle;
					max-width: 99%;
					max-height:100%;
				}
				.placeholder{
					width: 2rem;
					height: 2rem;
					margin-top: 2.5rem;
				}
				p{
					font-size: 0.7rem;
					color: #74D4FF;
					margin-top: 1rem;
				}
				&:hover {
					border-color: #409EFF;
				}
			}
			.el-form-item{
				margin-bottom: 0.6rem;
				.el-form-item__label{
					display: block;
					float: none;
				}
				.el-form-item__content{
					margin-left: 0 !important;
				}
				.el-range__close-icon{
					display: none;
				}
				.el-range-input{
					width: 50%;
				}
				.el-input-number{
					width: 4rem;
					line-height: 2rem;
					.el-input__inner{
						padding-left: 0;
						padding-right: 0;
					}
				}
				.percent{
					color: #75CBF2;
					margin-left: 4px;
				}
			}
			.searchBtn{
				position: absolute;
				right: 0;
				bottom: 0.6rem;
				width: 4.2rem;
				z-index: 1;
				padding: 0.5rem 1rem;
			}		
		}
		
		.display-icon{
			float: right;
			width: 1rem;
			margin-left: 0.2rem;
			padding: 0.1rem;
			cursor: pointer;
			margin-top: 1rem;
			margin-right: -0.1rem;
			margin-bottom: 0.5rem;
		}
	}
</style>
