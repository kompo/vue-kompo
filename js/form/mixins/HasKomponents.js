import HasVueComponent from '../../element/mixins/HasVueComponent'

export default {
	mixins: [HasVueComponent],
    data: () => ({
        komponents: []
    }),
    methods: {        
        $_attributes(component) { return this.$_defaultLayoutAttributes(component) },
        $_defaultLayoutAttributes(component) {
            return {
                key: component.id,
                is: this.$_vueTag(component),
                vkompo: component,
                kompoid: this.kompoid || this.$_elKompoId, //this.$_elKompoId is for FormInner or FormPanel outside a form,

                index: this.index,
            }
        },
    },
    created() {
        this.komponents = this.component.komponents
    }
}