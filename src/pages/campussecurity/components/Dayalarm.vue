<template>
	<div class="h-container">
		<h4 class="boxtitle">当日告警</h4>
		<div class="backboxContainer vertical-middle-c">
			<div class="box h-focus-swipper  vertical-middle" id="certify">
				<div class="swiper-container swiper-container-horizontal">
					<div class="swiper-wrapper stop-swiping" :style="{'visibility':loading?'visible':'hidden'}">
						<div class="swiper-slide" v-for="(item,index) in names" :key="item.uuid+index">
							<div class="boxReflect">
								<a href="javascript:;"></a>
								<div class="tit">
									<p class="Z-numberf">{{typeof(details[item.uuid])=='undefined'?'--':details[item.uuid]}}</p>
									<img src="../../../../static/images/img4.png">	
									<span>{{item.paramsNote}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="swiper-pagination"></div>
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			</div>
		</div>
	</div>
</template>
<script>	
//	import Swiper from "swiper";
	import Swiper from 'swiper/dist/js/swiper.js';
	import 'swiper/dist/css/swiper.min.css';
	export default {
		data() {
			return {
				names:[],
				details:{},//报警详情数组
				loading:false,
			}
		},
		mounted: function() {	
			this.getAlarmName();
		},
		methods: {
			//获取告警
			getAlarmName(){
				var vm=this;
				var promise1=new Promise(function(resolve,reject){
					var params={
						"paramsName": "al_campussecurity_monito",
						"pageName": "/campussecurity"
					}
					vm.$axios.post('/monitor/dGetAccessModule',params).then((res) => {
						var data = res || [];
						if(data.length>0){
							while(data.length<5){
								data=data.concat(data);
							}
						}
						vm.names=data;
						resolve();
					});
				});
				var promise2=new Promise(function(resolve,reject){
					vm.$axios.post('/home/monitorInfo').then((res) => {
						var data = res || [];
						vm.details=data;
						resolve();
					})
				});
				Promise.all([promise1,promise2]).then(res=>{
					vm.initSwipper();
				})
			},
			initSwipper(){
				var vm=this;
				this.$nextTick(function(){
//					$('#certify .No_access').remove();
					new Swiper('#certify .swiper-container', {
						watchSlidesProgress: true,
						slidesPerView: 'auto',
						loopedSlides:7,
						centeredSlides: true,
						loop: true,
						speed: 500,
					    slideToClickedSlide: true,
						autoplay: true,
						autoplay: {
						    disableOnInteraction: false,
					    },
					    noSwiping:false,//是否禁止滑动
						noSwipingClass:'stop-swiping',
						navigation: {
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						},
						on: {
							progress: function(progress) {
								vm.loading=true;
								for (var i = 0; i < this.slides.length; i++) {
									var slide = this.slides.eq(i);
									var slideProgress = this.slides[i].progress;
									var modify = 1;
									if (Math.abs(slideProgress) > 1) {
										modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
									}

									var translate = slideProgress * modify * 3.1 + 'rem';
									var scale = 1 - Math.abs(slideProgress) /7;//Campussecurity.length
									var zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
									
									slide.transform('translateX(' + translate + ') scale(' + scale + ')');
									slide.children('.boxReflect').transform(' perspective(400px) rotateY('+(25*(slideProgress!=0?(slideProgress/Math.abs(slideProgress)):0))+'deg)');
									slide.css('zIndex', zIndex);
									slide.css('opacity', 1);
									if (Math.abs(slideProgress) >= 3) {
										slide.css('opacity', 0);
									}
								}
							},
							setTransition: function(transition) {
								for (var i = 0; i < this.slides.length; i++) {
									var slide = this.slides.eq(i)
									slide.transition(transition);
								}
					
							}
						}
					
					})
				})
			}
		}

	}
</script>
<style lang="scss" scoped="scoped">
.h-container{
	height: 100%;
	position: relative;
	.backboxContainer{
		overflow: hidden;
	}
}
.boxtitle{
	color:#75CBF2;
	padding-bottom: 0.35rem;
}

</style>
<style lang="scss">
	/*自定义swipper*/

	.h-focus-swipper {
		position: relative;
		width: 100%;
		margin: 0 auto;
		&,*{
			user-select: none;
		}
	}
	
	.h-focus-swipper .swiper-container {
		padding-bottom: 2.5rem;
	}
	
	.h-focus-swipper  .swiper-slide{
		width: 7.9rem;
	    height: 8.8rem;
		&.swiper-slide-active{
			a{
				 background:#003D60;
				 border:1px solid #00A7A7;
			}
			.tit{
				p{
				    color: #FFCC00;
				    font-size: 1.5rem;
				}
				span{
					font-size: 0.8rem;
					color: #00FFFF;
				}
			}
			.boxReflect{
				transform: rotate(0deg) !important;
			}
		}
		.boxReflect{
			width: 100%;
			height: 100%;
			-webkit-box-reflect: below 0 -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.65, transparent), to(rgba(0,0,0,0.4)));
		}
		a{
			position: absolute;
			left:0;
			top:0;
			right: 0px;
			bottom: 0px;
			border-radius: 4px;
			background:#013655;
			cursor: pointer;
			border: 1px solid rgba(49,133,156,0.5);	
		}
		.tit{
		    width: 100%;
		    position: absolute;
		    z-index: 2;
		    top: 46%;
		    left: 50%;
		    transform: translate(-50%,-50%);
		    text-align: center;
		    p{
			    width: 100%;
			    color:rgba(255, 204, 0, 0.6);
			    font-size: 1.2rem;
			    white-space: nowrap;
			}
			img{
				width: 80%;
				margin: 0.25rem auto;
			}
			span{
				display: block;
				font-size: 0.6rem;
				color: #75CBF2;
				white-space: nowrap;
			}
		} 
	}
	
	.h-focus-swipper .swiper-pagination {
		width: 100%;
		bottom: -1.25rem;
		top: auto;
		text-align: center;
		z-index: 1;
	}
	
	.h-focus-swipper .swiper-pagination-bullets .swiper-pagination-bullet {
		margin: 0 0.25rem;
		border: 0.2rem solid #08304A;
		background-color: #d5d5d5;
		width: 0.75rem;
		height: 0.75rem;
		opacity: 1;
		vertical-align: middle;
		padding: 0px;
		border-radius: 100%;
	}
	
	.h-focus-swipper .swiper-pagination-bullets .swiper-pagination-bullet-active {
		border: 0.2rem solid #0478B7;
		background-color: #fff;
	}
	.h-focus-swipper{
		cursor: pointer;
		.swiper-button-prev,.swiper-button-next{
			margin-top: -1.9rem;
			user-select: none;
			opacity: 0;
			transition: all 0.5s linear;
			outline: none;
		}
		&:hover{
			.swiper-button-prev,.swiper-button-next{
				opacity: 1;
			}
		}
	}
	.h-focus-swipper .swiper-button-prev,.h-focus-swipper .swiper-button-next{
		width:1.75rem;
		height: 1.75rem;
		background-size:1.5rem !important;
	}
	.h-focus-swipper .swiper-button-prev {
		left: 0px;		
		background: url(../../../../static/images/lb/left.png) no-repeat 50%;		
	}
	.h-focus-swipper .swiper-button-next {
		right: 0px;
		background: url(../../../../static/images/lb/right.png) no-repeat 50%;
	}
</style>
