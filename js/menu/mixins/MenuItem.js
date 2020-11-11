import Komponent from '../../form/mixins/Komponent'

export default {
    mixins: [ Komponent ],
	computed: {
        
        $_attributes() { return this.$_defaultOtherAttributes },
        $_defaultOtherAttributes() { 
            return {
                ...this.$_defaultElementAttributes,
                style: this.$_elementStyles,
                class: this.$_classes
            }
        },
        $_customClassArray() { return [
            this.$_data('active')
        ] },
	}

}