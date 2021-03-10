<template>

    <span
    	v-if="info" 
    	:aria-label="info"
        :data-balloon-pos="placement" 
        :data-balloon-length="length"
        v-html="infoIcon"/>

</template>

<script>

import HasConfig from '../element/mixins/HasConfig'

export default {
    mixins: [ HasConfig],
    props: ['component'],
    computed: {
        info(){
            return this.$_config('info')
        },
        placement(){
            return this.$_config('infoPlacement') || 'up'
        },
        length(){
            return this.$_config('infoLength') || 'medium'
        },
        infoIcon(){
            return this.$_config('infoIcon') || '<i class="icon-question-circle"></i>'
        }
    }
}
</script>