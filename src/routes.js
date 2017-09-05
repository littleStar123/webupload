import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Bin from './views/Bin.vue'

let routes = [{
	path: '/',
	component: Home,
	name: 'home',
	children: [{
		path: '/main',
		component: Main,
		name: 'main'
	},{
		path: '/bin',
		component: Bin,
		name: 'bin'
	}],
	hidden: true
}];

export default routes;