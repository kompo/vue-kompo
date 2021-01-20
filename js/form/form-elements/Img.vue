<template>

	<div 
		v-if="!$_displayNone"
	    v-show="!$_hidden" >

	    <img 
	        v-if="!bgCover" 
	        v-bind="$_attributes" 
	        :src="$_pureLabel" />

	    <div v-else
	        v-bind="$_attributes" />

	</div>

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed: {
    	bgCover(){
    		return this.$_config('backgroundCover')
    	},
    	$_attributes() {
            return Object.assign(
            	this.$_defaultOtherAttributes,{
            	style: this.$_elementStyles + (this.bgCover ? 
                    (';background-image:url('+this.$_pureLabel+');background-size:cover;background-position:center')
            	: '')
            })
        }
    }
}
</script>
