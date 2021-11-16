import Komponent from '../../form/mixins/Komponent'

export default {
    mixins: [ Komponent ],
	computed: {

        $_togglerAttributes(){
            return this.$_isFromBlade ? {
                is: 'div'
            } : {
                is: {template: '<div>'+this.$_label+'</div>'}
            }
        },

        $_isFromBlade(){
            return this.$slots.default
        },

        $_fullLabel(){
            return this.$_label+(this.$_loading ? '<i class="icon-spinner"></i>' : '')
        },
        
        $_attributes() { return this.$_defaultOtherAttributes },
        $_defaultOtherAttributes() { 
            return !this.$_isFromBlade ? {
                    ...this.$_defaultElementAttributes,
                    style: this.$_elementStyles,
                    class: this.$_classes
                } : 
                {} //Hack: class & style are applied on blade (needed for initial load not glitching) 
        },
        $_customClassArray() { return [
            this.$_config('active')
        ] },

        $_menuItemHref(){
            return (this.component.href && this.component.href != 'javascript:void(0)') ? 
                this.component.href : ''
        },
        $_menuItemHrefAttributes(){
            if(!this.$_menuItemHref)
                return { is: 'div' }

            return Object.assign({ is: 'a', href: this.$_menuItemHref }, 
                this.component.target ? {target: this.component.target} : {},
            )
        }
	},
    methods: {
        $_clickAction(){
            
            this.$emit('click')
            
            this.$_runOwnInteractions('click')
            
            this.$_revertPanel()
            this.$_revertFormRow()

        },

    }

}