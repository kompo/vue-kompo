<template>
	<div>
    	<div class="vlNoItems" v-html="$_noItemsFound" />

    </div>
</template>

<script>
import NoItems from './mixins/NoItems'

export default {
    mixins: [NoItems]
}
</script>
