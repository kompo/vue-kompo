<template>
    <a v-bind="$_attributes" 
        :href="component.href" 
        :target="component.target ? '_blank' : false" 
        v-turbo-click="component.turbo">

        <img :src="component.imageUrl" 
            :style="{
                width: component.imageWidth,
                height: component.imageHeight
            }" 
            class="vlInlineBlock" 
            :class="$_config('imageClass')" alt="">
            
        <span v-html="$_label" />

    </a>
</template>

<script>
import MenuItem from './mixins/MenuItem'

export default {
    mixins: [MenuItem],
    computed: {
        $_customClassArray(){
            return [
                'flex items-center',
                this.$_config('active'),
            ]
        }
    }
}
</script>