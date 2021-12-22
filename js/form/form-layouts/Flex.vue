<template>
    <component 
        v-bind="$_layoutWrapperAttributes" 
        v-show="!$_hidden"
        @click="$_clickAction"
        v-turbo-click="component.turbo">
        <component v-for="(col,index) in elements"
            :key="index"
            v-bind="$_attributes(col)"
        />
    </component>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    computed:{
        $_customClassArray(){
            return [
                this.$_config('justifyClass'),
                this.$_config('alignClass') 
            ]
        },
        $_customLayoutAttributes(){
            return this.$_layoutHrefAttributes
        }
    }
}
</script>
