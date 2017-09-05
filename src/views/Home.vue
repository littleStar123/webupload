<template>
	<div>
		<div class="gdul_header">
			<a href="#"><img src="../assets/images/gdul_zblogo.png"></a>
		</div>
		<div class="gdul_body clearfix">
			<v-menu></v-menu>
			<div class="gdul_main">
				<transition name="fade" mode="out-in">
					<router-view v-on:listenOver="listenOver"></router-view>
				</transition>
			</div>
		</div>
		<div class="coverbg" v-if="showOver"></div>
	</div>
</template>

<script>
	import vMenu from './include/Menu.vue'
	export default {
		data() {
			return {
				showOver: false
			}
		},
		components: {
			vMenu
		},
		methods: {
			listenOver(isShow){
				this.showOver = isShow;
			}
		}
	}
</script>

<style>

</style>