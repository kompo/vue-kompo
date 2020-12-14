<template>
    <vl-form-field v-bind="$_wrapperAttributes">
        <template v-slot:before>
            <div 
                class="vlCounterBtn"
                v-html="$_icon || '-'"
                @click="decrement"
            />
        </template>
        
        <input
            v-model="component.value"
            class="vlFormControl"
            v-bind="$_attributes"
            v-on="$_events"
            ref="input"
        />

        <template v-slot:after> 
            <div 
                class="vlCounterBtn"
                v-html="$_rIcon || '+'"
                @click="increment"
            />
        </template>
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
        }
    },
    methods: {
        increment(){
            if(this.$_value + 1 > this.$_inputMax)
                return

            this.component.value = parseInt(this.$_value || 0) + 1
            this.$_inputAction()
            this.$_changeAction()
        },
        decrement(){
            if(this.$_value - 1 < this.$_inputMin)
                return

            this.component.value = parseInt(this.$_value || 0) - 1
            this.$_inputAction()
            this.$_changeAction()
        }
    }
}
</script>

