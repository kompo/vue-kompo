import "@babel/polyfill"; //for IE..

window._ = require('lodash');

window.$ = window.jQuery = require('jquery');

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Vue from 'vue/dist/vue'
window.Vue = Vue

// Kompo packages
require('vue-kompo')
require('kompo-ckeditor')
require('kompo-googlemaps')
//require('kompo-trix')

const app = new Vue({ el: '#app' });