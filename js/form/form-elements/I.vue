<template>

    <i 
        v-bind="$_attributes" 
        v-show="!$_hidden" 
        v-html="$_pureLabel" 
    />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other]
}
</script>
