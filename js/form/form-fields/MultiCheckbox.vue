<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <div v-for="(option,key) in options" :key="key"
            class="vlFormField vlCheckbox vlMargins">
            <vl-form-label :component="option" @click="setValue(key)"/>
            <div class="vlInputWrapper">
                <input
                    v-model="component.value"
                    type="checkbox"
                    role="checkbox"
                    v-bind="$_attributes"
                    :id="$_elementId(key)"
                />
                <div v-on="$_events" class="vlToggleArea">
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
    },
    methods: {
        setValue(option){
            let findIndex = _.findIndex(this.component.value, option.value)
            if(findIndex !== -1){
                this.component.value.splice(findIndex, 1)
            }else{
                this.component.value.push(option.value)
            }
            this.$_changeAction()
        },
    }
}
</script>