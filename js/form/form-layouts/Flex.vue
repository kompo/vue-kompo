<template>
    <component 
        v-bind="$_layoutWrapperAttributes" 
        v-show="!$_hidden"
        @click="$_clickAction"
        v-turbo-click="component.turbo">
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
            return this.$_layoutHrefAttributes
        }
    }
}
</script>
