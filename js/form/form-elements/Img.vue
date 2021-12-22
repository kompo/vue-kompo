<template>

    <img 
        v-if="!$_displayNone"
        v-show="!$_hidden"
        v-bind="$_attributes" 
        :src="src"
        :alt="$_alt" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed: {
        src(){ return this.component.src },
    	$_alt(){ return this.$_config('alt') }
    }
}
</script>
