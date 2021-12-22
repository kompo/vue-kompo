<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <textarea
            v-if="!$_icon && !$_rIcon"
            v-model="component.value"
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
            ref="textarea"
        />
        <div v-if="$_icon || $_rIcon" class="vlInputGroup">
            <div v-if="$_icon" class="vlInputPrepend" @click="focus" v-html="$_icon" />
            <textarea
                v-model="component.value"
                class="vlFormControl"
                v-bind="$_attributes"
                v-on="$_events"
                ref="textarea"
            />
            <div v-if="$_rIcon" class="vlInputAppend" @click="focus" v-html="$_rIcon" />
        </div>
    </vl-form-field>
</template>

<script>
import Field from '../mixins/Field'
export default {
    mixins: [Field],
    computed: {
        $_attributes(){
            return {
                ...this.$_defaultFieldAttributes,
                rows: this.$_config('rows') || 3
            }
        }
    },
    methods: {
        focus(){
            this.$refs.input.focus()
        },
    }
}
</script>

