<template>

    <img 
        v-if="!$_displayNone"
        v-show="!$_hidden"
        v-bind="$_attributes" 
        :src="$_pureLabel"
        :alt="$_alt" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed: {
    	$_alt(){ return this.$_config('alt') }
    }
}
</script>
