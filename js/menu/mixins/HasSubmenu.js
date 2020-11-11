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
                kompoid: this.kompoid || this.$_elKompoId //this.$_elKompoId is for FormInner or FormPanel outside a form,
            }
        }
    },
    created() {
        this.komponents = this.component.komponents
    }

}