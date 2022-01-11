<template>
	<div class="h-aside-c">
		
		<ul class="typeRight">
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc1.png" alt="" /></div>
				<p class="taxon fl">接入学校</p>
				<p class="num fr">23<small>所</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc2.png" alt="" /></div>
				<p class="taxon fl">覆盖师生</p>
				<p class="num fr">35<small>万人</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc3.png" alt="" /></div>
				<p class="taxon fl">建筑总数</p>
				<p class="num fr">578<small>栋</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc4.png" alt="" /></div>
				<p class="taxon fl">本年能耗累计<i>(标准煤)</i></p>
				<p class="num fr">578<small>万吨</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc5.png" alt="" /></div>
				<p class="taxon fl">本年用电累计</p>
				<p class="num fr">--<small>万kWh</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc6.png" alt="" /></div>
				<p class="taxon fl">本年用水累计</p>
				<p class="num fr">--<small>万吨</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc7.png" alt="" /></div>
				<p class="taxon fl">上年生均能耗</p>
				<p class="num fr">--<small>kgce/生</small><i>同比（--%）</i></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc8.png" alt="" /></div>
				<p class="taxon fl">上年平均建筑能耗</p>
				<p class="num fr">--<small>kgce/m²</small><i>同比（--%）</i></p>
			</li>
			
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc9.png" alt="" /></div>
				<p class="taxon fl">接入微型消防站</p>
				<p class="num fr">19<small>个</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc10.png" alt="" /></div>
				<p class="taxon fl">接入消防控制室</p>
				<p class="num fr">25<small>个</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc11.png" alt="" /></div>
				<p class="taxon fl">接入危化源数量</p>
				<p class="num fr">--<small>个</small></p>
			</li>
			<li class="clearFix">
				<div class="imgBox fl"><img  src="../../../../static/images/mapc12.png" alt="" /></div>
				<p class="taxon fl">接入沼气池数量</p>
				<p class="num fr">27<small>个</small></p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
	
		data(){
			return {
				
			}
		},
		mounted(){
			this.navanim()
		},
		methods:{
			navanim(){
			var sec=0;
			$('.typeRight li').each(function(){
				//$(this).css('transform','translate(-200px,0)');
				sec+=0.2;
				$(this).css({'animation':'navi 10s '+sec+'s linear  infinite'});
			})	
		}
		}
	}
</script>

<style lang="scss">

.h-aside-c{
	position: absolute;
	right: 20px;
	top:65px;
	bottom: 0px;
}	
.h-aside-c ul li{
	width:450px;
	height:70px;
	background:#07334e;
	margin-bottom: 10px;
	transform-origin:center
}
.h-aside-c li .imgBox{
	height:100%;
	width:60px;
	background:#357599;
}
.h-aside-c li .imgBox img{
	margin: 0 auto;
	margin-top:22px;
}
.h-aside-c li  .taxon{
	width:156px;
	height:100%;
	padding-left:30px;
	color:#75CBF2;
	font-size:16px;
	line-height: 70px;
	background: url(../../../../static/images/linemapc.png) no-repeat right;
}
.h-aside-c li  .taxon i{
	display:block;
	font-size:14px;
	color:#31859C;
	line-height: 15px;
    margin-top: -23px;
    margin-left: 21px;
}

.h-aside-c li  .num i{
	display:block;
	font-size:14px;
	color:#31859C;
	line-height: 15px;
    margin-top: -23px;
   
}
.h-aside-c li .num{
	font-size: 22px;
    color: #ff9900;
    font-weight: bold;
    line-height:70px;
    margin-right:10px;
}
.h-aside-c li .num small{
	font-size:14px;
	color:#75CBF2;
	margin-left:8px;
	    width: 65px;
    display: inline-block;
}
@keyframes navi{
  0% {
  	transform:rotateX(0deg);
  	-ms-transform:rotateX(0deg); 	/* IE 9 */
-moz-transform:rotateX(0deg);	/* Firefox */
-webkit-transform:rotateX(0deg); /* Safari 和 Chrome */
 
  	}
  10%{
  	transform:rotateX(360deg);
  		-ms-transform:rotateX(360deg); 	/* IE 9 */
-moz-transform:rotateX(360deg);	/* Firefox */
-webkit-transform:rotateX(360deg); /* Safari 和 Chrome */
 
  }	
  100% {
    transform:rotateX(360deg);
    	-ms-transform:rotateX(360deg); 	/* IE 9 */
-moz-transform:rotateX(360deg);	/* Firefox */
-webkit-transform:rotateX(360deg); /* Safari 和 Chrome */
 
  }
  
} 
</style>
