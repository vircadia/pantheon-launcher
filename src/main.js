/*
    main.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Vircadia contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

// import * as Sentry from '@sentry/electron';
// Sentry.init({dsn: 'https://def94db0cce14e2180e054407e551220@sentry.vircadia.dev/3'});

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { store } from './plugins/store';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import moment from 'moment-timezone'

import jstz from './assets/js_modules/jstz.min.js';
Object.defineProperty(Vue.prototype, '$jstz', { value: jstz });
Object.defineProperty(Vue.prototype, 'moment', { value: moment });

Vue.config.productionTip = false

new Vue({
	vuetify,
	store,
	render: h => h(App)
}).$mount('#app')