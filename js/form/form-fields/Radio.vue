<template>
    <vl-form-field v-bind="$_wrapperAttributes">

        <div v-for="(option,key) in options" :key="key" role="radiogroup" :class="optionClass">
            <div class="vlInputWrapper">
                <input
                    type="radio"
                    v-bind="attributes(option)"
                    :id="$_elementId(key)"
                    @change="$_changeAction"
                    :disabled="isDisabled(option)"
                />
            </div>
            <label class="vlFormLabel" @click="toggleValue(option)()" :class="getOptionClass(option)" v-html="getOptionLabel(option)"/>
        </div>

    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'

export default {
    mixins: [Field],
    computed:{
        options(){ return this.component.options },
        optionClass(){ return this.$_config('optionClass') },
        optionLabelClass(){ return this.$_config('optionLabelClass') },
    },
    methods: {
        isDisabled(option){
            return option.label && _.isObject(option.label) && option.label.config && option.label.config.disabled
        },
        getOptionLabel(option){
            return option.label && _.isObject(option.label) ? option.label.label : option.label
        },
        getOptionClass(option){
            return this.$_classString([
                option.label && _.isObject(option.label) ? option.label.class : '',
                this.optionLabelClass,
            ])
        },
        attributes(option){
            return {
                ...this.$_attributes,
                'aria-checked': this.checked(option),
                checked: this.checked(option),
            }
        },
        checked(option) {
            return this.$_value == option.value
        },
        toggleValue(option){
            return ($event) => {
                if(this.isDisabled(option))
                    return

                this.component.value = this.checked(option) ? null : option.value
                this.$_changeAction()
                this.$_blurAction()
            }
        },
    }
}
</script>

