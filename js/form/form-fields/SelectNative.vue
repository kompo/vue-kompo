<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <select 
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
            v-model="component.value">
            <option 
                v-for="(option,key) in options" 
                :key="option.value"
                :value="option.value || null"
                v-html="option.label"
                :disabled="!option.value"
                :selected="$_placeholder && !option.value && !$_value"
                :hidden="!option.value" />
        </select>
    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'

export default {
    mixins: [Field],
    computed: {
        options(){ 
            return this.component.options
        },
        $_attributes() { 
            return Object.assign(this.$_defaultFieldAttributes, 
                this.$_multiple ? {
                    multiple: true
                } : {}
            )
        },
    },
    methods: {        
        $_setInitialValue(){
            if(this.$_multiple && !this.component.value)
                this.component.value = []
        },
    }
}
</script>