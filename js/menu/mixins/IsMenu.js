import Element from '../../element/mixins/Element'
import IsKomposer from '../../mixins/IsKomposer'
import HasKomponents from '../../form/mixins/HasKomponents'

export default {
    mixins: [Element, IsKomposer, HasKomponents],
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
        }
    }
}