<template>
    <a class="vlImageOverlay"
    	:href="$_prop('url') || 'javascript:void(0)'" 
    	:class="$_prop('col')" 
    	@click="$_preview">

        <div :class="$_prop('class')"
        	:style="backgroundImage">

            <img v-if="fullImage" class="w-full"
            	:src="$_prop('image')" :alt="$_prop('title')">

	        <div :class="overlayClass" class="absolute inset-0 flex-center">
		        <h2 v-if="$_prop('title')" v-html="$_prop('title')" />
		    </div>

	        <component 
	        	v-if="$_prop('buttons')" 
	        	class="vlToolbar absolute inset-0"
	        	v-bind="componentAttributes($_prop('buttons'))"/>
	        
	    </div>

    </a>
</template>

<script>
import Card from '../mixins/Card'

export default {
    mixins: [Card],
    computed:{
    	fullImage(){
    		return this.layout == 'Masonry' && !this.$_prop('imageHeight')
    	},
    	backgroundImage(){
    		return Object.assign({'position': 'relative'}, this.fullImage ? {} : {
                'background-image': 'url('+this.$_prop('image')+')', 
                'background-size': 'cover',
                'background-position': 'center',
                'height': this.$_prop('imageHeight') || '16rem'
            })
    	},
    	overlayClass(){
    		return this.$_prop('noOverlay') ? '' : 
    			('vlOverlay' + (this.$_prop('title') ? '' : ' vlOverlaySoft'))
    	},
    },
    methods: {
        $_preview(){
            this.$emit('preview', this.index)
        }
    }
}
</script>