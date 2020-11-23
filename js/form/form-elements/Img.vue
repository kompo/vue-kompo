<template>

	<div 
		v-if="!$_displayNone"
	    v-show="!$_hidden" >

	    <img 
	        v-if="!bgCover" 
	        v-bind="$_attributes" 
	        :src="$_label" />

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
    		return this.$_data('backgroundCover')
    	},
    	$_attributes() {
            return Object.assign(
            	this.$_defaultOtherAttributes,{
            	style: Object.assign(this.$_elementStyles, this.bgCover ? {
            		'background-image': 'url('+this.$_label+')',
            		'background-size': 'cover',
            		'background-position': 'center'
            	} : {})
            })
        }
    }
}
</script>
