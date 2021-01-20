<template>

    <th 
        v-bind="$_attributes" 
        @click.stop="$_clickAction"
        v-html="thLabel"
    />

</template>

<script>
import Trigger from '../../form/mixins/Trigger'

export default {
    mixins: [Trigger],
    data(){
    	return {
    		sortColumn: '',
    		sortDirection: '',
    		initialDirection: ''
    	}
    },
    created(){
    	if(this.$_sortsQuery){
	    	var sortSpecs = this.$_sortsQuery.split(':')
	    	this.sortColumn = sortSpecs[0]
	    	this.initialDirection = sortSpecs.length == 2 ? sortSpecs[1] : ''
	    }
    },
    computed: {
        $_customClassArray() { 
            return [
                this.$_sortsQuery ? 'cursor-pointer' : null
            ] 
        },
        activeSort(){
        	return this.$_sortsQuery && this.$_state('activeSort')
        },
        sortingDesc(){ return this.activeSort && this.sortDirection == 'DESC' },
        sortingAsc(){ return this.activeSort && this.sortDirection == 'ASC' },
        thLabel(){
            return this.$_label + '<i class="' + this.iconClass + '"></i>'
        },
        iconClass(){
        	return this.sortingDesc ? 'icon-down' : (this.sortingAsc ? 'icon-up' : '')
        },
        $_sortValue(){
        	return this.sortDirection ? (this.sortColumn+':'+this.sortDirection) : ''
        },	
    },
    methods: {
    	customBeforeSort(){
    		if(this.initialDirection == 'DESC'){
    			this.sortDirection = this.sortDirection == '' ? 'DESC' : 
    				(this.sortDirection == 'DESC'? 'ASC' : '')
	    	}else{
	    		this.sortDirection = this.sortDirection == '' ? 'ASC' : 
	    			(this.sortDirection == 'DESC' ? '' : 'DESC')
	    	}
    	}
    }
}
</script>
