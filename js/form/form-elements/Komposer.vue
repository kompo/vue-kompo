<template>

    <component
        v-bind="$_attributes" 
        @click.stop="$_clickAction" 
        @closeModal="closeModal"  
        @closePanel="closePanel"  
        @confirmModal="confirmModal" 
    />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed:{
        $_attributes(){
            return {
                is: this.$_komposerTag(this.component),
                vkompo: this.component,
                kompoid: this.$_elKompoId || this.kompoid,
            }
        }
    }
}
</script>
