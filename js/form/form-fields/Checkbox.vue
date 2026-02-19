<template>
    <vl-form-field v-bind="$_wrapperAttributes" @labelclick="changed">
        <input
            v-model="component.value"
            type="checkbox"
            role="checkbox"
            v-bind="$_attributes"
            @focus="$_focusAction"
            @blur="$_blurAction"
            @change="$_changeAction"
        />
        <div v-on="$_events" class="vlSwitch" :class="checkedClass">
            <i class='icon-check'></i>
        </div>
    </vl-form-field>
</template>

<script>
import FieldCheckbox from '../mixins/FieldCheckbox'
export default {
    mixins: [FieldCheckbox]
}
</script>