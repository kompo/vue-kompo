<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <input
            type="range"
            v-model="component.value"
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
        />
        <output class="vlInputWrapper"><div class="vlFormControl" v-html="$_value || 0"/></output>
    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'
import HasInputAttributes from '../mixins/HasInputAttributes'

export default {
    mixins: [Field, HasInputAttributes],
    computed: {
        $_attributes() {
            return {
                ...this.$_defaultFieldAttributes,
                ...this.$_defaultInputAttributes
            }
        },
    },
}
</script>

