<template>

    <component
        ref="innerKomponent"
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
    mounted() {
        // Re-assert after inner component's created() overwrites on the shared vkompo
        this.vkompo.$_fillRecursive = this.$_fillRecursive
    },
    updated() {
        // Re-assert if inner component is recreated on re-render
        this.vkompo.$_fillRecursive = this.$_fillRecursive
    },
    methods: {
        $_fillRecursive(jsonFormData, options) {
            if (!options || !options.nestedFields) return

            const child = this.$refs.innerKomponent
            if (child && child.$_fillRecursive) {
                child.$_fillRecursive(jsonFormData, options)
            }
        }
    }
}
</script>
