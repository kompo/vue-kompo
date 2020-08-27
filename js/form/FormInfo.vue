<template>

    <span
    	v-if="info" 
    	:title="info"
        data-toggle="tooltip" 
        data-html="true"
        :data-placement="placement" 
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
            return this.component.$_data('infoPlacement') || 'top'
        },
        infoIcon(){
            return this.component.$_data('infoIcon') || '<i class="icon-question-circle"></i>'
        }
    }
}
</script>