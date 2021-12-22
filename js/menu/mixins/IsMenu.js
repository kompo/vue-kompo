import BaseElement from '../../element/mixins/BaseElement'
import IsKomponent from '../../mixins/IsKomponent'
import HasElements from '../../form/mixins/HasElements'

export default {
    mixins: [BaseElement, IsKomponent, HasElements],
	computed: {
        $_menuClass(){
            return this.$_classString([
                this.$_config('menuClass'),
                this.$_phpClasses,
                this.$_customClassArray,
            ])
        },
        $_menuAttributes(){
            return {
                ...this.$_defaultElementAttributes,
                class: this.$_menuClass,
                style: this.$_elementStyles
            }
        },
    },

    methods: {
        $_attachEvents(){
            this.$_deliverKompoInfoOn()
        },
        $_destroyEvents(){
            this.$_vlOff([
                this.$_deliverKompoInfoOff
            ])
        },
    }
}