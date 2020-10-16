<template>
    <component 
    	v-bind="$_layoutWrapperAttributes" 
    	v-show="!$_hidden"
        v-turbo-click="component.turbo">
        <template v-for="(row,index) in komponents">
            <div>
                <component v-bind="$_attributes(row)" />
            </div>
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
