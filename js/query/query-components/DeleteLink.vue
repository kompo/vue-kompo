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
        deleteTitle(){
            return this.$_config('deleteTitle')
        },
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
            console.log('lfel', this.index)
            const modalSpecs = {
                data: Object.assign({}, this.vkompo, {
                    vueComponent: 'DeleteLinkModalContent',
                    itemIndex: this.index,
                })
            }
            this.$kompo.vlFillModal(modalSpecs, this.kompoid, {
                refreshParent: true,
            })
        },
    },
    created(){
        var confirmComponent = _.cloneDeep(this.vkompo)
        
        confirmComponent.interactions = {}
        this.confirmComponent = confirmComponent
    }
}
</script>
