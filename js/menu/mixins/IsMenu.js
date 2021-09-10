import Element from '../../element/mixins/Element'
import IsKomposer from '../../mixins/IsKomposer'

export default {
    mixins: [Element, IsKomposer],
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
    }
}