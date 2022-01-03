<template>
    <div v-bind="$_formFieldAttributes"	v-show="!$_hidden">

        <vl-form-label :component="component" @click="$emit('labelclick')" />

        <slot name="before"/>

        <div v-if="!$_noInputWrapper" class="vlInputWrapper"><slot /></div>
        <div v-else><slot /></div>

        <slot name="after"/>

        <vl-form-field-errors :errors="errors" />

        <vl-form-comment :component="component" />

    </div>
</template>

<script>
export default {
    props: {
        component: { type: Object, required: true },
        errors: { type: Array }
    },
    computed: {
        $_hasErrors: function(){
            return this.errors && this.errors.length
        },
        $_hasLeftIcon(){
            return this.component.$_config('icon')
        },
        $_hidden(){
            return this.component.$_state('vlHidden')
        },
        $_formFieldAttributes(){
            return Object.assign(
                {class: this.$_wrapperClass},
                this.$_wrapperStyle ? {style: this.$_wrapperStyle} : {}
            )
        },
        $_noMargins(){ return this.component.$_config('noMargins') }, 
        $_wrapperClass(){
            return [ 
                this.component.class || '',
                'vlFormField',
                this.$_noMargins ? '' : 'vlMargins',
                this.component.$_state('focusedField') ? 'vlFocusedField' : '',
                this.component.$_state('dirtyField') ? 'vlDirtyField' : '',
                this.$_hasErrors ? 'vlHasErrors' : '',
                this.$_readOnly ? 'vlReadOnly' : '',
                this.$_hasLeftIcon ? 'vlLeftIcon' : '',
            ].filter(n => n).join(' ')
        },
        $_wrapperStyle(){
            return this.component.style || ''
        },
        $_noInputWrapper(){
            return this.component.$_config('noInputWrapper')
        },
        $_readOnly(){
            return this.component.$_config('readOnly')
        }
    }
}
</script>
