<template>

    <component :is="heading" v-bind="$_attributes" v-show="!$_hidden">

    	<span v-html="$_label" />

    	<vl-form-info :component="component" />

    </component>

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
