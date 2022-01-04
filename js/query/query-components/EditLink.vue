<template>

	<component v-bind="$_attributes" @insertForm="insertForm"/>

</template>

<script>
import Trigger from '../../form/mixins/Trigger'

export default {
    mixins: [ Trigger ],
    props: {
        index: {type: Number}, //because addlink doesn't have an index
    },
    created(){
        if(this.component.interactions.length)
            this.component.interactions[0].action.interactions.push(this.component.defaultSuccessInteraction)
    },
    computed:{
       	linkTag(){ return this.component.linkTag },
        keepOpen(){ return this.$_config('keepOpen') },
        warnBeforeClose(){ return this.$_config('warnBeforeClose') },
        $_attributes(){
            return {
                //...this.$_defaultTriggerAttributes, //not needed since the vlLink or vlButton will add them
                vkompo: Object.assign({}, this.vkompo), 
                is: this.linkTag,
                kompoid: this.kompoid
            }
        }
    },
    methods:{
        insertForm(form){
            this.$kompo.vlFillModal({data: form}, this.kompoid, {
                confirmFunc: () => {/*nothing for now*/},
                warnBeforeClose: this.warnBeforeClose,
                closeAfterSubmit: !this.keepOpen,
                refreshParent: true,
            })
        },

        componentProps(form){
            return {
                vkompo: form,
                is: 'VlEditLinkModalContent',
                index: this.index,
                kompoid: this.kompoid,
                keepOpen: this.keepOpen
            }
        },
        modalProps(){
            return {
                warn: this.warnBeforeClose
            }
        }
    }
}
</script>
