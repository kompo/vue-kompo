export default {
    computed: {
        $_defaultInputAttributes() { return {
            type: this.$_inputType || 'text',
            min: this.$_inputMin,
            max: this.$_inputMax,
            step: this.$_inputStep,
            pattern: this.$_inputPattern,
            maxlength: this.$_inputMaxlength
        }},
        $_inputType(){return this.$_config('inputType')},
        $_inputMin(){return this.$_config('inputMin')},
        $_inputMax(){return this.$_config('inputMax')},
        $_inputStep(){return this.$_config('inputStep')},
        $_inputPattern(){return this.$_config('inputPattern')},
        $_inputMaxlength(){return this.$_config('inputMaxlength')}
    }
}