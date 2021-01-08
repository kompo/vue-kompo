import {VueMasonryPlugin} from 'vue-masonry'
import TurboClick from './js/core/TurboClick'

const Kompo = {
  	install (Vue, options = {}) {

  		const files = require.context('./js/', true, /\.vue$/i)
		files.keys().map(key => Vue.component('Vl'+key.split('/').pop().split('.')[0], files(key).default))

    	this.events = new Vue()
		
		Vue.use(VueMasonryPlugin)

		Vue.prototype.$kompo = {
			vlEmitFrom(kompoid, event, parameters){
				Kompo.events.$emit('vlEmit'+kompoid, event, parameters)
			},
			vlSort(kompoid, sortValue, emitterId){
				Kompo.events.$emit('vlSort'+kompoid, sortValue, emitterId)
			},
			vlPreview(kompoid, index){
				Kompo.events.$emit('vlPreview'+kompoid, index)
			},
			vlPreSubmit(kompoid){
	    		Kompo.events.$emit('vlPreSubmit'+kompoid)
	    	},
			vlSubmitSuccess(kompoid, response, submitKomponent){
	    		Kompo.events.$emit('vlSubmitSuccess'+kompoid, response, submitKomponent)
	    	},
			vlSubmitError(kompoid, error){
	    		Kompo.events.$emit('vlSubmitError'+kompoid, error)
	    	},
			vlBrowseQuery(kompoid, page, initialFilter){
	    		Kompo.events.$emit('vlBrowseQuery'+kompoid, page, initialFilter)
	    	},
	    	vlRefreshKomposer(kompoid, url, payload, successFunc){
	    		Kompo.events.$emit('vlRefreshKomposer'+kompoid, url, payload, successFunc)
	    	},
	    	vlToggle(kompoid, toggleId){
	    		Kompo.events.$emit('vlToggle'+kompoid, toggleId)
	    	},
	    	vlUpdateErrorState(kompoid){
	    		Kompo.events.$emit('vlUpdateErrorState'+kompoid)
	    	},
	    	vlDeliverJsonFormData(kompoid, toComponentId){
	    		Kompo.events.$emit('vlDeliverJsonFormData'+kompoid, toComponentId)
	    	},
	    	vlToggleSubmit(kompoid, canSubmit){
	    		Kompo.events.$emit('vlToggleSubmit'+kompoid, canSubmit)
	    	},
	    	vlFillPanel(panelId, response, included){
	    		Kompo.events.$emit('vlFillPanel'+panelId, response, included)
	    	},
	    	vlFillSlidingPanel(response){
	    		Kompo.events.$emit('vlFillSlidingPanel', response)
	    	},
	    	vlRequestFormInfo(kompoid, askerId){
	    		Kompo.events.$emit('vlRequestFormInfo'+kompoid, askerId)
	    	},
	    	vlDeliverFormInfo(askerId, formInfo){
	    		Kompo.events.$emit('vlDeliverFormInfo'+askerId, formInfo)
	    	},
	    	vlGetKomposerInfo(komposerId, askerId){
	    		Kompo.events.$emit('vlGetKomposerInfo'+komposerId, askerId)
	    	},
	    	vlDeliverKompoInfo(askerId, kompoInfo){
	    		Kompo.events.$emit('vlDeliverKompoInfo'+askerId, kompoInfo)
	    	},
			vlToggleSidebar(sidebar, elKompoId){
				Kompo.events.$emit('vlToggleSidebar'+sidebar, elKompoId)
			},
			vlToggleSidebarToggler(kompoid){
				Kompo.events.$emit('vlToggleSidebarToggler'+kompoid)
			},
	    	vlModalShow(modal, ajaxContent, warnbeforeclose){
	    		Kompo.events.$emit('vlModalShow' + modal, ajaxContent, warnbeforeclose)
	    	},
	    	vlModalClose(modal){
	    		Kompo.events.$emit('vlModalClose' + modal)
	    	},
	    	vlModalShowFill(modal, html){
	    		Kompo.events.$emit('vlModalShowFill' + modal, html)
	    	},
	    	vlModalInsert(kompoid, componentProps, modalProps){
	    		Kompo.events.$emit('vlModalInsert' + kompoid, componentProps, modalProps)
	    	},
	    	vlAlertShow(alert){
	    		Kompo.events.$emit('vlAlertShow', alert)
	    	},
	    	events : this.events
	    }

    	Vue.directive('click-out', {
			bind: function (el, binding, vnode) {
				el.clickOutsideEvent = function (event) {
					if (!(el == event.target || el.contains(event.target))) 
					    vnode.context[binding.expression](event)
				}
				document.body.addEventListener('click', el.clickOutsideEvent)
			},
			unbind: function (el) {
				document.body.removeEventListener('click', el.clickOutsideEvent)
			}
		})

		Vue.directive('turbo-click', {
			bind: function (el, binding, vnode) {
				el.turboClickEvent = function (e) {

					if(el.href == 'javascript:void(0)' || el.target == '_blank' || e.ctrlKey)
						return

					if(el == e.target || el.contains(e.target)){

						var url = el.href.split('#'),
							currentUrl = window.location.href.replace(window.location.hash, '')
						if(url.length == 2 && url[0] == currentUrl)
							return

						e.preventDefault()

						new TurboClick(vnode, el.href).trigger()
			        }
				}

				if(binding.value !== false) //when v-turbo-click="false" don't bind
					el.addEventListener('click', el.turboClickEvent)
			},
			unbind: function (el) {
				el.removeEventListener('click', el.turboClickEvent)
			}
		})

	}
}
export default Kompo

Vue.use(Kompo)