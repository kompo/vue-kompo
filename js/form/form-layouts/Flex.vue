<template>
    <component 
        v-bind="$_layoutWrapperAttributes" 
        v-show="!$_hidden">
        <component v-for="(col,index) in komponents"
            :key="index"
            v-bind="$_attributes(col)" />
    </component>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    computed:{
        $_customClassArray(){
            return [
                this.$_data('justifyClass'),
                this.$_data('alignClass') 
            ]
        },
        $_customLayoutAttributes(){
            return this.href ? {
                is: 'a',
                href: this.href
            } : {
                is: 'div'
            }
        },

        href(){
            return (this.component.href && this.component.href != 'javascript:void(0)') ? 
                this.component.href : ''
        }

    }
}
</script>
