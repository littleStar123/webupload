<template>
	<div class="gdul_sidebar">
		<ul class="nav">
			<li>
				<router-link to="/main"><i class="iconfont">&#xe621;</i>全部文件</router-link>
			</li>
			<li>
				<a href="#"><i class="iconfont">&#xe666;</i>最近</a>
			</li>
			<li>
				<a href="#"><i class="iconfont">&#xe600;</i>文档</a>
			</li>
			<li>
				<a href="#"><i class="iconfont">&#xe617;</i>图片</a>
			</li>
			<li>
				<a href="#"><i class="iconfont">&#xe7bb;</i>视频</a>
			</li>
			<li>
				<router-link to="/bin"><i class="iconfont">&#xe63f;</i>回收站</router-link>
			</li>
		</ul>
		<div class="volume">
			<p>用户容量<span class="fr">5G/15G</span></p>
			<div class="bar"><span style="width:20%;"></span></div>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'v-menu',
        methods: {
			
		}
    };
</script>

<style>

</style>