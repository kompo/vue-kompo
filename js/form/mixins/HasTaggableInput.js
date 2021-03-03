export default {
    data(){
        return {
            inputValue: ''
        }
    },
    computed: {
        $_taggableInputAttributes() {
            return {
                selections: this.$_value || [], 
                multiple: this.$_multiple || false,
                readonly: this.$_readOnly,
                kompoid: this.kompoid,
                width: this.$_fixedWidth,
            }
        },
        $_taggableInputEvents(){
            return {
                click: this.$_click,
                remove: this.$_remove
            }
        },
        $_fixedWidth(){
            return this.$_config('fixedWidth')
        }
    },
    methods: {
        $_click(selection){
            if(this.$_readOnly)
                return

            var input = this.$refs.input.$el || this.$refs.input
            input.click()
            input.focus()
            this.inputValue = this.$_bestGuessLabelFromSelection(selection)
        },
        $_remove(index) {
            if(this.$_readOnly)
                return
                
            this.$_emptyInput()
            this.component.value.splice( index, 1)
            this.$_blurAction()
            this.$_changeAction()
        },
        $_emptyInput() {
            this.inputValue = ''
        },
        $_bestGuessLabelFromSelection(selection)
        {
            if(!selection)
                return ''

            if(selection.label){
                if(_.isString(selection.label))
                    return selection.label 

                if(selection.label.label && _.isString(selection.label.label))
                    return selection.label.label
            }

            return ''
        }
    },
}