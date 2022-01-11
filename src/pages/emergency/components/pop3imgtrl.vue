<template>
	<div class="popshade" v-show="show">
		<div class="Z-3Popout">
			<h5 class="PopoutTop">{{list.subtitle||'图片抓拍'}}({{list.title}})<p class="Z-close" @click="closePop()" ><img src="../../../../static/images/Zgb.png" alt=""/></p></h5>
			<div v-show="list.personImg">
				<h6 class="PopoutTop2 clearFix">
						<p class="fr" v-show="list.mess.handleName=='未处理'">
							<i class="Z-misinformation" v-on:click='handleFun(2)'>误报</i>
							<i class="Z-pigeonhole" v-on:click='handleFun(1)'>归档</i>
							<i style="display:none" class="Z-reporting">上报</i>
						</p>
						<p class="ellipse" :title="list.mess.blackName+list.mess.blackCode+'相似度'+list.mess.blackSimilary+'%'">
							{{list.mess.blackName}}
							<template v-if="list.mess.blackCode">({{list.mess.blackCode}})</template>  
							相似度{{list.mess.blackSimilary}}%
						</p>					
				</h6>
				<div class="Pop3img clearFix" >
					<div class="popimg popimgL fl"><img class="show_img" :src="list.mess.candidateImage" alt="图片加载失败" /><img class="alpha_img" src="../../../../static/images/aa.png" /></div>
					<div class="popimg popimgR fr">
						<img class="show_img" :src="list.mess.snapImage" alt="图片加载失败" /><img class="alpha_img" src="../../../../static/images/aa.png" />
						<div class="carouseLast" style="display:none"></div>
						<div class="carouseNext" style="display:none"></div>
						<div class="carouse" style="display:none"><i class="Z-on"></i><i></i><i></i></div>
					</div>
					<p class="fl"><i>目标图片</i><i>抓拍图片</i></p>
				</div>
			</div>
			<div class="carimg" v-show="!list.personImg&&list.type=='traffic'">
				<img class="show_img" :src="list.mess.picUrl" alt="图片加载失败" /><img class="alpha_img" src="../../../../static/images/aa.png" />
				<p>{{list.mess.carPlate}}</p>
			</div>
			<div class="carimg" v-show="!list.personImg&&list.type=='security'">
				<img class="show_img" :src="list.mess.candidateImage" alt="图片加载失败" /><img class="alpha_img" src="../../../../static/images/aa.png" />
				<p>{{list.mess.blackName}}({{list.mess.blackCode||'--'}})</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'EmergencyPop3imgt',
		data() {
			return {
				show: false,
				list: {
					mess:{}
				}
			}
		},
		methods: {
			closePop() { //关闭弹框
				this.show = false

			},
			handleFun(type) { //误报归档操作
				this.processStatus = false
				var back = {
					type: type,
					list: this.list
				}
				this.show = false
				this.bus.$emit('handleCloseMapPop', back)
				this.bus.$emit('changehandleFun', back)
				
			
			}
		},
		mounted: function() {

			var _this = this;
			this.bus.$on('addPop3img', function(mes) {
				_this.show = true
				_this.list = mes;
				console.log(_this.list)
			})
		}
	}
</script>

<style lang="stylus" scoped>
	.PopoutTop2 {
		font-size: 1rem;
		height: 3.5rem;
		line-height: 3.5rem;
		padding: 0 1rem;
	}
	
	.PopoutTop2 p {
		color: #00ffff;
	}
	.ellipse{
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	.PopoutTop2 p i {
		cursor: pointer;
		display: inline-block;
		font-size: 0.9rem;
		color: #fff;
		height: 1.6rem;
		border-radius: 2px;
		text-align: center;
		line-height: 1.6rem;
		padding: 0 0.5rem;
		margin-left: 1rem;
	}
	
	.Z-3Popout .Pop3img {
		width: 43rem;
		margin: 0 auto;
	}
	
	.Z-3Popout .popimg {
		width: 21rem;
		height: 21rem;
		border: 1px solid #38c1ff;
		font-size: 0px;
		text-align: center;
	}
	
	.Z-3Popout .Pop3img .show_img {
		max-width: 21.4rem;
		max-height: 21.4rem;
		min-width: 21.3rem;
		min-height: 21.2rem;
		vertical-align: middle;
		display: inline-block;
	}
	
	.Z-3Popout .Pop3img .alpha_img {
		height: 100%;
		width: 1px;
		vertical-align: middle;
		display: inline-block;
	}
	
	.Pop3img p {
		font-size: 0.9rem;
		text-align: center;
		width: 100%;
		margin-top: 0.5rem;
	}
	
	.Pop3img p i {
		color: #fff;
		display: inline-block;
		width: 50%;
	}
	
	.popimgR {
		position: relative;
		margin-left:0px !important;
	}
	
	.popimgR .carouseLast {
		width: 2.5rem;
		height: 5.3rem;
		position: absolute;
		top: 8rem;
		left: 0.5rem;
		background: url(../../../../static/images/zuoyizhang.png) no-repeat center;
	}
	
	.popimgR .carouseNext {
		width: 2.5rem;
		height: 5.3rem;
		position: absolute;
		top: 8rem;
		right: 0.5rem;
		background: url(../../../../static/images/youyizhang.png) no-repeat center;
	}
	
	.popimgR .carouse {
		margin-top: -27px;
	}
	
	.popimgR .carouse i {
		width: 15px;
		height: 15px;
		background: #9b9b9b;
		border-radius: 50%;
		margin: 0 3px;
		display: inline-block;
	}
	
	.popimgR .carouse .Z-on {
		background: #4f4f4f;
	}
	
	#Popout .carimg {
		width: 100%;
		height: 22rem;
		margin-top: 2.5rem;
		text-align: center;
	}
	
	#Popout .carimg .show_img {
		max-width: 99%;
		max-height: 22rem;
		vertical-align: middle;
		display: inline-block;
	}
	
	#Popout .carimg .alpha_img {
		height: 100%;
		width: 1px;
		vertical-align: middle;
		display: inline-block;
	}
	
	#Popout .carimg p {
		font-size: 0.9rem;
		color: #75CBF2;
		text-align: center;
		margin-top: 1rem;
	}
	
	.popshade {
		width: 100%;
		height: 100%;
		content: "";
		display: block;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 9999;
		// background: rgba(0, 0, 0, 0.4);
	}
</style>