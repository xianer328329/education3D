<template>
	<div class="phone">
		<div class="department fl">
			<h5 class="fl">校内应急联动部门</h5>
			<ul class="fr">
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
			</ul>
		</div>
		<div class="department other fr">
			<h5 class="fl">行政事业协同应急部门</h5>
			<ul class="fr">
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
				<li>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
					<p><span>院长办公室</span><i>18524578901</i></p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'EmergencyDepartmentphone'
}
</script>

<style lang="stylus" scoped>
.phone{width:1422px; position:absolute; left:21px; bottom:21px; background:#0A314E;}
.department h5{height:240px;font-size:16px;color:#fff; width:42px; background:#1577BA; box-sizing: border-box; padding:33px 13px;}
.department ul{width:662px;}
.department ul li{width:100%; height:80px;}
.department ul li:nth-of-type(1){background:#0B3A5E;}
.department ul li:nth-of-type(3){background:#0B3A5E;}
.department li p{display:inline-block;font-size:14px; width:24%;box-sizing: border-box; padding:0 10px; margin-top: 20px; }
.department li p span{display:block;color:#75CBF2; background: url(../../../../static/images/BUMEN.png) no-repeat left; padding:0 20px; margin-bottom: 2px;}
.department li p i{display:block;font-family:"DIN Medium"; color: #fff; background: url(../../../../static/images/phone.png) no-repeat left; padding:0 20px}
.other li p span{background: url(../../../../static/images/house.png) no-repeat left;}
.other h5 {padding:15px 13px;}
</style>