import Element from './Element'

export default {
    mixins: [ Element ],
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
        closePanel(){
            this.$emit('closePanel')
        },
        confirmSubmit(){
            this.$emit('confirmSubmit')
        },
    }

}