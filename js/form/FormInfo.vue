<template>

    <span
    	v-if="info" 
    	:aria-label="info"
        :data-balloon-pos="placement" 
        :data-balloon-length="length"
        v-html="infoIcon"/>

</template>

<script>

export default {
    props: ['component'],
    computed: {
        info(){
            return this.component.$_config('info')
        },
        placement(){
            return this.component.$_config('infoPlacement') || 'up'
        },
        length(){
            return this.component.$_config('infoLength') || 'medium'
        },
        infoIcon(){
            return this.component.$_config('infoIcon') || '<i class="icon-question-circle"></i>'
        }
    }
}
</script>