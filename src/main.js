import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import root from './root.vue';

Vue.use(Vue2TouchEvents);
Vue.config.devtools = false;
Vue.config.performance = true;
Vue.config.productionTip = false;
Vue.config.silent = false;

new Vue(root).$mount('#root');
