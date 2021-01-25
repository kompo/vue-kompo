import KompoAxios from './KompoAxios'
import Alert from './Alert'
import TurboClick from './TurboClick'

export default class Action {
	constructor(action, vue){

        this.actionConfig = action.config
		this.vue = vue
        
        this.warningConfirmed = false

		this.actionType = action.actionType
        this.interactions = action.interactions

        this.$_kAxios = new KompoAxios(this)

	}
    $_config(key){
        return this.actionConfig[key] || null
    }
	run(parameters){
        if(!this.actionType)
            return

		var actionFunction = this.actionType + 'Action'
        this[actionFunction](
            parameters ? parameters.response : null, 
            parameters ? parameters.parentAction : null, 
            parameters ? parameters.payload : null
        ) 
	}
    axiosRequestAction(r, p, payload){
    	this.vue.$_state({ loading: true })
        this.vue.$kompo.vlToggleSubmit(this.vue.kompoid, false) //disable submit while loading

        this.$_kAxios.$_actionAxiosRequest(payload)
        .then(r => {

			this.vue.$_state({ loading: false })
            this.vue.$kompo.vlToggleSubmit(this.vue.kompoid, true)

            this.vue.$_runInteractionsOfType(this, 'success', r)


        }).catch(e => {

            this.vue.$_state({ loading: false })

            this.handleErrorInteraction(e)

        })
    }
    browseQueryAction(){
        this.vue.$_state({ loading: true })
        this.vue.$kompo.vlBrowseQuery(this.$_config('kompoid') || this.vue.kompoid, this.$_config('page'))
    }
    refreshKomposerAction(r, pa, payload){

        this.vue.$_state({ loading: true })

        this.getAsArray(this.$_config('kompoid'), this.vue.kompoid).forEach(kompoid => {

            this.vue.$kompo.vlRefreshKomposer(
                kompoid, 
                this.$_config('route'), 
                payload, 
                // The komposer here is loading, but now we are about to leave the realm of this komposer
                // And go to the context of the komposer being refreshed
                () => this.vue.$_state({ loading: false }) //It's amazing that this executes "this" context in another file...
            )
        })
    }
    submitFormAction(){
        
        this.vue.$_state({ loading: true })
        this.vue.$_state({ isSuccess: false })
        this.vue.$_state({ hasError: false })

        this.vue.$kompo.vlRequestFormInfo(this.vue.kompoid, this.vue.$_elKompoId)

        if(!this.vue.formInfo.canSubmit){
            setTimeout( () => { this.submitFormAction() }, 100)
            return
        }

        this.vue.$kompo.vlPreSubmit(this.vue.kompoid)

        if(!this.vue.formInfo.url)
            return
        
        this.$_kAxios.$_submitFormAction()
        .then(r => {

            this.vue.$_state({ loading: false })
            this.vue.$_state({ isSuccess: true })

            this.vue.$kompo.vlSubmitSuccess(this.vue.kompoid, r, this.vue)
            this.vue.$_runInteractionsOfType(this, 'success', r)

        })
        .catch(e => {

            this.vue.$_state({ loading: false })
            this.vue.$_state({ hasError: true })

            if(e.response.status == 449){
                if(confirm(e.response.data)){
                    this.warningConfirmed = true
                    this.submitFormAction()
                }
            }else{
                this.vue.$kompo.vlSubmitError(this.vue.kompoid, e)

                if (e.response.status !== 422) //handled in vlSubmitError
                    this.handleErrorInteraction(e)
            }
            
        })
    }
    sortQueryAction(){
        this.vue.$_state({ 
            activeSort: true,
            loading: true
        })
        if(this.vue.customBeforeSort)
            this.vue.customBeforeSort()

        this.vue.$kompo.vlSort(this.vue.kompoid, this.vue.$_sortValue, this.vue.$_elKompoId)
    }
    emitFromAction(response){
        this.vue.$_vlEmitFrom(this.$_config('event'), Object.assign(
            this.$_config('emitPayload') || {}, 
            this.vue.$_getJsonValue || {} 
        ))
    }
    emitDirectAction(response){
    	this.vue.$emit(this.$_config('event'), response ? response.data : null)

        this.vue.$_runInteractionsOfType(this, 'success')
    }
    toggleElementAction(){
        if(this.$_config('toggleId'))
            this.vue.$kompo.vlToggle(this.vue.kompoid, this.$_config('toggleId'))
    }
    hideSelfAction(){
        this.vue.$_toggleSelf()
    }
    runJsAction(response){
        const jsFunction = this.$_config('jsFunction')
        this.vue.$nextTick(() => { //yep, run it if you find it
            
            if(window[jsFunction])
                window[jsFunction](response) 

            if(this.vue[jsFunction]) //never used yet but maybe one day. The idea is interesting
                this.vue[jsFunction](response) 
        })
    }
    fillModalAction(response){
    	var modalName = this.$_config('modalName') || (this.vue.kompoid ? 'modal'+this.vue.kompoid : 'vlDefaultModal')
        var panelId = this.$_config('panelId') || (this.vue.kompoid ? 'modal'+this.vue.kompoid : 'vlDefaultModal')

        this.vue.$kompo.vlModalShow(modalName, true, this.vue.$_config('warnBeforeClose'))

        this.vue.$nextTick( () => {
        	this.vue.$kompo.vlFillPanel(panelId, response.data.message || response.data)
        })
    }
    modalInsertAction(response){
        this.vue.$kompo.vlModalInsert(
            this.vue.kompoid, 
            {
                vkompo: response.data,
                is: 'VlEditLinkModalContent',
                index: this.vue.index,
                kompoid: this.vue.kompoid,
                keepModalOpen: this.vue.$_config('keepModalOpen')
            }, 
            {
                warn: this.vue.$_config('warnBeforeClose')
            }
        )
    }
    fillPanelAction(response, parentAction){
        this.vue.$kompo.vlFillPanel(this.$_config('panelId'), response.data, this.$_config('included') || parentAction.$_config('included'))
    }
    fillSlidingPanelAction(response){
        this.vue.$kompo.vlFillSlidingPanel(response)
    }
    addAlertAction(){
        new Alert().asObject(this.$_config('alert')).emitFrom(this.vue)
    }
    fillAlertAction(response){
        new Alert().asObject({
            ...this.$_config('alert'),
            message: response.data
        }).emitFrom(this.vue)
    }
    redirectAction(response){
    	if(this.$_config('redirectUrl') === true){
            setTimeout( () => { this.redirect(response.request.responseURL) }, 300)
        }else if(this.$_config('redirectUrl')){
            setTimeout( () => { this.redirect(this.$_config('redirectUrl')) }, 300)
        }
    }

    /* internal */
    redirect(url){
        if(this.vue.component && this.vue.component.turbo){
            new TurboClick(this.vue.$vnode, url).trigger()
        }else{
            window.location.href = url
        }
    }
    getPayloadForStore() {
        return Object.assign(
            this.$_config('ajaxPayload') || {}, 
            this.vue.$_getJsonValue || {} 
        )
    }
    getFormData() {
        var formData = new FormData(), jsonFormData = this.vue.formInfo.jsonFormData
        for ( var key in jsonFormData ) {
            formData.append(key, jsonFormData[key])
        }
        if(this.warningConfirmed)
            formData.append('kompoConfirmed', this.warningConfirmed)
        return formData
    }
    handleErrorInteraction(e){
        if(this.vue.$_hasInteractionsOfType(this, 'error')){
           this.vue.$_runInteractionsOfType(this, 'error', e)
        }else{
           this.$_kAxios.$_handleAjaxError(e) 
        }
    }

    /* utils */
    getAsArray(data, fallback){
        return data ? (_.isArray(data) ? data : [data]) : [fallback]
    }
}