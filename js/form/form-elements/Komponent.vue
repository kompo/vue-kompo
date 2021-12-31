<template>

    <component
        v-bind="$_attributes" 
        @click.stop="$_clickAction" 
        @closeModal="closeModal"  
        @closePanel="closePanel"  
        @confirmSubmit="confirmSubmit" 
        @touchedForm="$emit('touchedForm')"  
        @success="(response) => $emit('success', response)"  
        @deleted="$emit('deleted')" 
    />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed:{
        $_attributes(){
            return {
                is: this.$_komponentTag(this.component),
                vkompo: this.component,
                kompoid: this.$_elKompoId || this.kompoid,
            }
        }
    },

}
</script>
