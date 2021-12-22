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
        src(){ return this.component.src },
    	$_attributes() {
            return Object.assign(
            	this.$_defaultOtherAttributes, {
            	style: this.$_elementStyles +';background-image:url('+this.src+');background-size:cover;background-position:'+this.bgPosition,
            })
        },
        bgPosition() {
            return this.$_config('bgPosition') || 'center'
        }
    }
}
</script>
