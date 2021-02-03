window._ = require('lodash')

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

if(window.Echo)
	axios.interceptors.request.use((config) => {
	  config.headers['X-Socket-ID'] = window.Echo.socketId() // Echo instance
	  // the function socketId () returns the id of the socket connection
	  return config
	})