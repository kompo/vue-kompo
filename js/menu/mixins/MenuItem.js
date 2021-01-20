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
	}

}