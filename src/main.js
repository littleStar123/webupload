import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-green/index.css'
import './assets/css/iconfont/gdul_iconfont.css'
import './assets/css/gdul.css'
import './assets/css/webuploader.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
	mode: 'history',
	scrollBehavior: () => ({　　
		y: 0　
	}),
	base: 'filesys',
	linkActiveClass: 'active',
	routes
})

router.beforeEach((to, from, next) => {
//	if(to.path == '/login') {
//		sessionStorage.removeItem('user');
//	}
//	let uid = sessionStorage.getItem('user');
//	if(!uid && to.path != '/login') {
//		next({
//			path: '/login'
//		})
//	} else {
//		next()
//	}
	if(to.path == '/') {
		router.push({
			path: '/main'
		});
	} else {
		next()
	}
})

router.afterEach(transition => {

});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
