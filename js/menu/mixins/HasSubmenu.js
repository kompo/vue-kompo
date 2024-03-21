export default {
    data: () => ({
        elements: []
    }),
	methods: {
        $_defaultLayoutAttributes(component) {
            const hasExtraProps = typeof component.props == 'object' && !Array.isArray(component.props) && component.props !== null

            return {
                key: component.id,
                is: this.$_vueTag(component),
                vkompo: component,
                kompoid: this.kompoid || this.$_elKompoId, //this.$_elKompoId is for FormInner or FormPanel outside a form,

                ...(hasExtraProps ? component.props : {}),

                index: this.index,
            }
        },
        $_overwriteBladeClasses(){
            //this.$refs.wrapper.classList.value = this.$_classes
        }
    },
    mounted(){
        //this.$nextTick(() => this.$_overwriteBladeClasses())
    },
    created() {
        this.elements = this.component.elements
    }

}