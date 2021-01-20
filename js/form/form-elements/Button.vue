<template>
    <button 
        type="button"
        v-if="!$_displayNone" 
        v-show="!$_hidden"
        v-bind="$_attributes"
        @click.stop="$_clickAction"
        v-html="$_btnLinkHtml" 
    />
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
                disabled: this.$_loading,
                kompoid: this.kompoid,
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
