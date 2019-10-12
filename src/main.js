import Vue from 'vue';
import root from './root.vue';

Vue.config.devtools = false;
Vue.config.performance = true;
Vue.config.productionTip = false;
Vue.config.silent = false;

new Vue(root).$mount('#root');
