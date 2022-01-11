<template>
		<div class="Z-supervise clearFix">
        	<h5  class="fl">督查督导</h5>
            <div class="fl Z-SupInformation1"><img src="../../../static/images/city/Z29.png" alt=""/><sup class="Z-flicker" style="display:none;">4</sup></div>
            <div class="fl Z-SupInformation2"><img src="../../../static/images/city/Z30.png" alt=""/><sup style="display:none;">4</sup></div>
        </div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: 'supervision',
		data() {
			return {
				
			}
		},
		mounted: function() {
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped="scoped">
.Z-supervise{margin-top: 20px;}
.Z-supervise h5{font-size:28px;background:url(../../../static/images/city/b09.png) no-repeat left 8px; padding-left:36px; color: #cccfd2;}
.Z-supervise div{margin-left:23px; position:relative; font-size:22px; text-align:center; }
.Z-supervise sup{ color:#fff; background:red; border-radius:50%; position:absolute;top:-4px; left:21px; padding:0 6px; height:22px; max-width:42px; line-height:26px;font-family: "DIN Medium"; overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.Z-supervise img{margin-top:7px;}
.Z-supervise .Z-flicker{animation: flicker 1s linear infinite;}
@keyframes flicker {
  0% {
    transform: scale(1);
	opacity:0;
  }
   50% {
    transform:scale(1);
	opacity:1;
  }
  90% {
    transform:scale(1);
	opacity:1;
  }
  100% {
    transform:scale(1);
	opacity:0;
  }
}
</style>