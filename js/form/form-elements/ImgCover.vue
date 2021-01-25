<template>

    <div 
        v-if="!$_displayNone"
        v-show="!$_hidden" 
        v-bind="$_attributes" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed: {
    	$_attributes() {
            return Object.assign(
            	this.$_defaultOtherAttributes,{
            	style: this.$_elementStyles +';background-image:url('+this.$_pureLabel+');background-size:cover;background-position:center'
            })
        }
    }
}
</script>
