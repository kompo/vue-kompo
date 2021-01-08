<template>

    <vl-alert-plain v-bind="$_attributes" v-show="!$_hidden" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed: {
        
        $_attributes() { 
        	return {
        		...this.$_defaultOtherAttributes,
    			message: this.$_pureLabel,
    			icon: this.$_icon
        	}
        }
    }
}
</script>
