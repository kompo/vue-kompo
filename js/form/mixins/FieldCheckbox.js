import Field from '../mixins/Field'
export default {
    mixins: [Field],
    computed: {
        $_attributes(){
            return {
                ...this.$_defaultFieldAttributes,
                'aria-checked': this.checked
            }
        },
        $_events(){
            return {
                ...this.$_defaultFieldEvents,
                'keydown.prevent.space.enter': this.toggle, // keydown is not working with v-on object binding
                'click': this.toggle,
            }
        },
        checked() {
            return Boolean(this.$_value)
        },
        checkedClass(){
            return this.checked ? 'vlChecked' : ''
        },
    },
    methods: {
        toggle() {
            if(this.$_readOnly)
                return

            this.handleToggle()
        },
        handleToggle(){
            this.component.value = !this.checked
            this.changed()
        },
        $_fill(jsonFormData){
            jsonFormData[this.$_name] = this.$_value ? 1 : 0
        },
        changed(){

            setTimeout(() => { //when label is clicked somehow we need to wait before $_value is set...
                this.$_changeAction()
                this.$_clearErrors()

                this.$emit('changed', this.$_value)

                this.$_state({ dirtyField: this.checked})
            }, 50)
        },
        $_focusAction(){
            //do nothing
            this.$_updateFieldState(true)
        },
        $_blurAction(){
            //do nothing
            this.$_updateFieldState(false)
        },
    },
}