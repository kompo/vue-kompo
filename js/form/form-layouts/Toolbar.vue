<template>
    <div v-bind="$_layoutWrapperAttributes" v-show="!$_hidden">

        <component v-for="(col,index) in elements" 
            :key="index"
            v-bind="$_attributes(col)" />
            
    </div>
</template>

<script>
import Layout from '../mixins/Layout'

//For now Toolbar is the same as flex, but I want to add dropdown functionnality if buttons exceed the allowed width

export default {
    mixins: [Layout],
    computed:{
        $_customClassArray(){
            return [
                this.$_config('justifyClass'),
                this.$_config('alignClass') 
            ]
        },
    }
}
</script>
