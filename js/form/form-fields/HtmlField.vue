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
export default {
    mixins: [Field],
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
    	}
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

