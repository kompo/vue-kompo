import Komponent from './Komponent'

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
        }
	},
    methods: {
        closeModal(){
            this.$emit('closeModal')
        },
        confirmModal(){
            this.$emit('confirmModal')
        },
    }

}