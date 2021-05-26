import Komponent from './Komponent'
import HasName from './HasName'

export default {
    mixins: [ Komponent, HasName ],

    data(){
        return {
            errors: null
        }
    },

    computed: {

        $_placeholder() { return this.component.placeholder },

        $_readOnly(){ return this.$_config('readOnly') },
        $_noAutocomplete(){ return this.$_config('noAutocomplete') },
        $_doesNotFill(){ return this.$_config('doesNotFill') },

        $_emptyValue() { return '' },

        $_value() { return this.component.value },
        $_getJsonValue(){
            var fieldValue = {}
            this.$_fill(fieldValue)
            return fieldValue
        },

        $_sortValue(){ return this.$_getJsonValue[this.$_name] },

        $_pristine() { return !this.$_value },
        $_isFocused(){ return this.$_state('focusedField') },
        $_multiple() { return this.component.multiple },
        
        $_attributes() { return this.$_defaultFieldAttributes },
        $_defaultFieldAttributes() { 
            return Object.assign({
                ...this.$_defaultElementAttributes,
                    id: this.$_elementId() || this.$_elKompoId,
                    name: this.$_name,
                    placeholder: this.$_placeholder,
                    style: this.$_config('inputStyle') || '',
                    class: this.$_config('inputClass') || '',
                    readonly: this.$_readOnly,
                }, this.$_noAutocomplete ? {
                    autocomplete: 'off-'+this.$_elementId(),
                } : {}
            )
        },
        $_events() { return this.$_defaultFieldEvents },
        $_defaultFieldEvents() { return {
            focus: this.$_focusAction,
            blur: this.$_blurAction,
            keyup: this.$_keyupAction,
            change: this.$_changeAction,
            input: this.$_inputAction
        }},
        $_wrapperAttributes(){ return {
            component: this.component,
            errors: this.errors,
            class: this.$_defaultCssClass()
        }},
    },
    methods: {
        $_fillRecursive(jsonFormData){
            if(!this.$_hidden && !this.$_doesNotFill)
                this.$_fill(jsonFormData)
        },
        $_fill(jsonFormData){
            jsonFormData[this.$_name] = _.isNil(this.$_value) ? '' : this.$_value
        },
        $_validate(errors) {
            var errorName = this.$_name.replace('.', '_')
            this.$_setError(errors[errorName])
            if(this.$_multiple)
                this.$_value.forEach( (v,k) => {
                    if(errors[errorName+'.'+k])
                        this.$_setError(errors[errorName+'.'+k], k) //showing the last error only
                })
        },
        $_keyUp(key){}, //to be overriden in komponents when needed
        $_keyupAction(key){
            this.$_keyUp(key)
            this.$_clearErrors()
            
            this.$_runOwnInteractions('keyup')
            if(key.code === 'Enter'){
                if(this.$_config('noSubmitOnEnter')){
                    this.$_runOwnInteractionsWithoutActions('enter', ['submitForm'])
                }else{
                    this.$_runOwnInteractions('enter')
                }
            }
        },
        $_changeAction(){
            this.$kompo.vlUpdateErrorState(this.kompoid)

            this.$_runOwnInteractions('change')

            this.$_clearErrors()

            if (this.$_config('resetAfterChange')) {
                this.$_resetValue()
            }
        },
        $_inputAction(){
            this.debouncedSubmitOnInput()
            this.debouncedFilterOnInput()

            this.debouncedAxiosOnInput()

            //other actions are debounced
            this.$_runOwnInteractionsWithAction('input', 'runJs')
        },
        $_focusAction(){
            if(this.$_readOnly)
                return
            
            this.$_updateFieldState(true)

            this.$_runOwnInteractions('focus')
        },
        $_blurAction(){
            this.$_updateFieldState()
            this.$_runOwnInteractions('blur')
        },
        $_blurActionDelayed(delay){
            setTimeout(()=> this.$_blurAction(), delay || 200)            
        },
        $_updateFieldState(focus = false){
            this.$nextTick( () => {
                this.$_state({ 
                    focusedField: focus,
                    dirtyField: !this.$_pristine
                })
            })
        },
        $_setInitialValue(){
            if(this.$_emptyValue && this.$_pristine)
                this.$_resetValue()
        },
        $_resetValue(){
            this.component.value = _.cloneDeep(this.$_emptyValue)
        },
        $_setError(error, index){
            this.errors = error || null
            this.$_handleError(error, index)
        },
        $_handleError(error, index){
            //to override in Fields.
        },
        $_getErrors(errors) {
            if(this.errors)
                errors.push(this.errors)
        },
        $_clearErrors(){
            if(this.errors)
                this.errors = null
        },
        $_resetSortValue(){
            this.$_resetValue()
        },
        $_attachCustomEvents(){
            this.$_vlOn('vlRequestFieldValue'+this.kompoid+this.$_name, (toComponentId) => {
                const jsonFormData = {}
                this.$_fill(jsonFormData)
                this.$kompo.vlSetFieldValue(toComponentId, jsonFormData[this.$_name])
            })
            this.$_vlOn('vlSetFieldValue'+this.$_elKompoId, (value) => {
                this.elementStore = value
            })
        },
        $_destroyCustomEvents(){
            this.$_vlOff([
                'vlRequestFieldValue'+this.kompoid+this.$_name,
                'vlSetFieldValue'+this.$_elKompoId,
            ])
        },
    },
    mounted(){
        this.$_updateFieldState()
        if(this.$_toggleOnLoad)
            this.$_togglesForm()        

        this.$_runOwnInteractions('load')

        /* To delete: unless a justification is found
        this.$_runOwnInteractionsWithAction('load', 'axiosRequest')
        */
    },
    created() {
        this.$_setInitialValue()
        this.vkompo.$_setError = this.$_setError
    }
}
