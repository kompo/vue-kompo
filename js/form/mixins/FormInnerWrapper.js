import BaseElement from '../../element/mixins/BaseElement'

export default {
    mixins: [BaseElement],

    data(){
        return {
            formKey: 0
        }
    },
    
    props: {
        success: {}, //injected javascript function to be executed on success
        error: {} //injected javascript function to be executed on error
    },

    computed: {
        $_attributes(){
            return {
                vkompo: this.component,
                key: this.formKey,
            }
        },
        $_events(){
            return {
                refreshForm: this.refreshForm,
                submit: this.submit,
                success: this.successEvent,
                error: this.errorEvent,
                touchedForm: this.touchedForm,
            }
        }
    },

    methods: {
        refreshForm(form){
            this.component = form
            this.formKey += 1
        },
        submit(jsonFormData){
            this.$emit('submit', jsonFormData)
        },
        reloadFreshForm(){
            this.component = Object.assign({}, this.vkompo)
            this.formKey += 1
        },
        successEvent(response, submitElement){
            this.$emit('success', response, submitElement)

            if(submitElement.$_getFreshForm)
                this.reloadFreshForm()

            if(this.success) //Injected javascript function to be executed on success
                this.success(response)
        },
        errorEvent(response, submitElement){
            this.$emit('error',response, submitElement)
            if(this.error) //Injected javascript function to be executed on error
                this.error(response)
        },
        touchedForm(){
            this.$emit('touchedForm')
        },

        $_attachEvents(){
            this.$_vlOn('vlEmit'+this.$_elKompoId, (eventName, eventPayload) => {
                this.$emit(eventName, eventPayload)

                if(this.kompoid)
                    this.$_vlEmitFrom(eventName, eventPayload)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlEmit'+this.$_elKompoId,
            ])
        }
    }
}