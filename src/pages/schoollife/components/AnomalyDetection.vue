<template>
	<div class="anomal">
		<h4 class="boxtitle">异常检测</h4>
		<div class="Z-C backboxContainer">
			<div class="Z-C1 clearFix fl">
				<ul class="Z-gjc1List F-numberf" id="plateScreen">
					<li class="Z-key1">2018110802</li>
					<li class="Z-key2">2018110802</li>
					<li class="Z-key3">2018110802</li>
					<li class="Z-key4">2018110802</li>
					<li class="Z-key5">2018110802</li>
					<li class="Z-key6">2018110802</li>
					<li class="Z-key7">2018110802</li>
					<li class="Z-key8">2018110802</li>
					<li class="Z-key9">2018110802</li>
				</ul>
			</div>
			<div class="Z-C2 clearFix">
				<ul class="F-C2List F-numberf" id="Z-C2List">
					<li class="clearFix F-on" v-for="(item,index) in 5">
						<div><i>{{index+1}}</i><span></span><b></b></div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped="scoped">
	.anomal .boxtitle {
		color: #75CBF2;
	}
	
	.anomal .F-numberf {
		font-family: "DIN Medium";
	}
	
	.anomal .Z-gjc1List {
		margin: 0 auto;
		position: relative;
	}
	
	.anomal .F-C2List {
		height: 100%;
		overflow: auto;
	}
	
	.anomal .Z-C1 {
		width: 10rem;
		height: 100%;
		margin-right: 0.5rem;
	}
	
	.anomal .Z-C2 {
		overflow: hidden;
		height: 100%;
	}
	
	.anomal .F-on {
		color: #00ffff;
	}
	
	.anomal .Z-gjc {
		float: left;
		width: 260px;
		overflow: hidden;
		position: relative;
	}
	
	.anomal .Z-gjc1List {
		position: relative;
		height: 100%;
	}
	
	.anomal .Z-gjc1List li {
		font-size:0.7rem;
		color: #ED7703;
		opacity: 0.1;
		position: absolute;
		top: 0px;
		left: 0px;
	}
	
	.anomal .Z-gjc1List li {
		animation: Z-key 10s linear infinite;
	}
	
	.anomal .Z-gjc1List .Z-key1 {
		animation-duration: 5s;
		left: 0px;
		top: 6.4%;
	}
	
	.anomal .Z-gjc1List .Z-key2 {
		animation-duration: 8s;
		left: 30%;
		top: 16.8%;
	}
	
	.anomal .Z-gjc1List .Z-key3 {
		animation-duration: 9s;
		left: -3.5%;
		top: 26.4%;
	}
	
	.anomal .Z-gjc1List .Z-key4 {
		animation-duration: 10s;
		left: 12.5%;
		top: 37.6%;
	}
	
	.anomal .Z-gjc1List .Z-key5 {
		animation-duration: 16s;
		left: -5%;
		top: 49.2%;
	}
	
	.anomal .Z-gjc1List .Z-key6 {
		animation-duration: 3s;
		left: 30%;
		top: 60.8%;
	}
	
	.anomal .Z-gjc1List .Z-key7 {
		animation-duration: 12s;
		left: 7.5%;
		top: 62.8%;
	}
	
	.anomal .Z-gjc1List .Z-key8 {
		animation-duration: 4s;
		left: -7.5%;
		top: 79.2%;
	}
	
	.anomal .Z-gjc1List .Z-key9 {
		animation-duration: 16s;
		left: 25%;
		top: 74%;
	}
	.anomal .F-C2List li{
		height: 20%;
	}
	.anomal .F-C2List li>div{
		padding-bottom:0.2rem;
		padding-top: 0.4rem;
		border-bottom: 1px solid rgba(0, 255, 255, 0.5);
		color: #75CBF2;
		cursor: pointer;
	}
	.anomal .F-C2List li span {
		font-size:0.8rem;
		vertical-align:sub;
	}
	.anomal .F-C2List li i {
		display: inline-block;
		width: 1.2rem;
		padding: 0.2rem 0px;
		border: 1px solid #75CBF2;
		border-radius: 0.2rem;
		text-align: center;
		margin-right: 0.5rem;
		font-size:0.8rem;
	}
	
	.anomal .F-C2List li b {
		float: right;
		width: 3.5rem;
		display: inline-block;
		text-align: center;
		position: relative;
		height: 100%;
		font-size:0.8rem;
		margin-top: 0.45rem;
		height: 1rem;
	}
	
	.anomal .F-C2List li b:before,
	.F-C2List li b:after {
		content: '';
		position: absolute;
		left: 0px;
		bottom: -1px;
		width: 7px;
		height: 6px;
		background-color: rgba(255, 255, 255, 0.2);
	}
	
	.anomal .F-C2List li b:after {
		left: auto;
		right: 0px;
	}
	
	.anomal.F-on li.active {
		border-bottom: 1px solid #00FFFF;
	}
	
	.anomal.F-on li.active * {
		color: #00FFFF;
	}
	
	.anomal .F-C2List li.active i {
		border: 1px solid rgba(0, 255, 255, 1);
	}
	
	.anomal .F-C2List li.active b:before,
	.F-C2List li.active b:after {
		background-color: #00FFFF;
	}
	
	@keyframes Z-key {
		0% {
			transform: scale(0.4, 0.4) translate(0, 0);
			opacity: 0;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: scale(1.4, 1.4) translate(1rem, 0.75rem);
			opacity: 0;
		}
	}
</style>