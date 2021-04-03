<template>
    <component 
    	:is="customLabel" 
    	:vkompo="component"
    	:kompoid="kompoid"
        @click="$emit('click')" />
</template>

<script>
import HasVueComponent from '../../element/mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],
    props: {
        vkompo: {type: String|Object},
    	kompoid: { type: String, required: false }
    },
    computed: {
    	customLabel(){
    		return this.isObjectLabel ? this.$_vueTag(this.vkompo) : 'VlPlainSpan'
    	},
    	component(){
    		return this.isObjectLabel ? this.vkompo : {label: this.vkompo || ''}
    	},
        isObjectLabel(){
            return _.isObject(this.vkompo)
        }
    }
}
</script>