<template>
    <vl-form-field v-bind="$_wrapperAttributes" @labelclick="changed">
        <input
            v-model="component.value"
            type="checkbox"
            role="checkbox"
            v-bind="$_attributes"
            @focus="$_focusAction"
            @blur="$_blurAction">

        <div v-on="$_events" class="vlSwitch"/>
        <div class="vlDot" @click="toggle" />
    </vl-form-field>
</template>

<script>
import FieldCheckbox from '../mixins/FieldCheckbox'
export default {
    mixins: [FieldCheckbox]
}
</script>