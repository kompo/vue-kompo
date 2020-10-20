export default {
    methods: {
        $_vueComponent(element){
            return element ? element.vueComponent : this.component.vueComponent
        },
        $_vueTag(element){
            return 'Vl' + this.$_vueComponent(element)
        },
        $_getKomposerTemplate(obj){
        	return this.$_vueComponent(obj) == 'FormQuery' ? 'vl-query' :  (
                this.$_vueComponent(obj) == 'FormForm' ? 'vl-form' : (
                    this.$_vueComponent(obj) == 'FormMenu' ? 'TODO' : '' 
                )
            )
        }
    }
}
