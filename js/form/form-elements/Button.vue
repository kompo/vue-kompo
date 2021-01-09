<template>
    <button 
        type="button"
        v-if="!$_displayNone" v-show="!$_hidden"
        v-bind="$_attributes"
        @click="$_clickAction">

        <label v-if="!$slots.default" v-html="$_label" />

        <slot />

        <span v-if="!$_hideIndicators">
            <vl-spinner-icon :loading="showSpinner" />
            <vl-success-icon :success="showCheckmark" />
            <vl-error-icon :error="showError" />
        </span>

    </button>
</template>

<script>
import Trigger from '../mixins/Trigger'
export default {
    mixins: [Trigger],
    computed:{
        $_attributes(){
            return {
                ...this.$_defaultTriggerAttributes,
                vkompo: Object.assign({}, this.vkompo), //otherwise $_state wasn't rendering...
                disabled: this.showSpinner,
                kompoid: this.kompoid
            }
        },
        $_customClassArray(){
            return [
                this.btnClass
            ]
        },
        btnClass(){
            return 'vlBtn' + 
                (this.$_config('btnOutlined') ? ' vlBtnOutlined' : '') +
                (this.$_config('btnPlain') ? ' vlBtnPlain' : '') +
                (this.$_config('btnInline') ? ' vlBtnInline' : '') +
                (this.$_config('btnBlock') ? ' vlBtnBlock' : '') +
                (this.$_config('secondary') ? ' vlSecondary' : '')
        }
    }
}
</script>
