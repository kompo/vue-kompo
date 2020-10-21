<template>
    <a
        v-if="!$_displayNone" v-show="!$_hidden"
        v-bind="$_attributes" 
        v-turbo-click="component.turbo"
        @click.stop="$_clickAction">

        <label v-if="!$slots.default" v-html="$_label" />

        <slot />

        <span v-if="!$_hideIndicators">
            <vl-spinner-icon :loading="showSpinner" />
            <vl-success-icon :success="showCheckmark" />
            <vl-error-icon :error="showError" />
        </span>
            
    </a>
</template>

<script>
import Trigger from '../mixins/Trigger'
export default {
    mixins: [Trigger],
    computed:{
        $_attributes(){
            return {
                ...this.$_defaultTriggerAttributes,
                href: this.component.href || 'javascript:void(0)',
                target: this.component.target
            }
        },
        $_customClassArray(){
            return [
                this.linkClass
            ]
        },
        linkClass(){
            return this.$_classString([
                this.$_data('btnStyle') ? 'vlBtn' : '',
                this.$_data('btnOutlined') ? 'vlBtnOutlined' : '',
                this.$_data('btnPlain') ? 'vlBtnPlain' : '',
                this.$_data('secondary') ? 'vlSecondary' : '',
                this.$_data('btnInline') ? 'vlBtnInline' : '',
                this.$_data('btnBlock') ? 'vlBtnBlock' : '' //inline by default
            ])
        }
    }
}
</script>
