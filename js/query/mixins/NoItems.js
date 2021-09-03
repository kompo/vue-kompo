import HasVueComponent from '../../element/mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],
	props: {
        vkompo: {type: Object, required: true},
        kompoid: { type: String, required: true }
    },
    computed: {
        $_noItemsFound(){ return this.vkompo.noItemsFound },
        $_noItemsAsHtml(){ return !this.$_noItemsFound || _.isString(this.$_noItemsFound)},
        $_noItemsAttributes(){
            return {
                is: this.$_vueTag(this.$_noItemsFound),
                vkompo: this.$_noItemsFound,
                kompoid: this.kompoid
            }
        }
    }
}