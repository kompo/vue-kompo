<template>

    <div 
        v-if="!$_displayNone" 
        v-show="!$_hidden" 
        v-bind="$_attributes"
        v-html="$_label"
        @click="selectAndClick"
   	/>

</template>

<script>
import Field from '../mixins/Field'
import HasSelectedClass from '../mixins/HasSelectedClass'

export default {
    mixins: [Field, HasSelectedClass],
    computed: {
    	$_attributes() { 
    		return {
    			...this.$_defaultFieldAttributes,
                style: this.$_elementStyles,
                class: this.$_classes,
    		}
    	},
    	$_selectedValue(){
    		return this.$_config('selectedValue')
    	},
        $_customClassArray(){
            return [
                this.$_value ? this.$_selectedClass : this.$_unselectedClass,
                this.$_commonClass,
            ]
        },
    },
    methods: {
        selectAndClick(){
            this.$emit('click')

            this.component.value = this.component.value ? null : this.$_selectedValue
            
            this.$_runOwnInteractions('click')
            this.$_runOwnInteractions('change')
        },

    }
}
</script>

