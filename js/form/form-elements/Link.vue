<template>
    <a
        v-if="!$_displayNone" 
        v-show="!$_hidden"
        v-bind="$_attributes" 
        v-turbo-click="component.turbo"
        @click.stop="$_clickAction"
        v-html="$_btnLinkHtml" 
    >
        <slot></slot>
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
                this.$_config('active') ? this.$_config('active') : '',
                this.$_config('btnStyle') ? 'vlBtn' : '',
                this.$_config('btnOutlined') ? 'vlBtnOutlined' : '',
                this.$_config('btnPlain') ? 'vlBtnPlain' : '',
                this.$_config('secondary') ? 'vlSecondary' : '',
                this.$_config('btnInline') ? 'vlBtnInline' : '',
                this.$_config('btnBlock') ? 'vlBtnBlock' : '' //inline by default
            ])
        }
    }
}
</script>
