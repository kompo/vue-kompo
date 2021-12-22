<template>

	<vl-form :vkompo="editForm"  @success="success" @closeModal="closeModal" @touchedForm="touchedForm" />

</template>

<script>

export default {
    props: {
        vkompo: {type: Object, required: true},
        kompoid: {type: String, required: true},
        index: {type: Number}, //because addlink doesn't have an index
        keepModalOpen: {type: Boolean, default: false}
    },
    data(){
        return {
            editForm: {}
        }
    },
    created(){
        this.editForm = this.vkompo
    },
    methods:{
        success(response, submitElement){
            this.$emit('refresh', this.index)

            if(!this.keepModalOpen && !submitElement.$_keepModalOpen)
                this.closeModal()
        },
        closeModal(){
            this.$emit('closeModal')
        },
        touchedForm(){
            this.$emit('touchedForm')
        }
    }
}
</script>
