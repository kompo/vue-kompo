import Komponent from '../../form/mixins/Komponent'

export default {
    mixins: [ Komponent ],
	computed: {

        $_wrapperClass() {
            return this.$_defaultCssClass()
        },

        $_fullLabel(){
            return this.$_label+(this.$_loading ? '<i class="icon-spinner"></i>' : '')
        },
        
        $_attributes() { return this.$_togglerAttributes },
        $_togglerAttributes() { 
            return Object.assign({
                    ...this.$_defaultElementAttributes,
                    style: this.$_elementStyles,
                    class: this.$_classString([ this.$_phpClasses ].concat(this.$_customClassArray)),
                },
                this.$_menuItemHrefAttributes
            )
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