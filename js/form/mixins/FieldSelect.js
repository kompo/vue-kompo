import Field from './Field'

export default {
    mixins: [Field],
    computed: {
        options(){ return this.component.options },
        $_pristine() { return this.$_value.length === 0 },
        $_emptyValue() { return [] },
    },
    methods: {
        $_setInitialValue(){
            this.component.value = this.getOptionFromValue() || this.$_emptyValue
        },
        getOptionFromValue(){
            return this.$_multiple ? 
                _.map(this.$_value, (val) => {
                    var index = _.findIndex(this.options, (option) => { return val == option.value })
                    return index !== -1 && this.options[index]
                }): 
                _.filter(this.options, (o) => {return o.value == this.$_value} )
        },
    },
}