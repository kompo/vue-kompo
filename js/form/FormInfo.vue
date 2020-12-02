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
            return this.component.$_data('info')
        },
        placement(){
            return this.component.$_data('infoPlacement') || 'up'
        },
        length(){
            return this.component.$_data('infoLength') || 'medium'
        },
        infoIcon(){
            return this.component.$_data('infoIcon') || '<i class="icon-question-circle"></i>'
        }
    }
}
</script>