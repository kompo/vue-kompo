<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <input
            v-if="!$_icon && !$_rIcon"
            v-model="component.value"
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
            ref="input"
        />
        <div v-if="$_icon || $_rIcon" class="vlInputGroup">
            <div v-if="$_icon" class="vlInputPrepend" @click="focus" v-html="$_icon" />
            <input
                v-model="component.value"
                class="vlFormControl"
                v-bind="$_attributes"
                v-on="$_events"
                ref="input"
            />
            <div v-if="$_rIcon" class="vlInputAppend" @click="focus" v-html="$_rIcon" />
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
        focusOnLoad(){ return this.$_config('focusOnLoad') },
    },
    methods: {
        focus(){
            this.$refs.input.focus()
        },
    },
    mounted(){
        if(this.focusOnLoad)
            this.focus()
    },
}
</script>

