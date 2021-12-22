<template>
    <component 
    	v-bind="$_layoutWrapperAttributes" 
    	v-show="!$_hidden"
        @click="$_clickAction"
        v-turbo-click="component.turbo">
        <template v-for="(row,index) in elements">
            <component v-bind="$_attributes(row)" />
        </template>
    </component>
</template>

<script>
import Layout from '../mixins/Layout'

export default {
    mixins: [Layout],
    computed:{
        $_customLayoutAttributes(){
            return this.$_layoutHrefAttributes
        }
    }
}
</script>
