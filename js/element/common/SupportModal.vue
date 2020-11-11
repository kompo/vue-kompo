<template>
    <vl-modal 
        :name="modalName" 
        v-bind="modalProps"
        @previous="$emit('previous')" 
        @next="$emit('next')">

        <component 
            v-if="modalComponentProps"
            v-bind="modalComponentProps"
            @closeModal="closeModal"
            @openModal="openModal"
            @refresh="refresh"
            @previous="$emit('previous')" 
            @next="$emit('next')" />

    </vl-modal>
</template>

<script>
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [EmitsEvents],
    props: {
        kompoid: { type: String, required: true }
    },
    data: () => ({
        modalComponentProps: null,
        modalProps: {}
    }),
    computed: {
        modalName(){ return 'modal'+this.kompoid}
    },
    methods: {
        openModal(){ this.$kompo.vlModalShow(this.modalName) },
        closeModal(){ this.$kompo.vlModalClose(this.modalName) },
        refresh(index){this.$emit('refresh', index)},
        
        $_attachEvents(){
            this.$_vlOn('vlModalInsert'+this.kompoid, (componentProps, modalProps) => {
                this.modalComponentProps = componentProps
                this.modalProps = modalProps
                this.$kompo.vlModalShow(this.modalName)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlModalInsert'+this.kompoid
            ])
        }
    },
    created() {
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    },
}

</script>
