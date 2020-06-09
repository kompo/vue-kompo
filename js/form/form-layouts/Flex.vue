<template>
    <component 
        :is="tag"
        :href="href"
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

        tag(){
            return this.component.href ? 'a' : 'div'
        },
        href(){
            return this.component.href
        }

    }
}
</script>
