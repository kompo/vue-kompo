<template>
	
	<vl-link 
        v-bind="$_attributes" 
        @click="confirmDelete"
        v-html="$_defaultLabel"
    />

</template>

<script>
import Trigger from '../../form/mixins/Trigger'
export default {
    mixins: [Trigger],
    props: {
        index: {type: Number}, //because addlink doesn't have an index
    },
    data(){
        return {
            confirmComponent: null
        }
    },
    computed:{
        deleteTitle(){ return this.$_config('deleteTitle') },
        $_attributes(){
            return {
                vkompo: Object.assign({}, this.confirmComponent), 
                title: this.deleteTitle,
                kompoid: this.kompoid
            }
        },
        $_defaultLabel(){
            return this.$_label || '<i class="icon-trash" title="'+this.deleteTitle+'"></i>'
        }
    },
    methods: {
        confirmDelete(){
            this.$kompo.vlModalInsert(
                this.kompoid, {
                    vkompo: Object.assign(this.vkompo, {class: '', style: ''}), //TODO make configurable
                    is: this.$options.name+ 'ModalContent',
                    index: this.index,
                    kompoid: this.kompoid
                },
                {}
            )
        },
        $_attachEvents(){
            this.$_vlOn('vlEmit'+this.$_elKompoId, (eventName, eventPayload) => {
                this.$emit('deleted')
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlEmit'+this.$_elKompoId
            ])
        }
    },
    created(){
        var confirmComponent = _.cloneDeep(this.vkompo)
        
        confirmComponent.interactions = {}
        this.confirmComponent = confirmComponent
    }
}
</script>
