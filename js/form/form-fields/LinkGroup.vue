<template>
    <vl-form-field v-bind="$_wrapperAttributes">

        <div v-if="checkAllActivated">
            <vlCustomLabel :vkompo="checkAllActivated" @click="checkUncheckAll" />
        </div>

        <div :class="containerClass" v-bind="$_attributes">

            <div :class="optionClass(option)" 
                :style="optionStyle(option)"
                @click.stop="setValue(key)"
                @keyup.enter.stop="setValue(key)"
                tabindex="0"
                v-for="(option,key) in options" :key="componentKey(key)">

                <vlCustomLabel 
                     v-on="$_events"
                    :vkompo="option.label" 
                    :kompoid="kompoid" 
                    :class="optionInnerClass(option, key)" />

            </div>

        </div>

    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'
import HasSelectedClass from '../mixins/HasSelectedClass'

export default {
    mixins: [Field, HasSelectedClass],
    computed:{
        options(){ return this.component.options },
        containerClass(){ 
            return this.$_classString([
                'vlOptionCont',
                this.$_config('containerClass'),
                this.$_config('guttersClass') 
            ])
        },
        $_emptyValue() { return this.$_multiple ? [] : null },
        checkAllActivated(){ return this.$_multiple && this.$_config('checkAllActivated') }
    },
    methods: {
        checkUncheckAll(){
            this.component = Object.assign({}, this.component, {
                value: this.$_value.length ? this.$_emptyValue : _.map(this.component.options, (opt) => opt.value)
            })

            this.$_setInitialValue()
        },
        optionClass(option){ 
            return this.$_classString([
                'vlOption',
                this.$_config('optionClass'),
                option.selected ? this.$_selectedClass : this.$_unselectedClass,
                this.$_commonClass,
            ])
        },
        optionStyle(option){ 
            return option.selected ? this.$_selectedStyle : this.$_unselectedStyle
        },
        optionInnerClass(option, key){ 
            return this.$_classString([
                this.$_config('optionInnerClass'),
            ])
        },
        $_setInitialValue(){
            this.component.value = this.$_value || this.$_emptyValue

            this.component.options.forEach((option, key) => {
                if(this.$_multiple) {
                    option.selected = this.$_value.includes(option.value) ? true : false
                }else{
                    option.selected = option.value == this.component.value ? true : false
                }
            })
        },
        componentKey(key){ return this.$_elKompoId + key },
        setValue(selectedKey) {

            let selectedOption = this.component.options[selectedKey]
            if(selectedOption.label && _.isObject(selectedOption.label) && selectedOption.label.$_config('disabled'))
                return

            if(this.$_multiple){
                let valueIndex = _.findIndex(this.$_value, (val) => { return val == selectedOption.value })

                if(valueIndex == -1){
                    this.component.value.push(selectedOption.value)
                    selectedOption.selected = true
                }else{
                    this.component.value.splice(valueIndex, 1)
                    selectedOption.selected = false
                }


            }else{

                var oldValue = this.component.value
                this.component.value = null
                this.component.options = _.map(this.component.options, (opt, key) => {
                    opt.selected = key == selectedKey && oldValue != opt.value ? true : false
                    if(opt.selected)
                        this.component.value = opt.value
                    return opt
                })

            }

            this.$_focusAction()
            this.$_changeAction()
            this.$_blurAction()

        },
        $_resetSortValue(){
            this.component.value = null
            this.component.options = _.map(this.component.options, (opt, key) => {
                opt.selected = false
                return opt
            })
        },
    }
}
</script>

