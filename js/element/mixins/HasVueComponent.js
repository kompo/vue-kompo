export default {
    methods: {
        $_vueComponent(element){
            return element ? element.vueComponent : this.component.vueComponent
        },
        $_vueTag(element){
            return 'Vl' + this.$_vueComponent(element)
        },
        $_komponentTag(komponent){
            return komponent ? komponent.vueKomponentTag : this.component.vueKomponentTag
        },
    }
}
