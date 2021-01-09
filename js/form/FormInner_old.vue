<template>
    <div v-bind="formAttributes" class="vlForm">
        <form>
            <template v-for="component in komponents">
                <component v-bind="$_attributes(component)"/>
            </template>
        </form>
        <vl-support-modal :kompoid="$_elKompoId" />
    </div>
</template>

<script>
import Layout from './mixins/Layout'
import Alert from '../core/Alert'
import IsKomposer from '../mixins/IsKomposer'
import DoesAxiosRequests from '../form/mixins/DoesAxiosRequests'

export default {
    mixins: [Layout, IsKomposer, DoesAxiosRequests],

    data(){
        return {
            canSubmit: true,
            jsonFormData: null
        }
    },

    computed: {
        formAttributes(){
            return {
                ...this.$_defaultElementAttributes,
                class: this.$_phpClasses,
                style: this.$_elementStyles
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
                this.setRedirecting()
                setTimeout( () => {this.redirect(r.request.responseURL)}, 300)
            }
            //check responseInModal() helper
            if(r.data.inModal)
                this.$kompo.vlModalShowFill('modal'+this.$_elKompoId, r.data.message || r.data)

            if(r.status === 202){
                this.$_destroyEvents()
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
            this.$_vlOn('vlRequestFormInfo'+this.$_elKompoId, (askerId) => {
                this.jsonFormData = this.getJsonFormData()
                this.$kompo.vlDeliverFormInfo(askerId, {
                    canSubmit: this.canSubmit,
                    jsonFormData: this.jsonFormData,
                    url: this.formUrl, 
                    method: this.formMethod,
                    action: this.submitAction
                })
            })
            this.$_vlOn('vlRefreshKomposer'+this.$_elKompoId, (url, payload, successFunc) => {
                this.$_kAxios.$_refreshSelf(url, payload).then(r => {
                    this.$_destroyEvents()
                    this.$emit('refreshForm', r.data)

                    successFunc && successFunc()
                })
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
                'vlRequestFormInfo'+this.$_elKompoId,
                'vlRefreshKomposer'+this.$_elKompoId,
                this.$_deliverKompoInfoOff
            ])
        }

    }
}

</script>
