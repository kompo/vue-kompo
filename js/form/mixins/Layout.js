import Element from './Element'
import BaseElement from '../../element/mixins/BaseElement'
import HasElements from './HasElements'

export default {
    mixins: [ Element, HasElements],

    computed: {
        $_customLayoutAttributes(){
            return {}
        },
        $_layoutWrapperAttributes(){
            return Object.assign({
                    ...this.$_defaultElementAttributes,
                    class: this.$_classes,
                    style: this.$_elementStyles
                }, 
                this.$_customLayoutAttributes
            )
        },
        $_layoutHref(){
            return (this.component.href && this.component.href != 'javascript:void(0)') ? 
                this.component.href : ''
        },
        $_layoutHrefAttributes(){
            if(!this.$_layoutHref)
                return { is: 'div' }

            return Object.assign({ is: 'a', href: this.$_layoutHref }, 
                this.component.target ? {target: this.component.target} : {}
            )
        }
    },

	methods: {
        $_clickAction(){
            this.$_runOwnInteractions('click') //new experimental feature for Flex, Row
        },
        $_getPathById(id, path){
            path = path || ''
            var result = Element.methods.$_getPathById.call(this, id, path)
            if(result) return result
            for(const [key,item] of this.elements.entries()){
                result = item.$_getPathById(id, path + '.elements[' + key + ']')
                if(result) return result
            }            
        },
        $_state(state){
            if(_.isString(state)){
                return BaseElement.methods.$_state.call(this, state)
            }else{

                if (state.loading) {
                    _kompo.toggleSpinner('block')
                }else{
                    _kompo.toggleSpinner('none')
                }

                BaseElement.methods.$_state.call(this, state)
                this.elements.forEach( item => { item.$_state(state) })
            }
        },
        $_toggle(toggleId){
            BaseElement.methods.$_toggle.call(this, toggleId)
            if(!this.$_state('disabled')){
                this.elements.forEach( item => item.$_toggle(toggleId) )
            }
        },
        $_fillRecursive(jsonFormData){
            if(!this.$_hidden)
                this.elements.forEach( item => item.$_fillRecursive(jsonFormData) )
        },
        $_validate(errors) {
            this.elements.forEach( item => item.$_validate(errors) )
        },
        $_getErrors(errors) {
            this.elements.forEach( item => item.$_getErrors(errors) )
        },
        $_resetSort(exceptId) {
            this.elements.forEach( item => item.$_resetSort(exceptId) )
        },
        $_deliverJsonTo(componentId, json){
            this.elements.forEach( item => item.$_deliverJsonTo(componentId, json) )
        }
	},
    mounted(){
        if(this.$_toggleOnLoad)
            this.$_togglesForm()
    }
}
