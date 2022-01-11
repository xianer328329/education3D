<template>
	<div>
		<h4 class="mdTitle">本年累计</h4>
		<div class="accumul backboxContainer">			
			<div class="accLeft fl vertical-middle-c">
				<div class="vertical-middle">
					<h6>总能耗</h6><span class="standard">(标准煤)</span>
					<ul class="amountCom amountBoxUp">
						<li class="amount">
							<div class="amount-content">
								<span><i>1.63</i>万吨</span>
								<p>同比<em>↓ 2.35%</em></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="accRight fr flex flex-column space-between">
				<div class="accRightT">
					<div class="fl vertical-middle-c">
						<h6 class="vertical-middle">累计用电</h6>
					</div>
					<ul class="amountCom amountBoxUp">
						<li class="amount">
							<div class="amount-content">
								<span><i>1728</i>万kWh</span>
								<p>同比<em>↓ 0.27%</em></p>
							</div>
						</li>
					</ul>
				</div>
				<div class="accRightT clearFix">
					<div class="fl vertical-middle-c">
						<h6 class="vertical-middle">累计用水</h6>
					</div>
					<ul class="amountCom amountBoxUp">
						<li class="amount">
							<div class="amount-content">
								<span><i>37.6</i>万吨</span>
								<p>同比<em>↓ 0.32%</em></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'EnergAccumulated',
		data() {
			return {

			}
		},
		mounted: function() {

		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	* {
		color: #75CBF2
	}
	
	.standard {
		font-size: 0.6rem;
	}
	.accumul .accLeft {
		width: 40%;
		height: 100%;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		text-align: center;
		box-sizing:border-box;
	}
	
	.accumul .accLeft h6 {
		font-size: 1rem;
	}
	
	.accumul .accRight {
		width: 58%;
		height:100%;
	}
	
	.accumul .accRightT {
		height: 48%;
		background: rgba(10, 63, 94, 1);
		border: 1px solid rgba(10, 80, 122, 1);
		padding: 0 0.7rem;
		box-sizing: border-box;
	}
	
	.accumul .amountBoxUp .amount {
		width: 100%;
		border: none;
		background: none;
	}
	
	.accumul .amountCom .amount span i {
		color: #FF9900;
	}
	.accumul .amountBoxUp .amount p,
	.accumul .amountBoxUp .amount p * {
		color: #0ff;
	}
	
	.accumul .amountBoxUp .amount p em {
		margin-left: 0.75rem;
	}
	.accRightT .fl{
		white-space: nowrap;
	}
	.accRightT .fl,.accRightT ul{
		height: 100%;
	}
	.accRightT .amountBoxUp {
		width: auto;
		overflow: hidden;
		margin-top: 0;
		.amount{
			height: 100%;
		}
	}	
</style>