<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <div v-for="(option,key) in options" :key="key"
            class="vlFormField vlCheckbox" :class="optionClass">
            <label class="vlFormLabel" @click="toggleValue(key)()" :class="getOptionClass(option)" v-html="getOptionLabel(option)"/>
            <div class="vlInputWrapper">
                <input
                    type="checkbox"
                    role="checkbox"
                    v-bind="attributes(key)"
                    :id="$_elementId(key)"
                    @focus="$_focusAction"
                    @blur="$_blurAction"
                    :disabled="isDisabled(option)"
                />
                <div v-on="events(key)" class="vlSwitch" :class="checkedClass(key)">
                    <i class='icon-check'></i>
                </div>
            </div>
        </div>
    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'
export default {
    mixins: [Field],
    computed: {
        options(){ return this.component.options },
        optionClass(){ return this.$_config('optionClass') },
        $_pristine() { return this.$_value.length === 0 },
        $_emptyValue() { return [] },
        optionLabelClass(){ return this.$_config('optionLabelClass') },
    },
    methods: {
        $_setInitialValue(){
            if(!this.$_value){
                this.component.value = []
            }
        },
        $_fill(jsonFormData){
            !this.$_value.length ? 
                jsonFormData[this.$_name] = [] :
                this.$_value.forEach((val, k) => {
                    jsonFormData[this.$_name+'['+k+']'] = val
                })
        },
        attributes(key){
            return {
                ...this.$_attributes,
                'aria-checked': this.checked(key)
            }
        },
        events(key){
            return {
                ...this.$_events,
                'keydown.prevent.space.enter': this.toggleValue(key), // keydown not working with v-on binding
                'click': this.toggleValue(key)
            }
        },
        checked(key) {
            return this.indexOf(key) !== -1
        },
        checkedClass(key){
            return this.checked(key) ? 'vlChecked' : ''
        },
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
        toggleValue(key){
            return ($event) => {
                let selectedOption = this.options[key]
                if(this.isDisabled(selectedOption))
                    return

                let index = this.indexOf(key)

                if(index !== -1){
                    this.component.value.splice(index, 1)
                }else{
                    this.component.value.push(this.options[key].value.toString())
                }
                this.changed()
            }
        },
        changed(){
            setTimeout(() => { //when label is clicked somehow we need to wait before $_value is set...
                this.$_changeAction()
                this.$_clearErrors()

                this.$emit('changed', this.$_value)
            }, 50)
        },
        indexOf(key){
            let index = _.indexOf(this.component.value, this.options[key].value)
            if (index !== -1) {
                return index
            }

            return _.indexOf(this.component.value, this.options[key].value.toString())
        }
    }
}
</script>