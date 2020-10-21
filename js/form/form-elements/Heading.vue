<template>

    <component 
        :is="heading" 
        v-bind="$_attributes" 
        v-show="!$_hidden"
        v-html="$_label" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other], 
    computed: {
    	heading(){
    		return this.vkompo.headingTag
    	}
    }
}
</script>
