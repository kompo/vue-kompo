<template>
    <tfoot v-if="footers">
        <vl-table-row :vkompo="footers" :kompoid="kompoid"/>
    </tfoot>
</template>

<script>
import HasVueComponent from '../element/mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],
    props: {
        vkompo: {type: Object, required: true},
        kompoid: {type: String, required: true}
    },
    computed:{
        footers(){
            return this.vkompo.footers
        },
    }
}

</script>
