import Element from '../../form/mixins/Element'

export default {
    mixins: [ Element ],
	computed: {

        $_fullLabel(){
            return this.$_label+(this.$_loading ? '<i class="icon-spinner"></i>' : '')
        },
        
        $_attributes() { return this.$_wrapperAttributes },
        $_wrapperAttributes() {
            return {
                ...this.$_defaultElementAttributes,
                style: this.$_elementStyles,
                class: this.$_classes,
            }
        },
        $_togglerAttributes() { 
            return Object.assign({
                    class: this.togglerClass,
                },
                this.$_menuItemHrefAttributes
            )
        },

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