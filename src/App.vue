<template>
	<div id="app" class="bgZoom">
		<router-view></router-view>
		<router-view name="home"></router-view>
	</div>
</template>

<script>
	export default{
		created() {
			if(process.env.ENV_CONFIG=='sit')document.title='校园安全大数据平台'
			else document.title='教育保障大数据平台'
		},
		methods:{
			
		}
	}
</script>

<style>

</style>