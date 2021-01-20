import Komponent from './Komponent'

export default {
    mixins: [ Komponent ],
	computed: {
        
        $_attributes() { return this.$_defaultTriggerAttributes },
        $_defaultTriggerAttributes() { 
            return {
                ...this.$_defaultElementAttributes,
                style: this.$_elementStyles,
                class: this.$_classes
            }
        },
        $_btnLinkHtml(){
            if(!this.$slots.default)
                return this.$_label+(this.$_loading ? '<i class="icon-spinner"></i>' : '')

            let slotNode = this.$slots.default[0]
            return slotNode.children ? slotNode.children[0].text : null
        },
        showSpinner(){ return this.$_loading },
        showCheckmark(){ return !this.$_loading && this.$_isSuccess },
        showError(){ return !this.$_loading && this.$_hasError },
        showIndicators() { 
            return !this.$_hideIndicators && (this.showSpinner || this.showCheckmark || this.showError)
        }
	},
    methods:{
        $_clickAction(){
            this.$emit('click')
            
            this.$_runOwnInteractions('click')
            
            this.$_revertPanel()
            this.$_revertFormRow()

        },
    },
    mounted(){
        if(this.$_toggleOnLoad)
            this.$_togglesForm()
    }

}