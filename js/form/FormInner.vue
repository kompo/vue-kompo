<template>
    <component v-bind="formAttributes">
        <template v-for="component in komponents">
            <component v-bind="$_attributes(component)"/>
        </template>
        <vl-support-modal :kompoid="$_elKompoId" />
    </component>
</template>

<script>
import Layout from './mixins/Layout'
import Alert from '../core/Alert'
import IsKomposer from '../mixins/IsKomposer'
import DoesAxiosRequests from '../form/mixins/DoesAxiosRequests'
import TurboClick from '../core/TurboClick'

export default {
    mixins: [Layout, IsKomposer, DoesAxiosRequests],

    data(){
        return {
            canSubmit: true,
            jsonFormData: null,
            refreshing: false,
        }
    },
    created() {
        this.$_configureEcho()
        this.$_saveLiveKomposer()
    },

    computed: {
        formAttributes(){
            return {
                ...this.$_defaultElementAttributes,
                is: this.$_komposerTag(this.component) == 'vl-form' ? 'form' : 'div',
                class: this.$_classString([
                    this.$_phpClasses,
                    this.$_komposerTag(this.component) == 'vl-form' ? 'vlForm' : 'vlView',
                ]),
                style: this.$_elementStyles,
            }
        },

        emitFormData(){ return this.$_config('emitFormData') },

        formUrl(){ return this.$_config('submitUrl') },
        formMethod(){ return this.$_config('submitMethod') },
        validationErrorAlert(){ return this.$_config('validationErrorAlert') },
        submitAction(){ return this.$_config('submitAction') },

        redirectUrl(){ return this.$_config('redirectUrl') },
        redirectMessage(){ return this.$_config('redirectMessage') }
    },

    methods: {
        preSubmit(){
            if(this.emitFormData)
                this.$emit('submit', this.jsonFormData)
        },
        submitSuccess(r, submitKomponent){

            this.$emit('success', r, submitKomponent)
            
            //redirect route predefined in form
            if(this.redirectUrl){
                this.setRedirecting()
                setTimeout( () => {this.redirect(this.redirectUrl)}, 300)
            }
            //redirect route coming from controller
            if(this.formUrl != r.request.responseURL){

                if(this.component.noTurbo) {
                    setTimeout( () => {this.redirect(r.request.responseURL)}, 50)

                }else{
                    new TurboClick(this.$vnode).displayResponse(r)
                }
            }
            //check responseInModal() helper
            if(r.data.inModal)
                this.$kompo.vlModalShowFill('modal'+this.$_elKompoId, r.data.message || r.data)

            if(r.status === 202){
                this.$_destroyEvents()
                this.$_removeLiveKomposer()
                this.$emit('refreshForm', r.data)
            }
        },
        submitError(e){
            this.$emit('error', e)

            if (e.response.status == 422){
                
                this.$_validate(e.response.data.errors)

                if(this.validationErrorAlert)
                    new Alert(this.validationErrorAlert).asError().emitFrom(this)
                
            }
        },
        getJsonFormData(){
            var jsonFormData = {}
            this.$_fillRecursive(jsonFormData)
            return jsonFormData
        },
        setRedirecting(){
            this.$_state({ redirecting: this.redirectMessage })
        },
        redirect(url) {
            window.location.href = url
        },
        $_echoTrigger(){

            if(this.refreshing)
                return

            this.refreshing = true

            this.$_kAxios.$_refreshSelf(this.formUrl).then(r => {
                
                this.$_destroyEvents()
                this.$_removeLiveKomposer()
                this.$emit('refreshForm', r.data)
                
                this.refreshing = false
            })
        },

        $_attachEvents(){
            this.$_vlOn('vlPreSubmit'+this.$_elKompoId, () => {
                this.preSubmit()
            })
            this.$_vlOn('vlSubmitSuccess'+this.$_elKompoId, (response, submitKomponent) => {
                this.submitSuccess(response, submitKomponent)
            })
            this.$_vlOn('vlSubmitError'+this.$_elKompoId, (error) => {
                this.submitError(error)
            })
            this.$_vlOn('vlToggle'+this.$_elKompoId, (toggleId) => {
                this.$_toggle(toggleId)
            })
            this.$_vlOn('vlUpdateErrorState'+this.$_elKompoId, () => {
                var errors = []
                this.$_getErrors(errors)
            })
            this.$_vlOn('vlDeliverJsonFormData'+this.$_elKompoId, (toComponentId) => {
                this.$_deliverJsonTo(toComponentId, this.getJsonFormData())
            })
            this.$_vlOn('vlToggleSubmit'+this.$_elKompoId, (canSubmit) => {
                this.canSubmit = canSubmit
            })
            this.$_vlOn('vlRequestKomposerInfo'+this.$_elKompoId, (askerId) => {

                if(!this.$_isLive)
                    return

                this.jsonFormData = this.getJsonFormData()
                this.$kompo.vlDeliverKomposerInfo(askerId, this.$_elKompoId, {
                    canSubmit: this.canSubmit,
                    jsonFormData: this.jsonFormData,
                    url: this.formUrl, 
                    method: this.formMethod,
                    action: this.submitAction,
                    kompoinfo: this.$_kompoInfo,
                })

            })
            this.$_vlOn('vlRefreshKomposer'+this.$_elKompoId, (responseData) => {
                this.$_destroyEvents()
                this.$_removeLiveKomposer() //no need to save after because created() is called
                this.$emit('refreshForm', responseData)
            })

            this.$_deliverKompoInfoOn()
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlPreSubmit'+this.$_elKompoId,
                'vlSubmitSuccess'+this.$_elKompoId,
                'vlSubmitError'+this.$_elKompoId,
                'vlToggle'+this.$_elKompoId,
                'vlUpdateErrorState'+this.$_elKompoId,
                'vlDeliverJsonFormData'+this.$_elKompoId,
                'vlToggleSubmit'+this.$_elKompoId,
                'vlRequestKomposerInfo'+this.$_elKompoId,
                'vlRefreshKomposer'+this.$_elKompoId,
                this.$_deliverKompoInfoOff
            ])
        }

    }
}

</script>
