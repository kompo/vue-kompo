<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <div v-if="$_icon" class="vlInputGroup">
            <div class="vlInputPrepend" @click="focus" v-html="$_icon" />
            <input
                v-model="component.value"
                class="vlFormControl"
                v-bind="$_attributes"
                v-on="$_events"
                ref="input"
            />
        </div>
        <input
            v-if="!$_icon && !$_rIcon"
            v-model="component.value"
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
            ref="input"
        />
        <i v-if="clearable" class="vlClearable icon-times" @click="clearValue" />
        <div v-if="$_rIcon" class="vlInputGroup">
            <input
                v-model="component.value"
                class="vlFormControl"
                v-bind="$_attributes"
                v-on="$_events"
                ref="input"
            />
            <div class="vlInputAppend" @click="focus" v-html="$_rIcon" />
        </div>
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
        clearable(){
            return this.$_config('clearable') && this.$_value
        }
    },
    methods: {
        focus(){
            this.$refs.input.focus()
        },
        clearValue(){
            this.component.value = null
            this.$_inputAction()
            this.$_changeAction()
        }
    }
}
</script>

