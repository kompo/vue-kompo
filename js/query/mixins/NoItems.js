import HasVueComponent from '../../element/mixins/HasVueComponent'
import HasConfig from '../../element/mixins/HasConfig'

export default {
    mixins: [HasVueComponent, HasConfig],
	props: {
        vkompo: {type: Object, required: true},
        kompoid: { type: String, required: true }
    },
    computed: {
        $_noItemsFound(){ return this.vkompo.noItemsFound },
        $_noItemsAsHtml(){ return !this.$_noItemsFound || _.isString(this.$_noItemsFound)},
        $_noItemsAttributes(){
            return Object.assign({
                is: this.$_vueTag(this.$_noItemsFound),
                vkompo: this.$_noItemsFound,
                kompoid: this.kompoid
            },
                this.$_config('attrs') || {},
            )
        }
    }
}