<template>

    <img 
        v-if="!$_displayNone"
        v-show="!$_hidden"
        v-bind="$_attributes" 
        :src="$_pureLabel" />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other]
}
</script>
