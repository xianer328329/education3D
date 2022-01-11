<template>
	<div class="" style="display: none;">
		<div class="fireEngine" ref="fireEngine">
			<div class="header">
				<p>{{list.iconName}}</p>									
				<img class="closeFireEngine" src="../../../static/images/Zgb.png" alt="" />
			</div>
			<div class="content">
				<dl>
					<dt>设备编号</dt>
					<dd>{{list.deviceCode}}</dd>
				</dl>
				<dl>
					<dt>生产日期</dt>
					<dd>{{list.startTime}}</dd>
				</dl>
				<dl>
					<dt>到期日期</dt>
					<dd>{{list.endTime}}</dd>
				</dl>
				<dl v-if="list.deviceMod">
					<dt>设备型号</dt>
					<dd>{{list.deviceMode}}</dd>
				</dl>
				<dl>
					<dt>设备品牌</dt>
					<dd>{{list.deviceBrand}}</dd>
				</dl>
				<dl>
					<dt>生产厂家</dt>
					<dd>{{list.deviceFactory}}</dd>
				</dl>
				<dl v-if="list.position">
					<dt>详细位置</dt>
					<dd>{{list.position}}</dd>
				</dl>
				<dl>
					<dt>所在楼层</dt>
					<dd>{{list.deviceFloor}}</dd>
				</dl>
				<dl v-if="list.urls&&list.urls.length>0">
					<dt>图片</dt>
					<dd>
						 <el-image :src="item" v-for="(item,i) in list.urls" :key="i" fit="contain" class="img" :preview-src-list="list.urls"></el-image>
					</dd>
				</dl>
			</div>
		  </div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				list:{}
			}
		},
		methods:{
			show(list){
				var vm=this;
				list.urls=[];
				if(list.devicePicpath){
					var urls=list.devicePicpath.split(';');
					urls.forEach(item=>{
						if(item){
							list.urls.push('http://interface.cqtss.net:13019/hdInterface/'+item);
						}
					})
				}
				this.list=list;
				return new Promise((resolve,reject)=>{
					this.$nextTick(()=>{
						resolve(vm.$refs.fireEngine)
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.fireEngine{
		width: 16rem;
		color: #75CBF2;
		*{font-size: 0.8rem;}
		.header{
			background: #0a3f5e;				
			line-height: 1.5rem;
			padding-left: 1rem;
			position: relative;
			.closeFireEngine{
				position: absolute;
				top: .2rem;
				right: .5rem;
				width: 1.1rem;
				height: 1.1rem;
				cursor: pointer;
			}
		}
		.content{
			background-color: #001525;
			padding: 0.5rem 1rem;
			max-height: 18rem;
			overflow: auto;
			dl{
				margin-bottom: 0.3rem;
				overflow: hidden;
				dt{
					float: left;
					margin-right: 0.5rem;
					min-width: 4rem;
					text-align: right;
				}
				dd{
					overflow: hidden;
					color: #0ff;
					word-break: break-all;
				}
			}
			.img{
				width: 3rem;
				height: 4rem;
				margin-right: 0.5rem;
				margin-bottom: 0.5rem;
				background-color: #EEEEEE;
			}
		}
	}
</style>
