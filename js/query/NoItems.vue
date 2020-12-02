<template>
	<div>
    	<div v-if="$_noItemsAsHtml" class="vlNoItems" v-html="$_noItemsFound" />
        <div v-else>
            <component v-bind="$_noItemsAttributes" />
        </div>
    </div>
</template>

<script>
import NoItems from './mixins/NoItems'

export default {
    mixins: [NoItems]
}
</script>
