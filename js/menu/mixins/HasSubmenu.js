export default {
    data: () => ({
        komponents: []
    }),
	methods: {
        $_defaultLayoutAttributes(component) {
            return {
                key: component.id,
                is: this.$_vueTag(component),
                vkompo: component,
                kompoid: this.kompoid || this.$_elKompoId, //this.$_elKompoId is for FormInner or FormPanel outside a form,

                index: this.index,
            }
        },
        $_overwriteBladeClasses(){
            this.$refs.wrapper.classList.value = this.$_classes
        }
    },
    mounted(){
        this.$nextTick(() => this.$_overwriteBladeClasses())
    },
    created() {
        this.komponents = this.component.komponents
    }

}