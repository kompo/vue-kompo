import BaseElement from '../../element/mixins/BaseElement'
import TurboClick from '../../core/TurboClick'

export default {
    mixins: [ BaseElement ],
	props: {
		vkompo: { type: Object | Array, required: true }, //to override Object ony type in Elements
    	kompoid: { type: String, required: true },
		index: { type: Number },
		active: { type: Boolean },
		layout: { type: String},
	},
	computed:{
		$_props(){ return this.vkompo.elements },

        $_customCardWrapperAttributes(){
            return {}
        },
        $_cardWrapperAttributes(){
            return Object.assign({
                    ...this.$_defaultElementAttributes,
                    class: this.$_classes,
                    style: this.$_elementStyles
                }, 
                this.$_customCardWrapperAttributes
            )
        },
        $_activeClass(){ return this.active ? 'vlActive' : '' },
        $_customClassArray() { return [
            this.$_activeClass
        ] },
	},
	methods:{
        $_clickAction(){
            this.$_runOwnInteractions('click') //new experimental feature for TableRow

            if(this.component.href){
	            if(this.component.turbo){
	                new TurboClick(this.$vnode, this.component.href).trigger()
		        }else{
		            window.location.href = this.component.href
		        }
		    }
        },
		$_prop(propKey){ 
			return this.$_props[propKey] || '' //otherwise classes were showing undefined
		},
        activate(){
        	this.$emit('activate', this.index)
        },
        componentAttributes(component){
        	return {
        		kompoid: this.kompoid,
            	is: this.$_vueTag(component),
            	vkompo: component,
                index: this.index
        	}
        },
	},
	created(){
        this.vkompo.$_prop = this.$_prop
	}
}