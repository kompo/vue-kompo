<template>

    <component
        v-bind="$_attributes" 
        @click.stop="$_clickAction" 
        @closeModal="closeModal" 
    />

</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    computed:{
        $_attributes(){
            return {
                //...this.$_defaultOtherAttributes, //the child will have that
                is: this.$_komposerTag(this.component),
                vkompo: this.component,
                kompoid: this.$_elKompoId || this.kompoid
            }
        }
    }
}
</script>
