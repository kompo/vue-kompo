<template>
    <vl-form-field v-bind="$_wrapperAttributes">

        <div v-for="(option,key) in options" :key="key" role="radiogroup" :class="optionClass">
            <input
                type="radio"
                v-bind="attributes(option)"
                :id="$_elementId(key)"
            />
            <span @click="toggleValue(option)()" :class="optionLabelClass" v-html="option.label"/>
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
                this.component.value = this.checked(option) ? null : option.value
                this.$_blurAction()
            }
        },
    }
}
</script>

