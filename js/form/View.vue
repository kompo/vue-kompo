<template>
    <VlFormInner 
        v-bind="$_attributes"
        v-on="$_events"
    />
</template>

<script>
import FormInnerWrapper from './mixins/FormInnerWrapper'

export default {
    mixins: [FormInnerWrapper]
}

</script>
